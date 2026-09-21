"use client"

import { useEffect, useState } from "react"
import { formatDateString, isPastDate } from "@/utils/time"

/** Calendar dates include the entire last day in the park's time zone. */
export function UpdateEndDate({ endDate }: { endDate: string }) {
  const [ended, setEnded] = useState<boolean | null>(null)

  useEffect(() => {
    const refresh = () => setEnded(isPastDate(endDate))
    refresh()
    const timer = window.setInterval(refresh, 60_000)
    document.addEventListener("visibilitychange", refresh)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", refresh)
    }
  }, [endDate])

  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1 font-body text-sm font-medium text-grey-800 dark:bg-primary-800 dark:text-grey-200">
      {ended === null ? "End date: " : ended ? "Ended: " : "Through: "}
      <time dateTime={endDate}>{formatDateString(endDate, "short")}</time>
    </span>
  )
}
