"use client"

import { useTour } from "@/contexts/tour-context"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"
import { useClientOnly } from "@/hooks/use-client-only"

export function TourTrigger() {
  const { startTour, resetTour, isRunning } = useTour()
  const isClient = useClientOnly()

  if (!isClient) return null

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => startTour()}
        disabled={isRunning}
        className="text-xs"
      >
        <Play className="h-3 w-3 mr-1" />
        Tour
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={resetTour}
        className="text-xs text-muted-foreground hover:text-foreground"
        title="Reset tour (show welcome modal again)"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  )
}
