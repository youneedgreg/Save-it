"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCurrency } from "@/contexts/currency-context";
import { getFinancialData, addTransaction, deleteTransaction, updateBudget } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { Transaction } from "@/lib/types"
import { Plus, Filter, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react"

const CATEGORIES: string[] = []

export default function TransactionsPage() {
  const { currency } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  })

  const loadTransactions = () => {
    const data = getFinancialData()
    setTransactions(data.transactions)
    setFilteredTransactions(data.transactions)
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory)
    }

    setFilteredTransactions(filtered)
  }, [filterType, filterCategory, transactions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(formData.amount)

    if (!formData.description || isNaN(amount) || !formData.category || !formData.date) {
      return
    }

    const finalAmount = formData.type === "expense" ? -Math.abs(amount) : Math.abs(amount)

    addTransaction({
      description: formData.description,
      amount: finalAmount,
      category: formData.category,
      type: formData.type,
      date: new Date(formData.date).toISOString(),
    })

    // Update budget if it's an expense
    if (formData.type === "expense") {
      const data = getFinancialData()
      const budget = data.budgets.find((b) => b.category === formData.category)
      if (budget) {
        updateBudget(budget.id, {
          spent: budget.spent + Math.abs(amount),
        })
      }
    }

    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(false)
    loadTransactions()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id)
      loadTransactions()
    }
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const netCashFlow = totalIncome - totalExpenses

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">Track all your income and expenses</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) => setFormData({ ...formData, type: value as "income" | "expense" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Grocery shopping"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{formatCurrency(totalIncome, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netCashFlow >= 0 ? "text-secondary" : "text-destructive"}`}>
                {formatCurrency(netCashFlow, currency)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>{filteredTransactions.length} transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={(value: string) => setFilterType(value as "all" | "income" | "expense")}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${transaction.type === "income" ? "bg-secondary/10" : "bg-muted"}`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5 text-secondary" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p
                      className={`text-lg font-semibold ${transaction.type === "income" ? "text-secondary" : "text-foreground"}`}
                    >
                      {transaction.type === "income" ? "+" : ""}
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No transactions found. Add your first transaction to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
