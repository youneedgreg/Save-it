"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Trash2,
  Home,
  Car,
  TrendingUp,
  Gem,
  Laptop,
  MoreHorizontal,
  Building,
  CreditCard,
  FileText,
} from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import {
  getFinancialData,
  addAsset,
  updateAsset,
  deleteAsset,
  addLiability,
  updateLiability,
  deleteLiability,
} from "@/lib/storage"
import { formatCurrency } from "@/lib/calculations"
import type { Asset, Liability } from "@/lib/types"

const assetIcons = {
  property: Home,
  vehicle: Car,
  investment: TrendingUp,
  jewelry: Gem,
  electronics: Laptop,
  other: MoreHorizontal,
}

const liabilityIcons = {
  mortgage: Building,
  "car-loan": Car,
  "personal-loan": FileText,
  "credit-card": CreditCard,
  other: MoreHorizontal,
}

export default function AssetsPage() {
  const { currency } = useCurrency()
  const [assets, setAssets] = useState<Asset[]>([])
  const [liabilities, setLiabilities] = useState<Liability[]>([])
  const [showAssetForm, setShowAssetForm] = useState(false)
  const [showLiabilityForm, setShowLiabilityForm] = useState(false)
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [editingLiabilityId, setEditingLiabilityId] = useState<string | null>(null)

  const [assetFormData, setAssetFormData] = useState({
    name: "",
    type: "property" as Asset["type"],
    value: "",
    purchaseDate: "",
    description: "",
  })

  const [liabilityFormData, setLiabilityFormData] = useState({
    name: "",
    type: "mortgage" as Liability["type"],
    amount: "",
    interestRate: "",
    monthlyPayment: "",
    dueDate: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const data = getFinancialData()
    setAssets(data.assets || [])
    setLiabilities(data.liabilities || [])
  }

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const assetData = {
      name: assetFormData.name,
      type: assetFormData.type,
      value: Number.parseFloat(assetFormData.value) || 0,
      purchaseDate: assetFormData.purchaseDate || undefined,
      description: assetFormData.description || undefined,
    }

    if (editingAssetId) {
      updateAsset(editingAssetId, assetData)
    } else {
      addAsset(assetData)
    }

    setAssetFormData({ name: "", type: "property", value: "", purchaseDate: "", description: "" })
    setShowAssetForm(false)
    setEditingAssetId(null)
    loadData()
  }

  const handleLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const liabilityData = {
      name: liabilityFormData.name,
      type: liabilityFormData.type,
      amount: Number.parseFloat(liabilityFormData.amount) || 0,
      interestRate: liabilityFormData.interestRate ? Number.parseFloat(liabilityFormData.interestRate) : undefined,
      monthlyPayment: liabilityFormData.monthlyPayment
        ? Number.parseFloat(liabilityFormData.monthlyPayment)
        : undefined,
      dueDate: liabilityFormData.dueDate || undefined,
    }

    if (editingLiabilityId) {
      updateLiability(editingLiabilityId, liabilityData)
    } else {
      addLiability(liabilityData)
    }

    setLiabilityFormData({ name: "", type: "mortgage", amount: "", interestRate: "", monthlyPayment: "", dueDate: "" })
    setShowLiabilityForm(false)
    setEditingLiabilityId(null)
    loadData()
  }

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0)
  const netWorth = totalAssets - totalLiabilities

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Assets & Liabilities</h1>
          <p className="text-muted-foreground">Track your net worth and financial position</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Assets</CardTitle>
              <CardDescription>Value of everything you own</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{formatCurrency(totalAssets, currency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Liabilities</CardTitle>
              <CardDescription>Total amount you owe</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-destructive">{formatCurrency(totalLiabilities, currency)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Net Worth</CardTitle>
              <CardDescription>Assets minus liabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${netWorth >= 0 ? "text-primary" : "text-destructive"}`}>
                {formatCurrency(netWorth, currency)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowAssetForm(!showAssetForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>

            {showAssetForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingAssetId ? "Edit Asset" : "Add New Asset"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssetSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="asset-name">Asset Name</Label>
                        <Input
                          id="asset-name"
                          value={assetFormData.name}
                          onChange={(e) => setAssetFormData({ ...assetFormData, name: e.target.value })}
                          placeholder="Family Home"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="asset-type">Type</Label>
                        <Select
                          value={assetFormData.type}
                          onValueChange={(value: Asset["type"]) => setAssetFormData({ ...assetFormData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="property">Property</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="asset-value">Current Value</Label>
                        <Input
                          id="asset-value"
                          type="number"
                          step="0.01"
                          value={assetFormData.value}
                          onChange={(e) => setAssetFormData({ ...assetFormData, value: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="asset-date">Purchase Date (Optional)</Label>
                        <Input
                          id="asset-date"
                          type="date"
                          value={assetFormData.purchaseDate}
                          onChange={(e) => setAssetFormData({ ...assetFormData, purchaseDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="asset-description">Description (Optional)</Label>
                        <Textarea
                          id="asset-description"
                          value={assetFormData.description}
                          onChange={(e) => setAssetFormData({ ...assetFormData, description: e.target.value })}
                          placeholder="Additional details about this asset"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">{editingAssetId ? "Update" : "Add"} Asset</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAssetForm(false)
                          setEditingAssetId(null)
                          setAssetFormData({ name: "", type: "property", value: "", purchaseDate: "", description: "" })
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
              {assets.map((asset) => {
                const Icon = assetIcons[asset.type]
                return (
                  <Card key={asset.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{asset.name}</CardTitle>
                            <CardDescription className="capitalize">{asset.type}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-2">{formatCurrency(asset.value, currency)}</p>
                      {asset.purchaseDate && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Purchased: {new Date(asset.purchaseDate).toLocaleDateString()}
                        </p>
                      )}
                      {asset.description && <p className="text-sm text-muted-foreground mb-4">{asset.description}</p>}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAssetFormData({
                              name: asset.name,
                              type: asset.type,
                              value: asset.value.toString(),
                              purchaseDate: asset.purchaseDate || "",
                              description: asset.description || "",
                            })
                            setEditingAssetId(asset.id)
                            setShowAssetForm(true)
                          }}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this asset?")) {
                              deleteAsset(asset.id)
                              loadData()
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {assets.length === 0 && !showAssetForm && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No assets yet. Add your first asset to track your net worth.
                  </p>
                  <Button onClick={() => setShowAssetForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="liabilities" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setShowLiabilityForm(!showLiabilityForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Liability
              </Button>
            </div>

            {showLiabilityForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingLiabilityId ? "Edit Liability" : "Add New Liability"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLiabilitySubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="liability-name">Liability Name</Label>
                        <Input
                          id="liability-name"
                          value={liabilityFormData.name}
                          onChange={(e) => setLiabilityFormData({ ...liabilityFormData, name: e.target.value })}
                          placeholder="Home Mortgage"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability-type">Type</Label>
                        <Select
                          value={liabilityFormData.type}
                          onValueChange={(value: Liability["type"]) =>
                            setLiabilityFormData({ ...liabilityFormData, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mortgage">Mortgage</SelectItem>
                            <SelectItem value="car-loan">Car Loan</SelectItem>
                            <SelectItem value="personal-loan">Personal Loan</SelectItem>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability-amount">Amount Owed</Label>
                        <Input
                          id="liability-amount"
                          type="number"
                          step="0.01"
                          value={liabilityFormData.amount}
                          onChange={(e) => setLiabilityFormData({ ...liabilityFormData, amount: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability-rate">Interest Rate % (Optional)</Label>
                        <Input
                          id="liability-rate"
                          type="number"
                          step="0.01"
                          value={liabilityFormData.interestRate}
                          onChange={(e) => setLiabilityFormData({ ...liabilityFormData, interestRate: e.target.value })}
                          placeholder="3.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability-payment">Monthly Payment (Optional)</Label>
                        <Input
                          id="liability-payment"
                          type="number"
                          step="0.01"
                          value={liabilityFormData.monthlyPayment}
                          onChange={(e) =>
                            setLiabilityFormData({ ...liabilityFormData, monthlyPayment: e.target.value })
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability-date">Due Date (Optional)</Label>
                        <Input
                          id="liability-date"
                          type="date"
                          value={liabilityFormData.dueDate}
                          onChange={(e) => setLiabilityFormData({ ...liabilityFormData, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">{editingLiabilityId ? "Update" : "Add"} Liability</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowLiabilityForm(false)
                          setEditingLiabilityId(null)
                          setLiabilityFormData({
                            name: "",
                            type: "mortgage",
                            amount: "",
                            interestRate: "",
                            monthlyPayment: "",
                            dueDate: "",
                          })
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
              {liabilities.map((liability) => {
                const Icon = liabilityIcons[liability.type]
                return (
                  <Card key={liability.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-destructive/10 rounded-lg">
                            <Icon className="h-5 w-5 text-destructive" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{liability.name}</CardTitle>
                            <CardDescription className="capitalize">{liability.type.replace("-", " ")}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-2 text-destructive">{formatCurrency(liability.amount, currency)}</p>
                      {liability.interestRate && (
                        <p className="text-sm text-muted-foreground mb-1">Interest Rate: {liability.interestRate}%</p>
                      )}
                      {liability.monthlyPayment && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Monthly Payment: {formatCurrency(liability.monthlyPayment, currency)}
                        </p>
                      )}
                      {liability.dueDate && (
                        <p className="text-sm text-muted-foreground mb-4">
                          Due: {new Date(liability.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setLiabilityFormData({
                              name: liability.name,
                              type: liability.type,
                              amount: liability.amount.toString(),
                              interestRate: liability.interestRate?.toString() || "",
                              monthlyPayment: liability.monthlyPayment?.toString() || "",
                              dueDate: liability.dueDate || "",
                            })
                            setEditingLiabilityId(liability.id)
                            setShowLiabilityForm(true)
                          }}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this liability?")) {
                              deleteLiability(liability.id)
                              loadData()
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {liabilities.length === 0 && !showLiabilityForm && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No liabilities yet. Add your first liability to track your obligations.
                  </p>
                  <Button onClick={() => setShowLiabilityForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Liability
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
