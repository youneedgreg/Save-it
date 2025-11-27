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
  LogIn,
  LogOut,
  User,
  Cloud,
  Settings,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { CurrencySelector } from "./currency-selector"
import { ThemeToggle } from "./theme-toggle"
import { AuthDialog } from "./auth-dialog"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"

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
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authDialogMode, setAuthDialogMode] = useState<"login" | "signup">("login")
  const { user, signOut, syncData, isSyncing } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  const openAuthDialog = (mode: "login" | "signup") => {
    setAuthDialogMode(mode)
    setAuthDialogOpen(true)
  }

  return (
    <nav className="border-b bg-card" data-tour="navigation" suppressHydrationWarning>
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user.email?.split("@")[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* User Info Section */}
                  <div className="px-2 py-3">
                    <DropdownMenuLabel className="px-0 font-semibold">
                      {user.email?.split("@")[0]}
                    </DropdownMenuLabel>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {/* Account Actions */}
                  <DropdownMenuLabel className="px-2 text-xs font-medium text-muted-foreground">
                    Account
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={syncData}
                    disabled={isSyncing}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {isSyncing ? (
                      <>
                        <Cloud className="h-4 w-4 animate-pulse" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4" />
                        <span>Sync Data</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Shield className="h-4 w-4" />
                    <span>Privacy & Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Sign Out */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuthDialog("login")}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openAuthDialog("signup")}
                  className="hidden sm:flex items-center gap-2"
                >
                  Sign Up
                </Button>
              </div>
            )}
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
            {user ? (
              <div className="w-full px-4 py-3 space-y-3 border-t mt-2">
                {/* User Info */}
                <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Account Actions */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={syncData}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-start gap-2"
                  >
                    {isSyncing ? (
                      <>
                        <Cloud className="h-4 w-4 animate-pulse" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <Cloud className="h-4 w-4" />
                        Sync Data
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-start gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-start gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Privacy & Security
                  </Button>
                </div>
                
                {/* Sign Out */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="w-full px-4 py-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthDialog("login")}
                  className="w-full flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => openAuthDialog("signup")}
                  className="w-full flex items-center gap-2"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode={authDialogMode}
      />
    </nav>
  )
}