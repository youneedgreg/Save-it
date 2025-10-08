"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTour } from "@/contexts/tour-context"
import { useClientOnly } from "@/hooks/use-client-only"
// import { 
//   accountsTourSteps, 
//   budgetsTourSteps, 
//   analyticsTourSteps 
// } from "@/lib/tour-steps"

export function PageTour() {
  const pathname = usePathname()
  const { startTour } = useTour()
  const isClient = useClientOnly()

  useEffect(() => {
    if (!isClient) return
    
    // Auto-start page-specific tours for first-time users
    const tourCompleted = localStorage.getItem("saveit-tour-completed")
    const welcomeShown = localStorage.getItem("saveit-welcome-shown")
    
    if (!tourCompleted && !welcomeShown) {
      // Small delay to ensure page is loaded
      const timer = setTimeout(() => {
        if (pathname === "/accounts" || pathname === "/budgets" || pathname === "/analytics") {
          startTour()
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, startTour, isClient])

  return null
}
