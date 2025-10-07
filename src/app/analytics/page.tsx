"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SpendingChart } from "@/components/spending-chart"
import { IncomeExpenseChart } from "@/components/income-expense-chart"
import { getFinancialData } from "@/lib/storage"
import { formatCurrency, calculateNetWorth, calculateMonthlyExpenses, calculateMonthlyIncome } from "@/lib/calculations"
import type { FinancialData } from "@/lib/types"

export default function AnalyticsPage() {
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
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0
  const totalDebt = data.debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / (monthlyIncome * 12)) * 100 : 0

  const insights = []

  if (savingsRate < 10) {
    insights.push({
      type: "warning",
      title: "Low Savings Rate",
      description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% to build wealth faster.`,
    })
  } else if (savingsRate >= 20) {
    insights.push({
      type: "success",
      title: "Great Savings Rate",
      description: `Your savings rate is ${savingsRate.toFixed(1)}%. You're on track to build wealth!`,
    })
  }

  if (debtToIncomeRatio > 40) {
    insights.push({
      type: "warning",
      title: "High Debt-to-Income Ratio",
      description: `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(1)}%. Consider focusing on debt reduction.`,
    })
  }

  const overBudgetCategories = data.budgets.filter((b) => b.spent > b.limit)
  if (overBudgetCategories.length > 0) {
    insights.push({
      type: "warning",
      title: "Over Budget",
      description: `You're over budget in ${overBudgetCategories.length} ${overBudgetCategories.length === 1 ? "category" : "categories"}: ${overBudgetCategories.map((b) => b.category).join(", ")}.`,
    })
  }

  if (netWorth > 0 && insights.filter((i) => i.type === "warning").length === 0) {
    insights.push({
      type: "success",
      title: "Positive Net Worth",
      description: `Your net worth is ${formatCurrency(netWorth)}. Keep up the great work!`,
    })
  }

  const avgDailySpending = monthlyExpenses / 30
  const projectedMonthlySpending = avgDailySpending * 30

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Insights</h1>
          <p className="text-muted-foreground">Understand your financial health with data-driven insights</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Good" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Debt-to-Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{debtToIncomeRatio.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {debtToIncomeRatio < 20 ? "Excellent" : debtToIncomeRatio < 40 ? "Good" : "High"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Daily Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(avgDailySpending)}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(projectedMonthlySpending)}</div>
              <p className="text-xs text-muted-foreground mt-1">At current rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Financial Insights</h2>
          {insights.map((insight, index) => (
            <Alert key={index} variant={insight.type === "warning" ? "destructive" : "default"}>
              {insight.type === "warning" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <AlertTitle>{insight.title}</AlertTitle>
              <AlertDescription>{insight.description}</AlertDescription>
            </Alert>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SpendingChart transactions={data.transactions} />
          <IncomeExpenseChart transactions={data.transactions} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
            <CardDescription>Based on your current financial metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Savings Rate</span>
                  <span className="text-sm text-muted-foreground">{Math.min(savingsRate * 5, 100).toFixed(0)}/100</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${Math.min(savingsRate * 5, 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Debt Management</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.max(100 - debtToIncomeRatio, 0).toFixed(0)}/100
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${Math.max(100 - debtToIncomeRatio, 0)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Budget Adherence</span>
                  <span className="text-sm text-muted-foreground">
                    {(
                      ((data.budgets.length - overBudgetCategories.length) / Math.max(data.budgets.length, 1)) *
                      100
                    ).toFixed(0)}
                    /100
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{
                      width: `${((data.budgets.length - overBudgetCategories.length) / Math.max(data.budgets.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
