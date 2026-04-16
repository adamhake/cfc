// Export schemas

// Re-export types from Sanity for convenience
export type { SanityClient } from "@sanity/client"
export type { SanityImageSource } from "@sanity/image-url"

// Export document actions
export { createGenerateMetadataAction, type GenerateMetadataActionConfig } from "./actions"
export type { SanityConfig } from "./client"
// Export client utilities
export { createImageUrlBuilder, createSanityClient, urlForImage } from "./client"
// Export components
export { MediaImageReferenceInput } from "./components/MediaImageReferenceInput"
export type { SanityConfig as SanityEnvConfig, SanityConfigWithToken } from "./env-schema"

// Export environment schemas
export {
  DEFAULT_SANITY_API_VERSION,
  sanityApiTokenSchema,
  sanityApiVersionSchema,
  sanityConfigSchema,
  sanityDatasetSchema,
  sanityProjectIdSchema,
} from "./env-schema"
// Shared project identifiers for CLI/Studio config
export { SANITY_DATASET, SANITY_PROJECT_ID } from "./sanity-constants"
// Export queries
export * from "./queries"
// Export generated types
export type * from "./sanity.types"
export {
  aboutPageSchema,
  amenitiesPageSchema,
  contentImageSchema,
  eventSchema,
  gallerySchema,
  homePageSchema,
  mediaImageSchema,
  partnerSchema,
  quoteSchema,
  schemas,
  siteSettingsSchema,
} from "./schemas"
