"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Target,
  TrendingUp,
  BarChart3,
  Building2,
  Home,
  HandCoins,
  Receipt,
  CheckSquare,
  Heart,
  Ellipsis,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CurrencySelector } from "./currency-selector"
import { ThemeToggle } from "./theme-toggle"
import { TourTrigger } from "./tour-trigger"

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

const mainNavItems = navItems.slice(0, 5)
const moreNavItems = navItems.slice(5)

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="border-b bg-card" data-tour="navigation">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image src="/saveit_logo.png" alt="Save It Logo" width={32} height={32} priority />
            <span className="font-bold text-xl">Save It</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-1">
              {mainNavItems.map((item) => {
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Ellipsis className="h-4 w-4" />
                    More
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {moreNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem asChild key={item.href}>
                        <Link href={item.href} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div data-tour="theme-toggle">
              <ThemeToggle />
            </div>
            <CurrencySelector />
            <TourTrigger />
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-card pb-4">
          <div className="flex flex-col items-start px-6 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
            <div className="w-full flex justify-between items-center px-4 py-2">
              <ThemeToggle />
              <CurrencySelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}