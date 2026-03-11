"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { RegisterButton } from "@/components/RegisterButton/register-button"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityEvent } from "@/lib/sanity-types"
import { formatDateString } from "@/utils/time"

export default function EventSidebarOptimistic({ event }: { event: SanityEvent }) {
  const optimisticEvent = useOptimisticDocument(event) ?? event

  return (
    <div className="overflow-hidden rounded-2xl border border-accent-200 bg-white shadow-sm dark:border-accent-700/30 dark:bg-primary-900">
      <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 px-6 py-5 dark:from-primary-950/30 dark:to-primary-950/20">
        <h2 className="font-display text-xl font-semibold text-grey-900 md:text-2xl dark:text-grey-100">
          Event Details
        </h2>
      </div>
      <div className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
            <div>
              <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                Date
              </div>
              <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                {formatDateString(optimisticEvent.date)}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
            <div>
              <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                Time
              </div>
              <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                {optimisticEvent.time}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 flex-shrink-0 stroke-accent-600 dark:stroke-accent-400" />
            <div>
              <div className="font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                Location
              </div>
              <div className="font-body font-medium text-grey-900 dark:text-grey-100">
                {optimisticEvent.location}
              </div>
            </div>
          </div>
        </div>

        <RegisterButton eventDate={optimisticEvent.date} />
      </div>
    </div>
  )
}
