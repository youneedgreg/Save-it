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
import { getFinancialData, addDebt, updateDebt, deleteDebt } from "@/lib/storage"
import { formatCurrency, calculateDebtPayoffMonths } from "@/lib/calculations"
import type { Debt } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react"

export default function DebtsPage() {
  const { currency } = useCurrency()
  const [debts, setDebts] = useState<Debt[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [dueSoonDebts, setDueSoonDebts] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    remainingAmount: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
    type: "credit-card" as "credit-card" | "loan" | "mortgage" | "other",
  })

  const loadDebts = () => {
    const data = getFinancialData()
    setDebts(data.debts)
  }

  useEffect(() => {
    loadDebts()
  }, [])

  useEffect(() => {
    const newDueSoonDebts = new Set<string>()
    debts.forEach((debt) => {
      const dueDate = new Date(debt.dueDate)
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilDue <= 7 && daysUntilDue >= 0) {
        newDueSoonDebts.add(debt.id)
      }
    })
    setDueSoonDebts(newDueSoonDebts)
  }, [debts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalAmount = Number.parseFloat(formData.totalAmount)
    const remainingAmount = Number.parseFloat(formData.remainingAmount)
    const interestRate = Number.parseFloat(formData.interestRate)
    const minimumPayment = Number.parseFloat(formData.minimumPayment)

    if (
      !formData.name ||
      isNaN(totalAmount) ||
      isNaN(remainingAmount) ||
      isNaN(interestRate) ||
      isNaN(minimumPayment) ||
      !formData.dueDate
    ) {
      return
    }

    if (editingDebt) {
      updateDebt(editingDebt.id, {
        name: formData.name,
        totalAmount,
        remainingAmount,
        interestRate,
        minimumPayment,
        dueDate: formData.dueDate,
        type: formData.type,
      })
    } else {
      addDebt({
        name: formData.name,
        totalAmount,
        remainingAmount,
        interestRate,
        minimumPayment,
        dueDate: formData.dueDate,
        type: formData.type,
      })
    }

    setFormData({
      name: "",
      totalAmount: "",
      remainingAmount: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
      type: "credit-card",
    })
    setEditingDebt(null)
    setIsDialogOpen(false)
    loadDebts()
  }

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt)
    setFormData({
      name: debt.name,
      totalAmount: debt.totalAmount.toString(),
      remainingAmount: debt.remainingAmount.toString(),
      interestRate: debt.interestRate.toString(),
      minimumPayment: debt.minimumPayment.toString(),
      dueDate: debt.dueDate,
      type: debt.type,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this debt?")) {
      deleteDebt(id)
      loadDebts()
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingDebt(null)
    setFormData({
      name: "",
      totalAmount: "",
      remainingAmount: "",
      interestRate: "",
      minimumPayment: "",
      dueDate: "",
      type: "credit-card",
    })
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingAmount, 0)
  const totalPaid = debts.reduce((sum, d) => sum + (d.totalAmount - d.remainingAmount), 0)
  const totalOriginal = debts.reduce((sum, d) => sum + d.totalAmount, 0)

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Debt Management</h1>
            <p className="text-muted-foreground">Track and manage your debts with payoff strategies</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDebt ? "Edit Debt" : "Add New Debt"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Debt Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Credit Card, Student Loan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Debt Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, type: value as "credit-card" | "loan" | "mortgage" | "other" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalAmount">Original Amount</Label>
                    <Input
                      id="totalAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remainingAmount">Remaining Amount</Label>
                    <Input
                      id="remainingAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.remainingAmount}
                      onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumPayment">Minimum Payment</Label>
                    <Input
                      id="minimumPayment"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.minimumPayment}
                      onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Next Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingDebt ? "Update Debt" : "Add Debt"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDebt, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{formatCurrency(totalPaid, currency)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalOriginal > 0 ? ((totalPaid / totalOriginal) * 100).toFixed(1) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {debts.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Focus on paying off high-interest debts first (avalanche method) or smallest balances first (snowball
              method) to accelerate your debt-free journey.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {debts
            .sort((a, b) => b.interestRate - a.interestRate)
            .map((debt) => {
              const progress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100
              const payoffMonths = calculateDebtPayoffMonths(
                debt.remainingAmount,
                debt.minimumPayment,
                debt.interestRate,
              )
              const dueDate = new Date(debt.dueDate)
              const isDueSoon = dueSoonDebts.has(debt.id)

              return (
                <Card key={debt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {debt.name}
                          {isDueSoon && (
                            <span className="text-xs font-normal bg-destructive text-destructive-foreground px-2 py-1 rounded">
                              Due Soon
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="capitalize">{debt.type.replace("-", " ")}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(debt)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(debt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Remaining</p>
                        <p className="text-lg font-bold text-destructive">{formatCurrency(debt.remainingAmount, currency)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Interest Rate</p>
                        <p className="text-lg font-bold">{debt.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Min. Payment</p>
                        <p className="text-lg font-bold">{formatCurrency(debt.minimumPayment, currency)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payoff Time</p>
                        <p className="text-lg font-bold">
                          {payoffMonths === Number.POSITIVE_INFINITY ? "N/A" : `${payoffMonths} mo`}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}% paid off</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(debt.totalAmount - debt.remainingAmount, currency)} paid
                        </span>
                        <span className="text-muted-foreground">Due: {dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {debts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No debts tracked. Add your first debt to start managing it!</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Debt
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
