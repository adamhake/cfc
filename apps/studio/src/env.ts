import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import {
  sanityProjectIdSchema,
  sanityDatasetSchema,
  sanityApiVersionSchema,
} from "@chimborazo/sanity-config";

/**
 * Environment variables for Sanity Studio.
 * Uses SANITY_STUDIO_* prefix following Sanity's conventions.
 *
 * Note: Sanity Studio runs in the browser but all env vars are replaced at build time.
 * We skip clientPrefix validation since these are not traditional runtime client vars.
 */
export const env = createEnv({
  server: {},

  /**
   * All Studio env vars are build-time replacements.
   * Using skipValidation for clientPrefix since SANITY_STUDIO_* is Sanity's convention,
   * not a traditional client-side runtime prefix.
   */
  client: {
    SANITY_STUDIO_PROJECT_ID: sanityProjectIdSchema,
    SANITY_STUDIO_DATASET: sanityDatasetSchema,
    SANITY_STUDIO_API_VERSION: sanityApiVersionSchema,
    SANITY_STUDIO_PREVIEW_URL: z
      .string()
      .url()
      .default("http://localhost:3000"),
    SANITY_STUDIO_API_URL: z
      .string()
      .url()
      .default("http://localhost:3000/api/generate-metadata"),
  },

  /**
   * Use SANITY_STUDIO_ as client prefix (Sanity's convention)
   */
  clientPrefix: "SANITY_STUDIO_",

  /**
   * What object holds the environment variables at runtime.
   * For Sanity Studio, all variables come from process.env at build time.
   */
  runtimeEnv: {
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_API_VERSION: process.env.SANITY_STUDIO_API_VERSION,
    SANITY_STUDIO_PREVIEW_URL: process.env.SANITY_STUDIO_PREVIEW_URL,
    SANITY_STUDIO_API_URL: process.env.SANITY_STUDIO_API_URL,
  },

  /**
   * Treat empty strings as undefined.
   * This allows default values to be applied when env vars are set to empty strings.
   */
  emptyStringAsUndefined: true,
});
