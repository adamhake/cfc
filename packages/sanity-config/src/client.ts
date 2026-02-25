import { createClient } from "@sanity/client"
import {
  createImageUrlBuilder as sanityImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url"

export interface SanityConfig {
  projectId: string
  dataset: string
  apiVersion?: string
  useCdn?: boolean
  token?: string
  perspective?: "published" | "previewDrafts" | "raw"
  stega?: {
    enabled?: boolean
    studioUrl?: string
  }
}

export function createSanityClient(config: SanityConfig) {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion || "2024-01-01",
    useCdn: config.useCdn ?? true,
    token: config.token,
    perspective: config.perspective || "published",
    stega: config.stega?.enabled
      ? {
          enabled: true,
          studioUrl: config.stega.studioUrl,
        }
      : undefined,
  })
}

const imageUrlBuilderCache = new Map<string, ReturnType<typeof sanityImageUrlBuilder>>()

export function createImageUrlBuilder(config: Pick<SanityConfig, "projectId" | "dataset">) {
  const cacheKey = `${config.projectId}:${config.dataset}`
  const cached = imageUrlBuilderCache.get(cacheKey)
  if (cached) return cached

  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  })

  const builder = sanityImageUrlBuilder(client)
  imageUrlBuilderCache.set(cacheKey, builder)
  return builder
}

export function urlForImage(
  source: SanityImageSource,
  config: Pick<SanityConfig, "projectId" | "dataset">
) {
  return createImageUrlBuilder(config).image(source)
}
