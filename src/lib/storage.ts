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
  
  const STORAGE_KEY = "money-mastery-data"
  const CURRENCY_KEY = "money-mastery-currency"
  
  export const getCurrency = (): Currency => {
    if (typeof window === "undefined") return "KES"
    const stored = localStorage.getItem(CURRENCY_KEY)
    return (stored as Currency) || "KES"
  }
  
  export const setCurrency = (currency: Currency): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(CURRENCY_KEY, currency)
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
    transactions: [
      {
        id: "1",
        date: new Date().toISOString(),
        description: "Monthly Salary",
        amount: 5000,
        category: "Salary",
        type: "income",
      },
      {
        id: "2",
        date: new Date(Date.now() - 86400000).toISOString(),
        description: "Grocery Shopping",
        amount: -150,
        category: "Food",
        type: "expense",
      },
      {
        id: "3",
        date: new Date(Date.now() - 172800000).toISOString(),
        description: "Electric Bill",
        amount: -85,
        category: "Utilities",
        type: "expense",
      },
    ],
    budgets: [
      { id: "1", category: "Food", limit: 500, spent: 150, period: "monthly" },
      { id: "2", category: "Transportation", limit: 300, spent: 120, period: "monthly" },
      { id: "3", category: "Entertainment", limit: 200, spent: 45, period: "monthly" },
    ],
    debts: [
      {
        id: "1",
        name: "Credit Card",
        totalAmount: 5000,
        remainingAmount: 3200,
        interestRate: 18.5,
        minimumPayment: 150,
        dueDate: "2025-11-15",
        type: "credit-card",
      },
      {
        id: "2",
        name: "Student Loan",
        totalAmount: 25000,
        remainingAmount: 18500,
        interestRate: 4.5,
        minimumPayment: 300,
        dueDate: "2025-11-01",
        type: "loan",
      },
    ],
    savingsGoals: [
      {
        id: "1",
        name: "Emergency Fund",
        targetAmount: 10000,
        currentAmount: 3500,
        deadline: "2025-12-31",
        priority: "high",
      },
      {
        id: "2",
        name: "Vacation",
        targetAmount: 3000,
        currentAmount: 800,
        deadline: "2025-08-01",
        priority: "medium",
      },
    ],
    accounts: [
      {
        id: "1",
        name: "Main Checking",
        type: "bank",
        balance: 5000,
        currency: getCurrency(),
        institution: "National Bank",
        accountNumber: "****1234",
      },
      {
        id: "2",
        name: "Cash Wallet",
        type: "cash",
        balance: 500,
        currency: getCurrency(),
      },
      {
        id: "3",
        name: "M-Pesa",
        type: "mobile-money",
        balance: 1200,
        currency: getCurrency(),
      },
    ],
    assets: [
      {
        id: "1",
        name: "Family Home",
        type: "property",
        value: 250000,
        purchaseDate: "2020-01-15",
        description: "3 bedroom house",
      },
      {
        id: "2",
        name: "Toyota Corolla",
        type: "vehicle",
        value: 15000,
        purchaseDate: "2022-06-01",
      },
    ],
    liabilities: [
      {
        id: "1",
        name: "Home Mortgage",
        type: "mortgage",
        amount: 180000,
        interestRate: 3.5,
        monthlyPayment: 1200,
        dueDate: "2045-01-15",
      },
    ],
    loansGiven: [
      {
        id: "1",
        borrowerName: "John Doe",
        amount: 1000,
        amountRepaid: 400,
        interestRate: 5,
        loanDate: "2024-06-01",
        dueDate: "2025-12-01",
        status: "active",
        notes: "Personal loan for business",
      },
    ],
    bills: [
      {
        id: "1",
        name: "Netflix",
        amount: 15.99,
        category: "subscription",
        frequency: "monthly",
        nextDueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        autoPayEnabled: true,
        reminderDays: 3,
      },
      {
        id: "2",
        name: "Electricity",
        amount: 85,
        category: "utility",
        frequency: "monthly",
        nextDueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
        autoPayEnabled: false,
        reminderDays: 5,
      },
    ],
    habits: [
      {
        id: "1",
        name: "Track Daily Expenses",
        description: "Record all expenses in the app",
        category: "financial",
        frequency: "daily",
        targetDays: 30,
        completedDates: [],
        createdDate: new Date().toISOString(),
        color: "#10b981",
      },
      {
        id: "2",
        name: "Review Budget",
        description: "Check budget progress and adjust if needed",
        category: "financial",
        frequency: "weekly",
        completedDates: [],
        createdDate: new Date().toISOString(),
        color: "#3b82f6",
      },
    ],
    wishlist: [
      {
        id: "1",
        name: "New Laptop",
        price: 1200,
        priority: "high",
        category: "electronics",
        savedAmount: 400,
        targetDate: "2025-12-31",
        isPurchased: false,
        addedDate: new Date().toISOString(),
        notes: "For work and personal projects",
      },
      {
        id: "2",
        name: "Weekend Getaway",
        price: 500,
        priority: "medium",
        category: "travel",
        savedAmount: 150,
        isPurchased: false,
        addedDate: new Date().toISOString(),
      },
    ],
    monthlyIncome: 5000,
    currency: getCurrency(),
  })
  