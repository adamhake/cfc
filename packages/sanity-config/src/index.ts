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
  sanityApiTokenSchema,
  sanityApiVersionSchema,
  sanityConfigSchema,
  sanityDatasetSchema,
  sanityProjectIdSchema,
} from "./env-schema"
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
