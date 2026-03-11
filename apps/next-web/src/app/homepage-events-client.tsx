"use client"

import Event from "@/components/Event/event"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import type { SanityEvent } from "@/lib/sanity-types"

export default function HomepageEventsClient({ events }: { events: SanityEvent[] }) {
  const optimisticEvents = useOptimisticList(events)

  return (
    <div className="mt-10 space-y-10">
      {/* Featured Event - Full Width */}
      {optimisticEvents.slice(0, 1).map((event) => (
        <Event
          key={`event-featured-${event._id}`}
          {...event}
          imageSizes="(max-width: 768px) 100vw, 1152px"
          imageMaxWidth={1280}
          imageBreakpoints={[320, 480, 640, 768, 896, 1024, 1152, 1280]}
        />
      ))}

      {/* Recent Events Grid */}
      {optimisticEvents.length > 1 && (
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
          {optimisticEvents.slice(1, 3).map((event) => (
            <Event key={`event-${event._id}`} {...event} />
          ))}
        </div>
      )}
    </div>
  )
}
