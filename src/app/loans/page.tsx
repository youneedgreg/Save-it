"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getFinancialData, addLoanGiven, updateLoanGiven, deleteLoanGiven } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { LoanGiven } from "@/lib/types"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function LoansPage() {
  const [loans, setLoans] = useState<LoanGiven[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingLoan, setEditingLoan] = useState<LoanGiven | null>(null)
  const [formData, setFormData] = useState({
    borrowerName: "",
    amount: "",
    amountRepaid: "",
    interestRate: "",
    loanDate: "",
    dueDate: "",
    status: "active" as "active" | "repaid" | "overdue",
    notes: "",
  })

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = () => {
    const data = getFinancialData()
    setLoans(data.loansGiven || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const loanData = {
      borrowerName: formData.borrowerName,
      amount: Number.parseFloat(formData.amount),
      amountRepaid: Number.parseFloat(formData.amountRepaid) || 0,
      interestRate: formData.interestRate ? Number.parseFloat(formData.interestRate) : undefined,
      loanDate: formData.loanDate,
      dueDate: formData.dueDate || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
    }

    if (editingLoan) {
      updateLoanGiven(editingLoan.id, loanData)
    } else {
      addLoanGiven(loanData)
    }

    resetForm()
    loadLoans()
  }

  const handleEdit = (loan: LoanGiven) => {
    setEditingLoan(loan)
    setFormData({
      borrowerName: loan.borrowerName,
      amount: loan.amount.toString(),
      amountRepaid: loan.amountRepaid.toString(),
      interestRate: loan.interestRate?.toString() || "",
      loanDate: loan.loanDate,
      dueDate: loan.dueDate || "",
      status: loan.status,
      notes: loan.notes || "",
    })
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this loan?")) {
      deleteLoanGiven(id)
      loadLoans()
    }
  }

  const resetForm = () => {
    setFormData({
      borrowerName: "",
      amount: "",
      amountRepaid: "",
      interestRate: "",
      loanDate: "",
      dueDate: "",
      status: "active",
      notes: "",
    })
    setEditingLoan(null)
    setIsAddOpen(false)
  }

  const totalLent = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = loans.reduce((sum, loan) => sum + loan.amountRepaid, 0)
  const totalOutstanding = totalLent - totalRepaid

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-600 dark:text-blue-400"
      case "repaid":
        return "text-green-600 dark:text-green-400"
      case "overdue":
        return "text-red-600 dark:text-red-400"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-balance">Loans Given Out</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLoan ? "Edit Loan" : "Add New Loan"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="borrowerName">Borrower Name</Label>
                <Input
                  id="borrowerName"
                  value={formData.borrowerName}
                  onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Loan Amount</Label>
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
                <Label htmlFor="amountRepaid">Amount Repaid</Label>
                <Input
                  id="amountRepaid"
                  type="number"
                  step="0.01"
                  value={formData.amountRepaid}
                  onChange={(e) => setFormData({ ...formData, amountRepaid: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="loanDate">Loan Date</Label>
                <Input
                  id="loanDate"
                  type="date"
                  value={formData.loanDate}
                  onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: string) => setFormData({ ...formData, status: value as "active" | "repaid" | "overdue" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="repaid">Repaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
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
                  {editingLoan ? "Update" : "Add"} Loan
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
          <p className="text-sm text-muted-foreground mb-1">Total Lent</p>
          <p className="text-2xl font-bold">{formatCurrency(totalLent)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Repaid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalRepaid)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalOutstanding)}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {loans.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No loans given out yet. Add your first loan to start tracking.</p>
          </Card>
        ) : (
          loans.map((loan) => {
            const remaining = loan.amount - loan.amountRepaid
            const progress = (loan.amountRepaid / loan.amount) * 100

            return (
              <Card key={loan.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{loan.borrowerName}</h3>
                    <p className={`text-sm font-medium ${getStatusColor(loan.status)}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(loan)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(loan.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-lg font-semibold">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Repaid</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(loan.amountRepaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-lg font-semibold">{formatCurrency(remaining)}</p>
                  </div>
                  {loan.interestRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="text-lg font-semibold">{loan.interestRate}%</p>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Repayment Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Loan Date: </span>
                    <span>{new Date(loan.loanDate).toLocaleDateString()}</span>
                  </div>
                  {loan.dueDate && (
                    <div>
                      <span className="text-muted-foreground">Due Date: </span>
                      <span>{new Date(loan.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {loan.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Notes:</p>
                    <p className="text-sm">{loan.notes}</p>
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
