import type { FinancialData, Transaction, Currency } from "./types"

export const calculateNetWorth = (data: FinancialData): number => {
  const totalSavings = data.savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalDebt = data.debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  return totalSavings - totalDebt
}

export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return transactions
    .filter((t) => t.type === "expense" && new Date(t.date) >= firstDayOfMonth)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return transactions
    .filter((t) => t.type === "income" && new Date(t.date) >= firstDayOfMonth)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyConfig = {
    KES: { locale: "en-KE", currency: "KES" },
    USD: { locale: "en-US", currency: "USD" },
    EUR: { locale: "de-DE", currency: "EUR" },
    GBP: { locale: "en-GB", currency: "GBP" },
    JPY: { locale: "ja-JP", currency: "JPY" },
    CAD: { locale: "en-CA", currency: "CAD" },
    AUD: { locale: "en-AU", currency: "AUD" },
    CHF: { locale: "de-CH", currency: "CHF" },
    CNY: { locale: "zh-CN", currency: "CNY" },
    INR: { locale: "en-IN", currency: "INR" },
  }

  const config = currencyConfig[currency]
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(amount)
}

export const calculateDebtPayoffMonths = (
  remainingAmount: number,
  monthlyPayment: number,
  interestRate: number,
): number => {
  if (monthlyPayment <= 0) return Number.POSITIVE_INFINITY

  const monthlyRate = interestRate / 100 / 12
  if (monthlyRate === 0) return Math.ceil(remainingAmount / monthlyPayment)

  const months = Math.log(monthlyPayment / (monthlyPayment - remainingAmount * monthlyRate)) / Math.log(1 + monthlyRate)
  return Math.ceil(months)
}
