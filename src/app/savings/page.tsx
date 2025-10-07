"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getFinancialData, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { SavingsGoal } from "@/lib/types"

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null)
  const [contributingGoal, setContributingGoal] = useState<SavingsGoal | null>(null)
  const [contributeAmount, setContributeAmount] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    priority: "medium" as "high" | "medium" | "low",
  })

  const loadGoals = () => {
    const data = getFinancialData()
    setGoals(data.savingsGoals)
  }

  useEffect(() => {
    loadGoals()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetAmount = Number.parseFloat(formData.targetAmount)
    const currentAmount = Number.parseFloat(formData.currentAmount)

    if (!formData.name || isNaN(targetAmount) || isNaN(currentAmount) || !formData.deadline) {
      return
    }

    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, {
        name: formData.name,
        targetAmount,
        currentAmount,
        deadline: formData.deadline,
        priority: formData.priority,
      })
    } else {
      addSavingsGoal({
        name: formData.name,
        targetAmount,
        currentAmount,
        deadline: formData.deadline,
        priority: formData.priority,
      })
    }

    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      priority: "medium",
    })
    setEditingGoal(null)
    setIsDialogOpen(false)
    loadGoals()
  }

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contributingGoal) return

    const amount = Number.parseFloat(contributeAmount)
    if (isNaN(amount) || amount <= 0) return

    updateSavingsGoal(contributingGoal.id, {
      currentAmount: contributingGoal.currentAmount + amount,
    })

    setContributeAmount("")
    setContributingGoal(null)
    setIsContributeDialogOpen(false)
    loadGoals()
  }

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      priority: goal.priority,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this savings goal?")) {
      deleteSavingsGoal(id)
      loadGoals()
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingGoal(null)
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      priority: "medium",
    })
  }

  const openContributeDialog = (goal: SavingsGoal) => {
    setContributingGoal(goal)
    setIsContributeDialogOpen(true)
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const totalRemaining = totalTarget - totalSaved

  const priorityOrder = { high: 0, medium: 1, low: 2 }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
            <p className="text-muted-foreground">Set and track your financial goals</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGoal ? "Edit Savings Goal" : "Add New Savings Goal"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Emergency Fund, Vacation"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Current Amount</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.currentAmount}
                      onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Target Date</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingGoal ? "Update Goal" : "Add Goal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalTarget)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{formatCurrency(totalSaved)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRemaining)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {goals
            .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
            .map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const remaining = goal.targetAmount - goal.currentAmount
              const deadline = new Date(goal.deadline)
              const daysRemaining = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              const isOverdue = daysRemaining < 0
              const isComplete = progress >= 100

              const priorityColors = {
                high: "bg-destructive/10 text-destructive",
                medium: "bg-primary/10 text-primary",
                low: "bg-muted text-muted-foreground",
              }

              return (
                <Card key={goal.id} className={isComplete ? "border-secondary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {goal.name}
                          {isComplete && (
                            <span className="text-xs font-normal bg-secondary text-secondary-foreground px-2 py-1 rounded">
                              Complete
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${priorityColors[goal.priority]}`}
                          >
                            {goal.priority} priority
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(goal)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className={`text-muted-foreground ${isOverdue ? "text-destructive" : ""}`}>
                          {isOverdue ? "Overdue" : `${daysRemaining} days left`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => openContributeDialog(goal)}
                        disabled={isComplete}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Contribute
                      </Button>
                      <div className="flex-1 text-right">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-lg font-bold">{formatCurrency(remaining)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>

        {goals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                No savings goals yet. Create your first goal to start saving!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contribute to {contributingGoal?.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContribute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contributeAmount">Contribution Amount</Label>
                <Input
                  id="contributeAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  required
                />
              </div>
              {contributingGoal && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current</span>
                    <span className="font-medium">{formatCurrency(contributingGoal.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">After contribution</span>
                    <span className="font-medium">
                      {formatCurrency(contributingGoal.currentAmount + (Number.parseFloat(contributeAmount) || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium">{formatCurrency(contributingGoal.targetAmount)}</span>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full">
                Add Contribution
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
