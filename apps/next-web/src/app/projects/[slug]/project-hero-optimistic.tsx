"use client"

import Chip from "@/components/Chip/chip"
import PageHero from "@/components/PageHero/page-hero"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import { sanityAttr } from "@/lib/sanity-data-attribute"
import type { MaybeStega, SanityProjectDetail } from "@/lib/sanity-types"

export default function ProjectHeroOptimistic({
  project,
}: {
  project: MaybeStega<SanityProjectDetail>
}) {
  const optimistic = useOptimisticDocument(project) ?? project

  return (
    <PageHero
      title={optimistic.title ?? ""}
      subtitle={optimistic.description ?? undefined}
      sanityImage={optimistic.heroImage ?? undefined}
      imageDataAttr={sanityAttr(optimistic, "heroImageV2")}
      variant="detail"
      priority={true}
      alignment="bottom-mobile-center-desktop"
      titleSize="compact"
    >
      <div className="mb-6 lg:mt-16">
        {optimistic.status && <Chip variant={optimistic.status} className="px-4 py-2" />}
      </div>
    </PageHero>
  )
}
