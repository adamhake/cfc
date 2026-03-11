"use client"

import Chip from "@/components/Chip/chip"
import PageHero from "@/components/PageHero/page-hero"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityProject } from "@/lib/sanity-types"

export default function ProjectHeroOptimistic({ project }: { project: SanityProject }) {
  const optimistic = useOptimisticDocument(project) ?? project

  return (
    <PageHero
      title={optimistic.title}
      subtitle={optimistic.description}
      sanityImage={optimistic.heroImage}
      height="auto"
      priority={true}
      alignment="bottom-mobile-center-desktop"
      titleSize="large"
    >
      <div className="mb-6 lg:mt-16">
        <Chip variant={optimistic.status} className="px-4 py-2" />
      </div>
    </PageHero>
  )
}
