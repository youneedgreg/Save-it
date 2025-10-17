"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Transaction } from "@/lib/types"

interface IncomeExpenseChartProps {
  transactions: Transaction[]
}

export function IncomeExpenseChart({ transactions }: IncomeExpenseChartProps) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
    }
  })

  const chartData = last6Months.map(({ month, year, monthIndex }) => {
    const monthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate.getMonth() === monthIndex && tDate.getFullYear() === year
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      month,
      income,
      expenses,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Last 6 months trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: {
              label: "Income",
              color: "hsl(var(--chart-2))",
            },
            expenses: {
              label: "Expenses",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="income" stroke="var(--color-income)" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
