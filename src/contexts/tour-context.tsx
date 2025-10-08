"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, SkipForward } from "lucide-react"
import { useClientOnly } from "@/hooks/use-client-only"
import { startIntroTour, stopIntroTour } from "@/lib/intro-wrapper"
// import { 
//   dashboardTourSteps
// } from "@/lib/tour-steps"

interface TourContextType {
  isRunning: boolean
  startTour: () => void
  stopTour: () => void
  resetTour: () => void
  isFirstTime: boolean
  showWelcomeModal: boolean
  setShowWelcomeModal: (show: boolean) => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

const TOUR_STORAGE_KEY = "saveit-tour-completed"
const WELCOME_STORAGE_KEY = "saveit-welcome-shown"

export function TourProvider({ children }: { children: ReactNode }) {
  const [isRunning, setIsRunning] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const isClient = useClientOnly()

  useEffect(() => {
    if (!isClient) return
    
    // Check if user has completed tour before
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY)
    const welcomeShown = localStorage.getItem(WELCOME_STORAGE_KEY)
    
    if (!tourCompleted && !welcomeShown) {
      setIsFirstTime(true)
      setShowWelcomeModal(true)
    }
  }, [isClient])

  const startTour = async () => {
    if (!isClient || typeof window === 'undefined') return
    
    setIsRunning(true)
    setShowWelcomeModal(false)
    
    // Add a small delay to ensure DOM is ready
    setTimeout(async () => {
      try {
        await startIntroTour()
        
        // Set up event listeners for tour completion
        const intro = await import('intro.js')
        const introJs = intro.default
        
        introJs().oncomplete(() => {
          setIsRunning(false)
          localStorage.setItem(TOUR_STORAGE_KEY, "true")
        })
        
        introJs().onexit(() => {
          setIsRunning(false)
          localStorage.setItem(TOUR_STORAGE_KEY, "true")
        })
      } catch (error) {
        console.warn('Tour failed to start:', error)
        setIsRunning(false)
      }
    }, 100)
  }

  const stopTour = async () => {
    if (!isClient) return
    
    setIsRunning(false)
    try {
      await stopIntroTour()
    } catch (error) {
      console.warn('Tour failed to stop:', error)
    }
  }

  const resetTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY)
    localStorage.removeItem(WELCOME_STORAGE_KEY)
    setIsFirstTime(true)
    setShowWelcomeModal(true)
  }

  const value: TourContextType = {
    isRunning,
    startTour,
    stopTour,
    resetTour,
    isFirstTime,
    showWelcomeModal,
    setShowWelcomeModal,
  }

  return (
    <TourContext.Provider value={value}>
      {children}
      
      {/* Welcome Modal */}
      {isClient && (
        <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              Welcome to Save It!
            </DialogTitle>
            <DialogDescription>
              Your personal finance management system is ready to help you achieve your financial goals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Would you like to take a quick tour to learn about all the features?
            </p>
            <div className="flex gap-2">
              <Button onClick={() => startTour()} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Take Tour
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowWelcomeModal(false)
                  localStorage.setItem(WELCOME_STORAGE_KEY, "true")
                }}
                className="flex-1"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Tour
              </Button>
            </div>
          </div>
        </DialogContent>
        </Dialog>
      )}

    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
