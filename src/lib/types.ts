export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: "income" | "expense"
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: "monthly" | "weekly" | "yearly"
}

export interface Debt {
  id: string
  name: string
  totalAmount: number
  remainingAmount: number
  interestRate: number
  minimumPayment: number
  dueDate?: string
  type: "credit-card" | "loan" | "mortgage" | "other"
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  priority: "high" | "medium" | "low"
}

export interface Account {
  id: string
  name: string
  type: "bank" | "cash" | "mobile-money" | "investment" | "other"
  balance: number
  currency: Currency
  institution?: string
  accountNumber?: string
}

export interface Asset {
  id: string
  name: string
  type: "property" | "vehicle" | "investment" | "jewelry" | "electronics" | "other"
  value: number
  purchaseDate?: string
  description?: string
}

export interface Liability {
  id: string
  name: string
  type: "mortgage" | "car-loan" | "personal-loan" | "credit-card" | "other"
  amount: number
  interestRate?: number
  monthlyPayment?: number
  dueDate?: string
}

export interface LoanGiven {
  id: string
  borrowerName: string
  amount: number
  amountRepaid: number
  interestRate?: number
  loanDate: string
  dueDate?: string
  status: "active" | "repaid" | "overdue"
  notes?: string
}

export interface Bill {
  id: string
  name: string
  amount: number
  category: "subscription" | "utility" | "insurance" | "rent" | "loan-payment" | "other"
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  nextDueDate: string
  autoPayEnabled: boolean
  reminderDays?: number
  notes?: string
}

export interface Habit {
  id: string
  name: string
  description?: string
  category: "financial" | "health" | "productivity" | "personal" | "other"
  frequency: "daily" | "weekly" | "monthly"
  targetDays?: number
  completedDates: string[]
  createdDate: string
  color?: string
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  priority: "high" | "medium" | "low"
  category: "electronics" | "clothing" | "travel" | "home" | "entertainment" | "other"
  url?: string
  notes?: string
  savedAmount: number
  targetDate?: string
  isPurchased: boolean
  addedDate: string
}

export type Currency = "KES" | "USD" | "EUR"

export interface FinancialData {
  transactions: Transaction[]
  budgets: Budget[]
  debts: Debt[]
  savingsGoals: SavingsGoal[]
  accounts: Account[]
  assets: Asset[]
  liabilities: Liability[]
  loansGiven: LoanGiven[]
  bills: Bill[]
  habits: Habit[]
  wishlist: WishlistItem[]
  monthlyIncome: number
  currency: Currency
}