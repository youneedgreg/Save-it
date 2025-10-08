"use client"

import { useEffect } from "react"
import { useTour } from "@/contexts/tour-context"

export function TourAnalytics() {
  const { isRunning } = useTour()

  useEffect(() => {
    // Track tour events for analytics
    if (isRunning) {
      // Track tour start
      console.log("Tour started:", {
        timestamp: new Date().toISOString(),
      })
    }
  }, [isRunning])

  useEffect(() => {
    // Track tour completion
    if (!isRunning) {
      console.log("Tour completed or stopped:", {
        timestamp: new Date().toISOString(),
      })
      
      // You can send this data to your analytics service
      // Example: analytics.track('tour_completed', { ... })
    }
  }, [isRunning])

  return null
}
