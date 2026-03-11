"use client"

import { projectBySlugQuery } from "@chimborazo/sanity-config/queries"
import { useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanity"
import type { SanityProject } from "@/lib/sanity-types"

/**
 * Client-side hook to fetch a project by slug from Sanity CMS.
 *
 * Uses a simple fetch-on-mount pattern since TanStack Query is not
 * set up as a provider in the Next.js app.
 */
export function useProject(slug: string) {
  const [data, setData] = useState<SanityProject | null>(null)

  useEffect(() => {
    let cancelled = false
    sanityClient
      .fetch<SanityProject | null>(projectBySlugQuery, { slug })
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        console.warn(`Failed to fetch project "${slug}" from Sanity:`, err)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  return { data }
}
