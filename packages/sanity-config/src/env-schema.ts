import { z } from "zod"

/**
 * Shared Zod schemas for Sanity configuration.
 * These schemas define the shape and validation rules for Sanity environment variables,
 * but don't specify the actual env var names (which differ between frameworks).
 */

/**
 * Default Sanity API version used across client, image builder, and env defaults.
 * Kept in this file so the env schema and client stay in sync.
 */
export const DEFAULT_SANITY_API_VERSION = "2025-03-04"

/**
 * Schema for Sanity project ID.
 * Required - identifies which Sanity project to connect to.
 */
export const sanityProjectIdSchema = z.string().min(1)

/**
 * Schema for Sanity dataset name.
 * Defaults to "production" if not specified.
 */
export const sanityDatasetSchema = z.string().default("production")

/**
 * Schema for Sanity API version.
 * Defaults to DEFAULT_SANITY_API_VERSION - the current pinned API version.
 */
export const sanityApiVersionSchema = z.string().default(DEFAULT_SANITY_API_VERSION)

/**
 * Schema for optional Sanity API token.
 * Used for authenticated requests (mutations, preview mode, etc.).
 */
export const sanityApiTokenSchema = z.string().optional()

/**
 * Combined schema for all Sanity configuration.
 * Use this as a base when creating environment schemas for different frameworks.
 */
export const sanityConfigSchema = {
  projectId: sanityProjectIdSchema,
  dataset: sanityDatasetSchema,
  apiVersion: sanityApiVersionSchema,
}

/**
 * Helper type for Sanity configuration object.
 * Useful for functions that accept Sanity config as parameters.
 */
export type SanityConfig = {
  projectId: string
  dataset: string
  apiVersion: string
}

/**
 * Helper type for extended Sanity configuration with optional API token.
 */
export type SanityConfigWithToken = SanityConfig & {
  token?: string
}
