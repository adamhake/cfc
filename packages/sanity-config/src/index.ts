// Export schemas
export {
  aboutPageSchema,
  amenitiesPageSchema,
  contentImageSchema,
  eventSchema,
  gallerySchema,
  homePageSchema,
  mediaImageSchema,
  mediaTagSchema,
  partnerSchema,
  quoteSchema,
  schemas,
  siteSettingsSchema,
} from "./schemas"

// Export components
export { MediaImageReferenceInput } from "./components/MediaImageReferenceInput"

// Export document actions
export { createGenerateMetadataAction, type GenerateMetadataActionConfig } from "./actions"

// Export queries
export * from "./queries"

// Export generated types
export type * from "./sanity.types"

// Export client utilities
export { createImageUrlBuilder, createSanityClient, urlForImage } from "./client"
export type { SanityConfig } from "./client"

// Export environment schemas
export {
  sanityApiTokenSchema,
  sanityApiVersionSchema,
  sanityConfigSchema,
  sanityDatasetSchema,
  sanityProjectIdSchema,
} from "./env-schema"
export type { SanityConfigWithToken, SanityConfig as SanityEnvConfig } from "./env-schema"

// Re-export types from Sanity for convenience
export type { SanityClient } from "@sanity/client"
export type { SanityImageSource } from "@sanity/image-url"
