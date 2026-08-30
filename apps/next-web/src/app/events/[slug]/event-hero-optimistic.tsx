"use client"

import EventStatusChip from "@/components/EventStatusChip/event-status-chip"
import PageHero from "@/components/PageHero/page-hero"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityEventDetail } from "@/lib/sanity-types"

export default function EventHeroOptimistic({ event }: { event: SanityEventDetail }) {
  const optimistic = useOptimisticDocument(event) ?? event

  return (
    <PageHero
      title={optimistic.title ?? ""}
      subtitle={optimistic.description ?? undefined}
      sanityImage={optimistic.heroImage ?? undefined}
      variant="detail"
      priority={true}
      alignment="bottom-mobile-center-desktop"
      titleSize="compact"
    >
      <div className="mb-6 lg:mt-16">
        <EventStatusChip eventDate={optimistic.date ?? ""} />
      </div>
    </PageHero>
  )
}
