"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCurrency, setCurrency } from "@/lib/storage"
import type { Currency } from "@/lib/types"

const currencies = [
  { code: "KES" as Currency, name: "Kenyan Shilling", symbol: "KSh" },
  { code: "USD" as Currency, name: "US Dollar", symbol: "$" },
  { code: "EUR" as Currency, name: "Euro", symbol: "€" },
  { code: "GBP" as Currency, name: "British Pound", symbol: "£" },
  { code: "JPY" as Currency, name: "Japanese Yen", symbol: "¥" },
  { code: "CAD" as Currency, name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD" as Currency, name: "Australian Dollar", symbol: "A$" },
  { code: "CHF" as Currency, name: "Swiss Franc", symbol: "CHF" },
  { code: "CNY" as Currency, name: "Chinese Yuan", symbol: "¥" },
  { code: "INR" as Currency, name: "Indian Rupee", symbol: "₹" },
]

export function CurrencySelector() {
  const [currency, setCurrencyState] = useState<Currency>("KES")

  useEffect(() => {
    setCurrencyState(getCurrency())
  }, [])

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    setCurrencyState(newCurrency)
    // Reload the page to update all currency displays
    window.location.reload()
  }

  const currentCurrency = currencies.find((c) => c.code === currency)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="h-4 w-4" />
          {currentCurrency?.symbol} {currentCurrency?.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem key={curr.code} onClick={() => handleCurrencyChange(curr.code)} className="cursor-pointer">
            <span className="font-medium">{curr.symbol}</span>
            <span className="ml-2">{curr.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
