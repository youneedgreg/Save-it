"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Target, Wallet } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getFinancialData } from "@/lib/storage"
import {
  calculateNetWorth,
  calculateMonthlyExpenses,
  calculateMonthlyIncome,
  formatCurrency,
  calculateDebtPayoffMonths,
} from "@/lib/calculations"
import type { FinancialData } from "@/lib/types"
import { Navigation } from "@/components/navigation"

export default function DashboardPage() {
  const [data, setData] = useState<FinancialData | null>(null)

  useEffect(() => {
    setData(getFinancialData())
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const netWorth = calculateNetWorth(data)
  const monthlyExpenses = calculateMonthlyExpenses(data.transactions)
  const monthlyIncome = calculateMonthlyIncome(data.transactions)
  const totalDebt = data.debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  const totalSavings = data.savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Save It</h1>
          <p className="text-muted-foreground text-pretty">
            Take control of your financial future with comprehensive tracking and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            icon={Wallet}
            trend={{
              value: formatCurrency(450),
              positive: true,
            }}
          />
          <StatCard
            title="Monthly Income"
            value={formatCurrency(monthlyIncome)}
            icon={TrendingUp}
            description="Current month"
          />
          <StatCard
            title="Monthly Expenses"
            value={formatCurrency(monthlyExpenses)}
            icon={TrendingDown}
            description="Current month"
          />
        </div>

        {/* Debts Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Debt Overview
            </CardTitle>
            <CardDescription>Total debt: {formatCurrency(totalDebt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.debts.map((debt) => {
              const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
              const payoffMonths = calculateDebtPayoffMonths(
                debt.remainingAmount,
                debt.minimumPayment,
                debt.interestRate,
              )

              return (
                <div key={debt.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{debt.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(debt.remainingAmount)} remaining • {debt.interestRate}% APR
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{progress.toFixed(1)}% paid</p>
                      <p className="text-xs text-muted-foreground">{payoffMonths} months to payoff</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Savings Goals
            </CardTitle>
            <CardDescription>Total saved: {formatCurrency(totalSavings)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.savingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{goal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{progress.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(remaining)} to go</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Budget Tracking
            </CardTitle>
            <CardDescription>Monthly budget progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.budgets.map((budget) => {
              const progress = (budget.spent / budget.limit) * 100
              const remaining = budget.limit - budget.spent
              const isOverBudget = progress > 100

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{budget.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${isOverBudget ? "text-destructive" : ""}`}>
                        {progress.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isOverBudget ? "Over budget!" : `${formatCurrency(remaining)} left`}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(progress, 100)}
                    className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                  />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${transaction.type === "income" ? "text-secondary" : "text-foreground"}`}
                  >
                    {transaction.type === "income" ? "+" : ""}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
