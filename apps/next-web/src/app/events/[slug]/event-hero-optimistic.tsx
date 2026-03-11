"use client"

import EventStatusChip from "@/components/EventStatusChip/event-status-chip"
import PageHero from "@/components/PageHero/page-hero"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityEvent } from "@/lib/sanity-types"

export default function EventHeroOptimistic({ event }: { event: SanityEvent }) {
  const optimistic = useOptimisticDocument(event) ?? event

  return (
    <PageHero
      title={optimistic.title}
      subtitle={optimistic.description}
      sanityImage={optimistic.heroImage ?? undefined}
      height="auto"
      priority={true}
      alignment="bottom-mobile-center-desktop"
      titleSize="large"
    >
      <div className="mb-6 lg:mt-16">
        <EventStatusChip eventDate={optimistic.date} />
      </div>
    </PageHero>
  )
}
