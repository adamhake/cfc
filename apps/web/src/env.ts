import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import {
  sanityProjectIdSchema,
  sanityDatasetSchema,
  sanityApiVersionSchema,
  sanityApiTokenSchema,
} from "@chimborazo/sanity-config";

export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    SANITY_API_TOKEN: sanityApiTokenSchema,
    SANITY_WEBHOOK_SECRET: z.string().optional(),
    NETLIFY_AUTH_TOKEN: z.string().optional(),
    NETLIFY_SITE_ID: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    // Newsletter signup (Resend Audiences)
    RESEND_API_KEY: z.string().optional(),
    RESEND_AUDIENCE_ID: z.string().optional(),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    ADMIN_EMAIL: z.string().email().optional().default("info@chimborazopark.org"),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: "VITE_",

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
    VITE_SANITY_PROJECT_ID: sanityProjectIdSchema,
    VITE_SANITY_DATASET: sanityDatasetSchema,
    VITE_SANITY_API_VERSION: sanityApiVersionSchema,
    // Newsletter signup
    VITE_TURNSTILE_SITE_KEY: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    // Server-side variables from process.env
    SERVER_URL: process.env.SERVER_URL,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN,
    NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    // Client-side variables from import.meta.env
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID,
    VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET,
    VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION,
    VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  },

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
