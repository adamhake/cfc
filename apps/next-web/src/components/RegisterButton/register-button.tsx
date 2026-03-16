"use client"

import { Button } from "@/components/Button/button"
import { isPastDate } from "@/utils/time"

interface RegisterButtonProps {
  eventDate: string
}

/**
 * Client component that conditionally shows a registration button
 * based on whether the event is in the past or upcoming.
 */
export function RegisterButton({ eventDate }: RegisterButtonProps) {
  const isPast = isPastDate(eventDate)

  if (isPast) return null

  return (
    <div className="border-t border-accent-200 pt-6 dark:border-accent-700/30">
      <Button variant="accent" size="standard" className="w-full">
        Register for Event
      </Button>
    </div>
  )
}
