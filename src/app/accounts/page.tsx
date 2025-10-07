"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Building2, Wallet, Smartphone, TrendingUp, MoreHorizontal } from "lucide-react"
import { getFinancialData, addAccount, updateAccount, deleteAccount } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { Account } from "@/lib/types"

const accountIcons = {
  bank: Building2,
  cash: Wallet,
  "mobile-money": Smartphone,
  investment: TrendingUp,
  other: MoreHorizontal,
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "bank" as Account["type"],
    balance: "",
    institution: "",
    accountNumber: "",
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = () => {
    const data = getFinancialData()
    setAccounts(data.accounts || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const accountData = {
      name: formData.name,
      type: formData.type,
      balance: Number.parseFloat(formData.balance) || 0,
      currency: getFinancialData().currency,
      institution: formData.institution || undefined,
      accountNumber: formData.accountNumber || undefined,
    }

    if (editingId) {
      updateAccount(editingId, accountData)
    } else {
      addAccount(accountData)
    }

    setFormData({ name: "", type: "bank", balance: "", institution: "", accountNumber: "" })
    setShowForm(false)
    setEditingId(null)
    loadAccounts()
  }

  const handleEdit = (account: Account) => {
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      institution: account.institution || "",
      accountNumber: account.accountNumber || "",
    })
    setEditingId(account.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      deleteAccount(id)
      loadAccounts()
    }
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Accounts</h1>
            <p className="text-muted-foreground">Manage your financial accounts and balances</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Combined balance across all accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{formatCurrency(totalBalance)}</p>
            </CardContent>
          </Card>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Account" : "Add New Account"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Main Checking"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Account Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: Account["type"]) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="mobile-money">Mobile Money</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance</Label>
                    <Input
                      id="balance"
                      type="number"
                      step="0.01"
                      value={formData.balance}
                      onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution (Optional)</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="National Bank"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="****1234"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingId ? "Update" : "Add"} Account</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      setFormData({ name: "", type: "bank", balance: "", institution: "", accountNumber: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const Icon = accountIcons[account.type]
            return (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <CardDescription className="capitalize">{account.type.replace("-", " ")}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-4">{formatCurrency(account.balance)}</p>
                  {account.institution && (
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="font-medium">Institution:</span> {account.institution}
                    </p>
                  )}
                  {account.accountNumber && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium">Account:</span> {account.accountNumber}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(account)} className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(account.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {accounts.length === 0 && !showForm && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No accounts yet. Add your first account to get started.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}