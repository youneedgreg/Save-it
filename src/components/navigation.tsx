"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Target,
  TrendingUp,
  PiggyBank,
  BarChart3,
  Building2,
  Home,
  HandCoins,
  Receipt,
  CheckSquare,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CurrencySelector } from "./currency-selector"
import { ThemeToggle } from "./theme-toggle"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Building2 },
  { href: "/assets", label: "Assets", icon: Home },
  { href: "/budgets", label: "Budgets", icon: Wallet },
  { href: "/debts", label: "Debts", icon: CreditCard },
  { href: "/loans", label: "Loans", icon: HandCoins },
  { href: "/bills", label: "Bills", icon: Receipt },
  { href: "/habits", label: "Habits", icon: CheckSquare },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/transactions", label: "Transactions", icon: TrendingUp },
  { href: "/savings", label: "Savings", icon: Target },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Money Mastery</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <ThemeToggle />
            <CurrencySelector />
          </div>
        </div>
      </div>
    </nav>
  )
}
