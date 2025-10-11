"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/contexts/currency-context"
import { getFinancialData, addBudget, updateBudget, deleteBudget } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { Budget } from "@/lib/types"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function BudgetsPage() {
  const { currency } = useCurrency()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  })

  const loadBudgets = () => {
    const data = getFinancialData()
    setBudgets(data.budgets)
  }

  useEffect(() => {
    loadBudgets()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const limit = Number.parseFloat(formData.limit)

    if (!formData.category || isNaN(limit) || limit <= 0) {
      return
    }

    if (editingBudget) {
      updateBudget(editingBudget.id, {
        category: formData.category,
        limit,
        period: formData.period,
      })
    } else {
      addBudget({
        category: formData.category,
        limit,
        spent: 0,
        period: formData.period,
      })
    }

    setFormData({ category: "", limit: "", period: "monthly" })
    setEditingBudget(null)
    setIsDialogOpen(false)
    loadBudgets()
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      deleteBudget(id)
      loadBudgets()
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingBudget(null)
    setFormData({ category: "", limit: "", period: "monthly" })
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Budget Tracking</h1>
            <p className="text-muted-foreground">Manage your spending limits and track progress</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button data-tour="add-budget-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Food, Transportation"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="limit">Budget Limit</Label>
                  <Input
                    id="limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.limit}
                    onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: string) => setFormData({ ...formData, period: value as "monthly" | "weekly" | "yearly" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingBudget ? "Update Budget" : "Add Budget"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3" data-tour="budget-summary">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget - totalSpent, currency)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {budgets.map((budget) => {
            const progress = (budget.spent / budget.limit) * 100
            const remaining = budget.limit - budget.spent
            const isOverBudget = progress > 100

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{budget.category}</CardTitle>
                      <CardDescription className="capitalize">{budget.period} budget</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-medium">{formatCurrency(budget.spent, currency)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Limit</span>
                      <span className="font-medium">{formatCurrency(budget.limit, currency)}</span>
                    </div>
                    <Progress
                      value={Math.min(progress, 100)}
                      className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                    />
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isOverBudget ? "text-destructive" : "text-secondary"}`}>
                        {progress.toFixed(1)}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isOverBudget ? "Over budget!" : `${formatCurrency(remaining, currency)} left`}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No budgets yet. Create your first budget to start tracking!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
