"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getFinancialData, addWishlistItem, updateWishlistItem, deleteWishlistItem } from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { WishlistItem } from "@/lib/types"
import { Pencil, Trash2, Plus, ExternalLink, ShoppingBag, CheckCircle2 } from "lucide-react"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priority: "medium" as WishlistItem["priority"],
    category: "other" as WishlistItem["category"],
    url: "",
    notes: "",
    savedAmount: "",
    targetDate: "",
  })

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = () => {
    const data = getFinancialData()
    setWishlist(data.wishlist || [])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const itemData = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      priority: formData.priority,
      category: formData.category,
      url: formData.url || undefined,
      notes: formData.notes || undefined,
      savedAmount: formData.savedAmount ? Number.parseFloat(formData.savedAmount) : 0,
      targetDate: formData.targetDate || undefined,
      isPurchased: editingItem?.isPurchased || false,
      addedDate: editingItem?.addedDate || new Date().toISOString(),
    }

    if (editingItem) {
      updateWishlistItem(editingItem.id, itemData)
    } else {
      addWishlistItem(itemData)
    }

    resetForm()
    loadWishlist()
  }

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      price: item.price.toString(),
      priority: item.priority,
      category: item.category,
      url: item.url || "",
      notes: item.notes || "",
      savedAmount: item.savedAmount.toString(),
      targetDate: item.targetDate?.split("T")[0] || "",
    })
    setIsAddOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteWishlistItem(id)
      loadWishlist()
    }
  }

  const handleTogglePurchased = (item: WishlistItem) => {
    updateWishlistItem(item.id, { isPurchased: !item.isPurchased })
    loadWishlist()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      priority: "medium",
      category: "other",
      url: "",
      notes: "",
      savedAmount: "",
      targetDate: "",
    })
    setEditingItem(null)
    setIsAddOpen(false)
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    }
    return colors[priority] || colors.medium
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      electronics: "💻",
      clothing: "👔",
      travel: "✈️",
      home: "🏠",
      entertainment: "🎮",
      other: "🎁",
    }
    return icons[category] || "🎁"
  }

  const activeItems = wishlist.filter((item) => !item.isPurchased)
  const purchasedItems = wishlist.filter((item) => item.isPurchased)
  const totalWishlistValue = activeItems.reduce((sum, item) => sum + item.price, 0)
  const totalSaved = activeItems.reduce((sum, item) => sum + item.savedAmount, 0)

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-balance">Wants Wishlist</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Wishlist Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="New Laptop"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value as WishlistItem["category"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: string) => setFormData({ ...formData, priority: value as WishlistItem["priority"] })}
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
              <div>
                <Label htmlFor="savedAmount">Amount Saved</Label>
                <Input
                  id="savedAmount"
                  type="number"
                  step="0.01"
                  value={formData.savedAmount}
                  onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="targetDate">Target Date (Optional)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="url">URL (Optional)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/product"
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
                  {editingItem ? "Update" : "Add"} Item
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
          <p className="text-sm text-muted-foreground mb-1">Active Items</p>
          <p className="text-2xl font-bold">{activeItems.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold">{formatCurrency(totalWishlistValue)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalSaved)}</p>
        </Card>
      </div>

      {activeItems.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Wishlist</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeItems.map((item) => {
              const progress = (item.savedAmount / item.price) * 100
              const remaining = item.price - item.savedAmount

              return (
                <Card key={item.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <span className="font-semibold">{formatCurrency(item.price)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Saved</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(item.savedAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Remaining</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {item.targetDate && (
                    <div className="mb-3">
                      <span className="text-sm text-muted-foreground">Target: </span>
                      <span className="text-sm font-medium">{new Date(item.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {item.notes && <p className="text-sm text-muted-foreground mb-3 border-t pt-3">{item.notes}</p>}

                  <div className="flex gap-2">
                    {item.url && (
                      <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-3 w-3" />
                          View Item
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleTogglePurchased(item)} className="flex-1">
                      <CheckCircle2 className="mr-2 h-3 w-3" />
                      Mark Purchased
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {purchasedItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Purchased Items</h2>
          <div className="space-y-3">
            {purchasedItems.map((item) => (
              <Card key={item.id} className="p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleTogglePurchased(item)}>
                      Restore
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {wishlist.length === 0 && (
        <Card className="p-8 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No items in your wishlist yet. Add your first item to start saving!</p>
        </Card>
      )}
    </div>
  )
}