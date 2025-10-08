"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getCurrency, setCurrency } from "@/lib/storage"
import type { Currency } from "@/lib/types"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("KES")

  useEffect(() => {
    setCurrencyState(getCurrency())
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    setCurrencyState(newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}