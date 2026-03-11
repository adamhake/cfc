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
        heading: optimistic.hero.heading,
        subheading: optimistic.hero.subheading,
        heroImage: optimistic.hero.heroImage,
        ctaText: optimistic.hero.ctaButton?.text,
        ctaLink: optimistic.hero.ctaButton?.link,
      }
    : undefined

  return <Hero {...heroData} />
}
