"use client"

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { getFinancialData, saveFinancialData } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"
import type { FinancialData } from "@/lib/types"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  syncData: () => Promise<void>
  isSyncing: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { toast } = useToast()

  const syncDataToCloud = useCallback(async (userToSync?: User): Promise<boolean> => {
    const targetUser = userToSync || user
    if (!targetUser || !supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return false
    }

    try {
      const localData = getFinancialData()
      
      // Upload local data to Supabase
      // Use onConflict to specify user_id as the conflict resolution column
      const { error } = await supabase
        .from("financial_data")
        .upsert(
          {
            user_id: targetUser.id,
            data: localData,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )

      if (error) {
        console.error("Error syncing data to cloud:", error)
        
        // Provide helpful error messages
        if (error.code === "42P01" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
          toast({
            title: "Database Table Not Found",
            description: "Please run the migration SQL in your Supabase dashboard. See ENV_SETUP.md for instructions.",
            variant: "destructive",
          })
          return false
        }
        
        if (error.code === "42501" || error.message?.includes("permission") || error.message?.includes("policy")) {
          toast({
            title: "Permission Denied",
            description: "Please check your Row Level Security (RLS) policies in Supabase.",
            variant: "destructive",
          })
          return false
        }
        
        if (error.code === "23505" || error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
          // This shouldn't happen with onConflict, but if it does, try to update instead
          const { error: updateError } = await supabase
            .from("financial_data")
            .update({
              data: localData,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", targetUser.id)
          
          if (updateError) {
            toast({
              title: "Sync Failed",
              description: updateError.message || "Failed to update existing data.",
              variant: "destructive",
            })
            return false
          }
          return true
        }
        
        toast({
          title: "Sync Failed",
          description: error.message || "Unknown error occurred. Please check the console for details.",
          variant: "destructive",
        })
        return false
      }
      
      return true
    } catch (error: unknown) {
      console.error("Error during sync:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred. Please check the console for details."
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }, [user, toast])

  useEffect(() => {
    // Check if Supabase is configured
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      // Supabase not configured or error
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // Sync data when user logs in
      if (session?.user) {
        // Sync after a short delay to ensure state is updated
        setTimeout(async () => {
          await syncDataToCloud(session.user)
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [syncDataToCloud])


  const syncData = async () => {
    if (!user || !supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up your environment variables.",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    try {
      // First, try to fetch cloud data
      const { data: cloudData, error: fetchError } = await supabase
        .from("financial_data")
        .select("data, updated_at")
        .eq("user_id", user.id)
        .single()

      const localData = getFinancialData()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is fine for new users
        console.error("Error fetching cloud data:", fetchError)
        
        // Check if it's a table/RLS issue
        if (fetchError.code === "42P01" || fetchError.message?.includes("relation") || fetchError.message?.includes("does not exist")) {
          toast({
            title: "Database Table Not Found",
            description: "Please run the migration SQL in your Supabase dashboard. See ENV_SETUP.md for instructions.",
            variant: "destructive",
          })
          setIsSyncing(false)
          return
        }
        
        if (fetchError.code === "42501" || fetchError.message?.includes("permission") || fetchError.message?.includes("policy")) {
          toast({
            title: "Permission Denied",
            description: "Please check your Row Level Security (RLS) policies in Supabase.",
            variant: "destructive",
          })
          setIsSyncing(false)
          return
        }
        
        // If fetch fails for other reasons, try to upload local data
        const uploadResult = await syncDataToCloud()
        if (!uploadResult) {
          toast({
            title: "Sync Failed",
            description: fetchError.message || "Unknown error occurred. Please check the console for details.",
            variant: "destructive",
          })
        }
        return
      }

      if (cloudData?.data) {
        // Merge: prefer cloud data if it exists, but merge with local if local is newer
        const cloudUpdated = cloudData.updated_at ? new Date(cloudData.updated_at).getTime() : 0
        const localUpdated = localStorage.getItem("money-mastery-last-updated")
          ? parseInt(localStorage.getItem("money-mastery-last-updated") || "0")
          : 0

        let mergedData: FinancialData

        if (cloudUpdated > localUpdated) {
          // Cloud is newer, use cloud data but keep local currency preference
          mergedData = {
            ...cloudData.data,
            currency: localData.currency, // Keep local currency preference
          }
        } else {
          // Local is newer or equal, merge arrays (combine unique items)
          mergedData = {
            ...localData,
            transactions: mergeArrays(localData.transactions, cloudData.data.transactions),
            budgets: mergeArrays(localData.budgets, cloudData.data.budgets),
            debts: mergeArrays(localData.debts, cloudData.data.debts),
            savingsGoals: mergeArrays(localData.savingsGoals, cloudData.data.savingsGoals),
            accounts: mergeArrays(localData.accounts, cloudData.data.accounts),
            assets: mergeArrays(localData.assets, cloudData.data.assets),
            liabilities: mergeArrays(localData.liabilities, cloudData.data.liabilities),
            loansGiven: mergeArrays(localData.loansGiven, cloudData.data.loansGiven),
            bills: mergeArrays(localData.bills, cloudData.data.bills),
            habits: mergeArrays(localData.habits, cloudData.data.habits),
            wishlist: mergeArrays(localData.wishlist, cloudData.data.wishlist),
          }
        }

        // Save merged data locally
        saveFinancialData(mergedData)
        localStorage.setItem("money-mastery-last-updated", Date.now().toString())

        // Upload merged data to cloud
        const { error: upsertError } = await supabase
          .from("financial_data")
          .upsert(
            {
              user_id: user.id,
              data: mergedData,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
            }
          )
        
        if (upsertError) {
          console.error("Error uploading merged data:", upsertError)
          toast({
            title: "Sync Failed",
            description: upsertError.message || "Unknown error occurred. Please check the console for details.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Your data has been synced successfully!",
          })
        }
      } else {
        // No cloud data, upload local data
        const uploadResult = await syncDataToCloud()
        if (uploadResult) {
          toast({
            title: "Success",
            description: "Your data has been synced successfully!",
          })
        }
      }
    } catch (error: unknown) {
      console.error("Error during sync:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred. Please check the console for details."
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Helper function to merge arrays by ID, keeping the most recent version
  const mergeArrays = <T extends { id: string }>(local: T[], cloud: T[]): T[] => {
    const merged = new Map<string, T>()
    
    // Add cloud items
    cloud.forEach((item) => merged.set(item.id, item))
    
    // Add local items (will overwrite cloud if same ID)
    local.forEach((item) => merged.set(item.id, item))
    
    return Array.from(merged.values())
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { 
        error: { 
          message: "Supabase is not configured",
          name: "ConfigurationError",
          status: 500,
        } as AuthError 
      }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { 
        error: { 
          message: "Supabase is not configured",
          name: "ConfigurationError",
          status: 500,
        } as AuthError 
      }
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return
    await supabase.auth.signOut()
    // Keep local data, just stop syncing
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        syncData,
        isSyncing,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

