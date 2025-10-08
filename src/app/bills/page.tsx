"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCurrency } from "@/contexts/currency-context"
import { getFinancialData, addBill, updateBill, deleteBill } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { Bill } from "@/lib/types"
import { Pencil, Trash2, Plus, Bell, Calendar } from "lucide-react"

export default function BillsPage() {
  const { currency } = useCurrency()
  const [bills, setBills] = useState<Bill[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "subscription" as Bill["category"],
    frequency: "monthly" as Bill["frequency"],
    nextDueDate: "",
    autoPayEnabled: false,
    reminderDays: "",
    notes: "",
  })

  useEffect(() => {
    loadBills()
  }, [])

  const loadBills = () => {
    const data = getFinancialData()
    setBills(data.bills || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const billData = {
      name: formData.name,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      frequency: formData.frequency,
      nextDueDate: formData.nextDueDate,
      autoPayEnabled: formData.autoPayEnabled,
      reminderDays: formData.reminderDays ? Number.parseInt(formData.reminderDays) : undefined,
      notes: formData.notes || undefined,
    }

    if (editingBill) {
      updateBill(editingBill.id, billData)
    } else {
      addBill(billData)
    }

    resetForm()
    loadBills()
  }

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill)
    setFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      category: bill.category,
      frequency: bill.frequency,
      nextDueDate: bill.nextDueDate.split("T")[0],
      autoPayEnabled: bill.autoPayEnabled,
      reminderDays: bill.reminderDays?.toString() || "",
      notes: bill.notes || "",
    })
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      deleteBill(id)
      loadBills()
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      category: "subscription",
      frequency: "monthly",
      nextDueDate: "",
      autoPayEnabled: false,
      reminderDays: "",
      notes: "",
    })
    setEditingBill(null)
    setIsAddOpen(false)
  }

  const calculateMonthlyTotal = () => {
    return bills.reduce((sum, bill) => {
      let monthlyAmount = bill.amount
      switch (bill.frequency) {
        case "daily":
          monthlyAmount = bill.amount * 30
          break
        case "weekly":
          monthlyAmount = bill.amount * 4
          break
        case "quarterly":
          monthlyAmount = bill.amount / 3
          break
        case "yearly":
          monthlyAmount = bill.amount / 12
          break
      }
      return sum + monthlyAmount
    }, 0)
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      subscription: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      utility: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      insurance: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      rent: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      "loan-payment": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    }
    return colors[category] || colors.other
  }

  const upcomingBills = bills
    .filter((bill) => getDaysUntilDue(bill.nextDueDate) <= 7 && getDaysUntilDue(bill.nextDueDate) >= 0)
    .sort((a, b) => getDaysUntilDue(a.nextDueDate) - getDaysUntilDue(b.nextDueDate))

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-balance">Bills & Subscriptions</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bill
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBill ? "Edit Bill" : "Add New Bill"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Bill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Netflix, Electricity, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value as Bill["category"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="loan-payment">Loan Payment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: string) => setFormData({ ...formData, frequency: value as Bill["frequency"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nextDueDate">Next Due Date</Label>
                <Input
                  id="nextDueDate"
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autoPay">Auto-Pay Enabled</Label>
                <Switch
                  id="autoPay"
                  checked={formData.autoPayEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoPayEnabled: checked })}
                />
              </div>
              <div>
                <Label htmlFor="reminderDays">Reminder (days before)</Label>
                <Input
                  id="reminderDays"
                  type="number"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBill ? "Update" : "Add"} Bill
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Bills</p>
          <p className="text-2xl font-bold">{bills.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Monthly Total</p>
          <p className="text-2xl font-bold">{formatCurrency(calculateMonthlyTotal(), currency)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Upcoming (7 days)</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{upcomingBills.length}</p>
        </Card>
      </div>

      {upcomingBills.length > 0 && (
        <Card className="p-6 mb-6 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-lg font-semibold">Upcoming Bills</h2>
          </div>
          <div className="space-y-3">
            {upcomingBills.map((bill) => {
              const daysUntil = getDaysUntilDue(bill.nextDueDate)
              return (
                <div key={bill.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Due in {daysUntil} {daysUntil === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(bill.amount, currency)}</p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {bills.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No bills or subscriptions yet. Add your first bill to start tracking.
            </p>
          </Card>
        ) : (
          bills.map((bill) => {
            const daysUntil = getDaysUntilDue(bill.nextDueDate)
            const isOverdue = daysUntil < 0

            return (
              <Card key={bill.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{bill.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(bill.category)}`}>
                        {bill.category.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{bill.frequency}</span>
                      {bill.autoPayEnabled && <span className="text-green-600 dark:text-green-400">Auto-Pay</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(bill)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(bill.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-xl font-semibold">{formatCurrency(bill.amount, currency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <p className="font-medium">{new Date(bill.nextDueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p
                      className={`font-medium ${isOverdue ? "text-red-600 dark:text-red-400" : daysUntil <= 7 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}
                    >
                      {isOverdue
                        ? `Overdue by ${Math.abs(daysUntil)} days`
                        : daysUntil === 0
                          ? "Due today"
                          : `Due in ${daysUntil} days`}
                    </p>
                  </div>
                </div>

                {bill.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Notes:</p>
                    <p className="text-sm">{bill.notes}</p>
                  </div>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
