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

// Export components
export { MediaImageReferenceInput } from "./components/MediaImageReferenceInput"

// Export document actions
export { generateMetadataAction } from "./actions"

// Export queries
export * from "./queries"

// Export generated types
export type * from "./sanity.types"

// Export client utilities
export { createSanityClient, createImageUrlBuilder, urlForImage } from "./client"
export type { SanityConfig } from "./client"

// Export environment schemas
export {
  sanityProjectIdSchema,
  sanityDatasetSchema,
  sanityApiVersionSchema,
  sanityApiTokenSchema,
  sanityConfigSchema,
} from "./env-schema"
export type { SanityConfig as SanityEnvConfig, SanityConfigWithToken } from "./env-schema"

// Re-export types from Sanity for convenience
export type { SanityClient } from "@sanity/client"
export type { SanityImageSource } from "@sanity/image-url"
