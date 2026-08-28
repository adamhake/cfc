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
    <div className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
      {sorted.map((event) => (
        <Event key={`event-${event._id}`} {...event} />
      ))}
    </div>
  )
}
