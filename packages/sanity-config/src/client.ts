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
}

export function createSanityClient(config: SanityConfig) {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion || "2024-01-01",
    useCdn: config.useCdn ?? true,
    token: config.token,
    perspective: config.perspective || "published",
  })
}

export function createImageUrlBuilder(config: Pick<SanityConfig, "projectId" | "dataset">) {
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  })

  return sanityImageUrlBuilder(client)
}

export function urlForImage(
  source: SanityImageSource,
  config: Pick<SanityConfig, "projectId" | "dataset">
) {
  return createImageUrlBuilder(config).image(source)
}
