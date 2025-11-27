"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User, Session, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { getFinancialData, saveFinancialData } from "@/lib/storage"
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
  }, [])

  const syncDataToCloud = async (userToSync?: User) => {
    const targetUser = userToSync || user
    if (!targetUser || !supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return

    setIsSyncing(true)
    try {
      const localData = getFinancialData()
      
      // Upload local data to Supabase
      const { error } = await supabase
        .from("financial_data")
        .upsert({
          user_id: targetUser.id,
          data: localData,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error("Error syncing data to cloud:", error)
      }
    } catch (error) {
      console.error("Error during sync:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const syncData = async () => {
    if (!user || !supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return

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
        // If fetch fails, upload local data
        await syncDataToCloud()
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
        await supabase
          .from("financial_data")
          .upsert({
            user_id: user.id,
            data: mergedData,
            updated_at: new Date().toISOString(),
          })
      } else {
        // No cloud data, upload local data
        await syncDataToCloud()
      }
    } catch (error) {
      console.error("Error during sync:", error)
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
      return { error: { message: "Supabase is not configured" } as any }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return { error: { message: "Supabase is not configured" } as any }
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

