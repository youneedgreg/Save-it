"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCurrency } from "@/contexts/currency-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Globe, Bell, Shield } from "lucide-react"
import type { Currency } from "@/lib/types"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user } = useAuth()
  const { currency, setCurrency } = useCurrency()
  const [notifications, setNotifications] = useState(true)
  const [autoSync, setAutoSync] = useState(true)

  const currencies: Currency[] = ["KES", "USD", "EUR"]

  const currencyNames: Record<Currency, string> = {
    KES: "Kenyan Shilling",
    USD: "US Dollar",
    EUR: "Euro",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account preferences and application settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Account Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Account</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium mt-1">{user?.email || "Not signed in"}</p>
              </div>
              {user && (
                <div>
                  <Label className="text-xs text-muted-foreground">User ID</Label>
                  <p className="text-sm font-mono text-muted-foreground mt-1 text-xs break-all">
                    {user.id}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border my-4" />

          {/* Preferences Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Preferences</h3>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="currency">Default Currency</Label>
                  <p className="text-xs text-muted-foreground">
                    Currency used for displaying amounts
                  </p>
                </div>
                <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                  <SelectTrigger id="currency" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr} - {currencyNames[curr]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="h-px bg-border my-4" />

          {/* Sync & Data Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Sync & Data</h3>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-sync">Auto Sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically sync data to cloud when changes are made
                  </p>
                </div>
                <Switch
                  id="auto-sync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>
              {!user && (
                <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                  Sign in to enable cloud sync and access your data across devices.
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border my-4" />

          {/* Notifications Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

