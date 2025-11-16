// Export schemas
export {
  schemas,
  eventSchema,
  mediaImageSchema,
  siteSettingsSchema,
  homePageSchema,
  amenitiesPageSchema,
  partnerSchema,
  quoteSchema,
  gallerySchema,
} from "./schemas"

// Export queries
export * from "./queries"

// Export generated types
export type * from "./sanity.types"

// Export client utilities
export { createSanityClient, createImageUrlBuilder, urlForImage } from "./client"
export type { SanityConfig } from "./client"

// Re-export types from Sanity for convenience
export type { SanityClient } from "@sanity/client"
export type { SanityImageSource } from "@sanity/image-url/lib/types/types"
