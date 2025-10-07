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
import { getFinancialData, addHabit, updateHabit, deleteHabit, toggleHabitCompletion } from "@/lib/storage"
import type { Habit } from "@/lib/types"
import { Pencil, Trash2, Plus, CheckCircle2, Circle, TrendingUp } from "lucide-react"

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "financial" as Habit["category"],
    frequency: "daily" as Habit["frequency"],
    targetDays: "",
    color: "#10b981",
  })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = () => {
    const data = getFinancialData()
    setHabits(data.habits || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const habitData = {
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category,
      frequency: formData.frequency,
      targetDays: formData.targetDays ? Number.parseInt(formData.targetDays) : undefined,
      completedDates: editingHabit?.completedDates || [],
      createdDate: editingHabit?.createdDate || new Date().toISOString(),
      color: formData.color,
    }

    if (editingHabit) {
      updateHabit(editingHabit.id, habitData)
    } else {
      addHabit(habitData)
    }

    resetForm()
    loadHabits()
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description || "",
      category: habit.category,
      frequency: habit.frequency,
      targetDays: habit.targetDays?.toString() || "",
      color: habit.color || "#10b981",
    })
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(id)
      loadHabits()
    }
  }

  const handleToggleCompletion = (habitId: string, date: string) => {
    toggleHabitCompletion(habitId, date)
    loadHabits()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "financial",
      frequency: "daily",
      targetDays: "",
      color: "#10b981",
    })
    setEditingHabit(null)
    setIsAddOpen(false)
  }

  const getTodayString = () => {
    return new Date().toISOString().split("T")[0]
  }

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(getTodayString())
  }

  const getCurrentStreak = (habit: Habit) => {
    const sortedDates = [...habit.completedDates].sort().reverse()
    let streak = 0
    const today = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const checkDateString = checkDate.toISOString().split("T")[0]

      if (sortedDates.includes(checkDateString)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getCompletionRate = (habit: Habit) => {
    if (!habit.targetDays) return null
    return Math.round((habit.completedDates.length / habit.targetDays) * 100)
  }

  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
      })
    }
    return days
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      financial: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      health: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      productivity: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      personal: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    }
    return colors[category] || colors.other
  }

  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)
  const completedToday = habits.filter(isCompletedToday).length

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-balance">Habits Tracker</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHabit ? "Edit Habit" : "Add New Habit"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Track daily expenses"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: any) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetDays">Target Days (Optional)</Label>
                <Input
                  id="targetDays"
                  type="number"
                  value={formData.targetDays}
                  onChange={(e) => setFormData({ ...formData, targetDays: e.target.value })}
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingHabit ? "Update" : "Add"} Habit
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
          <p className="text-sm text-muted-foreground mb-1">Active Habits</p>
          <p className="text-2xl font-bold">{habits.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Completed Today</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {completedToday}/{habits.length}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Completions</p>
          <p className="text-2xl font-bold">{totalCompletions}</p>
        </Card>
      </div>

      <div className="space-y-4">
        {habits.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No habits yet. Add your first habit to start tracking.</p>
          </Card>
        ) : (
          habits.map((habit) => {
            const streak = getCurrentStreak(habit)
            const completionRate = getCompletionRate(habit)
            const last7Days = getLast7Days()

            return (
              <Card key={habit.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                      <h3 className="text-lg font-semibold">{habit.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(habit.category)}`}>
                        {habit.category}
                      </span>
                    </div>
                    {habit.description && <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{habit.frequency}</span>
                      {streak > 0 && (
                        <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                          <TrendingUp className="h-3 w-3" />
                          {streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(habit)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(habit.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {last7Days.map((day) => {
                    const isCompleted = habit.completedDates.includes(day.date)
                    const isToday = day.date === getTodayString()

                    return (
                      <button
                        key={day.date}
                        onClick={() => handleToggleCompletion(habit.id, day.date)}
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors"
                        type="button"
                      >
                        <span className="text-xs text-muted-foreground">{day.label}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="h-6 w-6" style={{ color: habit.color }} />
                        ) : (
                          <Circle className={`h-6 w-6 ${isToday ? "text-primary" : "text-muted-foreground"}`} />
                        )}
                      </button>
                    )
                  })}
                </div>

                {completionRate !== null && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${completionRate}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {habit.completedDates.length} of {habit.targetDays} days completed
                    </p>
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
