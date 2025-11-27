import type {
    FinancialData,
    Budget,
    Debt,
    SavingsGoal,
    Transaction,
    Currency,
    Account,
    Asset,
    Liability,
    LoanGiven,
    Bill,
    Habit,
    WishlistItem,
  } from "./types"
  import { supabase } from "./supabase"
  
  const STORAGE_KEY = "money-mastery-data"
  const CURRENCY_KEY = "money-mastery-currency"
  
  // Helper function to sync data to Supabase (non-blocking)
  const syncToCloud = async (data: FinancialData): Promise<void> => {
    if (typeof window === "undefined") return
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return // Supabase not configured
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return // Not authenticated, skip sync
      
      // Update timestamp
      localStorage.setItem("money-mastery-last-updated", Date.now().toString())
      
      // Sync to Supabase (fire and forget - don't block UI)
      supabase
        .from("financial_data")
        .upsert(
          {
            user_id: user.id,
            data: data,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )
        .then(({ error }) => {
          if (error) {
            console.error("Error syncing to cloud:", {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint,
              fullError: error
            })
          }
        })
        .catch((error) => {
          console.error("Error syncing to cloud:", {
            message: error?.message,
            stack: error?.stack,
            fullError: error
          })
        })
    } catch (error) {
      // Silently fail - offline or not authenticated
      console.debug("Sync skipped:", error)
    }
  }
  
  export const getCurrency = (): Currency => {
    if (typeof window === "undefined") return "KES"
    const stored = localStorage.getItem(CURRENCY_KEY)
    return (stored as Currency) || "KES"
  }
  
  export const setCurrency = (currency: Currency): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(CURRENCY_KEY, currency)
    // Also set cookie for SSR consistency
    document.cookie = `${CURRENCY_KEY}=${currency}; path=/; max-age=31536000` // 1 year
  }
  
  export const getFinancialData = (): FinancialData => {
    if (typeof window === "undefined") {
      return getDefaultData()
    }
  
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const defaultData = getDefaultData()
      saveFinancialData(defaultData)
      return defaultData
    }
  
    try {
      const data = JSON.parse(stored)
      if (!data.currency) {
        data.currency = getCurrency()
      }
      return data
    } catch {
      return getDefaultData()
    }
  }
  
  export const saveFinancialData = (data: FinancialData): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // Sync to cloud if authenticated (non-blocking)
    syncToCloud(data)
  }
  
  export const addBudget = (budget: Omit<Budget, "id">): void => {
    const data = getFinancialData()
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    }
    data.budgets.push(newBudget)
    saveFinancialData(data)
  }
  
  export const updateBudget = (id: string, updates: Partial<Budget>): void => {
    const data = getFinancialData()
    const index = data.budgets.findIndex((b) => b.id === id)
    if (index !== -1) {
      data.budgets[index] = { ...data.budgets[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteBudget = (id: string): void => {
    const data = getFinancialData()
    data.budgets = data.budgets.filter((b) => b.id !== id)
    saveFinancialData(data)
  }
  
  export const addDebt = (debt: Omit<Debt, "id">): void => {
    const data = getFinancialData()
    const newDebt = {
      ...debt,
      id: Date.now().toString(),
    }
    data.debts.push(newDebt)
    saveFinancialData(data)
  }
  
  export const updateDebt = (id: string, updates: Partial<Debt>): void => {
    const data = getFinancialData()
    const index = data.debts.findIndex((d) => d.id === id)
    if (index !== -1) {
      data.debts[index] = { ...data.debts[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteDebt = (id: string): void => {
    const data = getFinancialData()
    data.debts = data.debts.filter((d) => d.id !== id)
    saveFinancialData(data)
  }
  
  export const addSavingsGoal = (goal: Omit<SavingsGoal, "id">): void => {
    const data = getFinancialData()
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    }
    data.savingsGoals.push(newGoal)
    saveFinancialData(data)
  }
  
  export const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>): void => {
    const data = getFinancialData()
    const index = data.savingsGoals.findIndex((g) => g.id === id)
    if (index !== -1) {
      data.savingsGoals[index] = { ...data.savingsGoals[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteSavingsGoal = (id: string): void => {
    const data = getFinancialData()
    data.savingsGoals = data.savingsGoals.filter((g) => g.id !== id)
    saveFinancialData(data)
  }
  
  export const addAccount = (account: Omit<Account, "id">): void => {
    const data = getFinancialData()
    const newAccount = {
      ...account,
      id: Date.now().toString(),
    }
    data.accounts.push(newAccount)
    saveFinancialData(data)
  }
  
  export const updateAccount = (id: string, updates: Partial<Account>): void => {
    const data = getFinancialData()
    const index = data.accounts.findIndex((a) => a.id === id)
    if (index !== -1) {
      data.accounts[index] = { ...data.accounts[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteAccount = (id: string): void => {
    const data = getFinancialData()
    data.accounts = data.accounts.filter((a) => a.id !== id)
    saveFinancialData(data)
  }
  
  export const addAsset = (asset: Omit<Asset, "id">): void => {
    const data = getFinancialData()
    const newAsset = {
      ...asset,
      id: Date.now().toString(),
    }
    data.assets.push(newAsset)
    saveFinancialData(data)
  }
  
  export const updateAsset = (id: string, updates: Partial<Asset>): void => {
    const data = getFinancialData()
    const index = data.assets.findIndex((a) => a.id === id)
    if (index !== -1) {
      data.assets[index] = { ...data.assets[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteAsset = (id: string): void => {
    const data = getFinancialData()
    data.assets = data.assets.filter((a) => a.id !== id)
    saveFinancialData(data)
  }
  
  export const addLiability = (liability: Omit<Liability, "id">): void => {
    const data = getFinancialData()
    const newLiability = {
      ...liability,
      id: Date.now().toString(),
    }
    data.liabilities.push(newLiability)
    saveFinancialData(data)
  }
  
  export const updateLiability = (id: string, updates: Partial<Liability>): void => {
    const data = getFinancialData()
    const index = data.liabilities.findIndex((l) => l.id === id)
    if (index !== -1) {
      data.liabilities[index] = { ...data.liabilities[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteLiability = (id: string): void => {
    const data = getFinancialData()
    data.liabilities = data.liabilities.filter((l) => l.id !== id)
    saveFinancialData(data)
  }
  
  export const addTransaction = (transaction: Omit<Transaction, "id">): void => {
    const data = getFinancialData()
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    data.transactions.unshift(newTransaction)
    saveFinancialData(data)
  }
  
  export const deleteTransaction = (id: string): void => {
    const data = getFinancialData()
    data.transactions = data.transactions.filter((t) => t.id !== id)
    saveFinancialData(data)
  }
  
  export const addLoanGiven = (loan: Omit<LoanGiven, "id">): void => {
    const data = getFinancialData()
    const newLoan = {
      ...loan,
      id: Date.now().toString(),
    }
    data.loansGiven.push(newLoan)
    saveFinancialData(data)
  }
  
  export const updateLoanGiven = (id: string, updates: Partial<LoanGiven>): void => {
    const data = getFinancialData()
    const index = data.loansGiven.findIndex((l) => l.id === id)
    if (index !== -1) {
      data.loansGiven[index] = { ...data.loansGiven[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteLoanGiven = (id: string): void => {
    const data = getFinancialData()
    data.loansGiven = data.loansGiven.filter((l) => l.id !== id)
    saveFinancialData(data)
  }
  
  export const addBill = (bill: Omit<Bill, "id">): void => {
    const data = getFinancialData()
    const newBill = {
      ...bill,
      id: Date.now().toString(),
    }
    data.bills.push(newBill)
    saveFinancialData(data)
  }
  
  export const updateBill = (id: string, updates: Partial<Bill>): void => {
    const data = getFinancialData()
    const index = data.bills.findIndex((b) => b.id === id)
    if (index !== -1) {
      data.bills[index] = { ...data.bills[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteBill = (id: string): void => {
    const data = getFinancialData()
    data.bills = data.bills.filter((b) => b.id !== id)
    saveFinancialData(data)
  }
  
  export const addHabit = (habit: Omit<Habit, "id">): void => {
    const data = getFinancialData()
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
    }
    data.habits.push(newHabit)
    saveFinancialData(data)
  }
  
  export const updateHabit = (id: string, updates: Partial<Habit>): void => {
    const data = getFinancialData()
    const index = data.habits.findIndex((h) => h.id === id)
    if (index !== -1) {
      data.habits[index] = { ...data.habits[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteHabit = (id: string): void => {
    const data = getFinancialData()
    data.habits = data.habits.filter((h) => h.id !== id)
    saveFinancialData(data)
  }
  
  export const toggleHabitCompletion = (id: string, date: string): void => {
    const data = getFinancialData()
    const habit = data.habits.find((h) => h.id === id)
    if (habit) {
      const dateIndex = habit.completedDates.indexOf(date)
      if (dateIndex > -1) {
        habit.completedDates.splice(dateIndex, 1)
      } else {
        habit.completedDates.push(date)
      }
      saveFinancialData(data)
    }
  }
  
  export const addWishlistItem = (item: Omit<WishlistItem, "id">): void => {
    const data = getFinancialData()
    const newItem = {
      ...item,
      id: Date.now().toString(),
    }
    data.wishlist.push(newItem)
    saveFinancialData(data)
  }
  
  export const updateWishlistItem = (id: string, updates: Partial<WishlistItem>): void => {
    const data = getFinancialData()
    const index = data.wishlist.findIndex((w) => w.id === id)
    if (index !== -1) {
      data.wishlist[index] = { ...data.wishlist[index], ...updates }
      saveFinancialData(data)
    }
  }
  
  export const deleteWishlistItem = (id: string): void => {
    const data = getFinancialData()
    data.wishlist = data.wishlist.filter((w) => w.id !== id)
    saveFinancialData(data)
  }
  
  const getDefaultData = (): FinancialData => ({
    transactions: [],
    budgets: [],
    debts: [],
    savingsGoals: [],
    accounts: [],
    assets: [],
    liabilities: [],
    loansGiven: [],
    bills: [],
    habits: [],
    wishlist: [],
    monthlyIncome: 0,
    currency: getCurrency(),
  })
  