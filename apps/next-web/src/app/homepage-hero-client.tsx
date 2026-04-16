"use client"

import Hero from "@/components/Hero/hero"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityHomePage } from "@/lib/sanity-types"

export default function HomepageHeroClient({
  homePageData,
}: {
  homePageData: SanityHomePage | null
}) {
  const optimistic = useOptimisticDocument(homePageData)

  const heroData = optimistic?.hero?.heroImage?.asset?.url
    ? {
        heading: optimistic.hero.heading ?? undefined,
        subheading: optimistic.hero.subheading ?? undefined,
        heroImage: optimistic.hero.heroImage ?? undefined,
        ctaText: optimistic.hero.ctaButton?.text ?? undefined,
        ctaLink: optimistic.hero.ctaButton?.link ?? undefined,
      }
    : undefined

  return <Hero {...heroData} />
}
