"use client"

import Event from "@/components/Event/event"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import type { SanityEvent } from "@/lib/sanity-types"
import { sortEventsByDate } from "@/lib/sort-helpers"

export default function EventsListClient({ events }: { events: SanityEvent[] }) {
  const optimisticEvents = useOptimisticList(events)

  // Re-sort after optimistic updates.
  const sorted = sortEventsByDate(optimisticEvents)

  return (
    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {sorted.map((event) => (
        <Event key={`event-${event._id}`} {...event} />
      ))}
    </div>
  )
}
