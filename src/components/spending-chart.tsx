"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { Transaction } from "@/lib/types"

interface SpendingChartProps {
  transactions: Transaction[]
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = t.category
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const chartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Top spending categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
