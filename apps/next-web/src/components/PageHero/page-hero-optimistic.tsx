"use client"

import type { ReactNode } from "react"
import { useOptimisticDocument } from "@/hooks/use-optimistic-sanity"
import type { SanityImage } from "@/lib/sanity-types"
import PageHero from "./page-hero"

interface PageDocument {
  _id: string
  pageHero?: {
    title?: string
    description?: string
    image?: SanityImage
  }
}

interface PageHeroOptimisticProps {
  document: PageDocument | null
  fallback: {
    title: string
    subtitle?: string
    imageSrc?: string
    imageAlt?: string
    imageWidth?: number
    imageHeight?: number
  }
  height?: "auto" | "small" | "medium" | "large" | "event"
  priority?: boolean
  alignment?: "center" | "bottom-mobile-center-desktop"
  titleSize?: "standard" | "large"
  children?: ReactNode
}

export default function PageHeroOptimistic({
  document,
  fallback,
  children,
  ...heroProps
}: PageHeroOptimisticProps) {
  const optimistic = useOptimisticDocument(document)

  const heroData = optimistic?.pageHero?.image
    ? {
        title: optimistic.pageHero.title ?? fallback.title,
        subtitle: optimistic.pageHero.description ?? fallback.subtitle,
        sanityImage: optimistic.pageHero.image,
      }
    : {
        title: fallback.title,
        subtitle: fallback.subtitle,
        ...(fallback.imageSrc
          ? {
              imageSrc: fallback.imageSrc,
              imageAlt: fallback.imageAlt,
              imageWidth: fallback.imageWidth,
              imageHeight: fallback.imageHeight,
            }
          : {}),
      }

  return (
    <PageHero {...heroData} {...heroProps}>
      {children}
    </PageHero>
  )
}
