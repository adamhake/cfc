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
    // Newsletter signup (Resend Contacts + Segments)
    RESEND_API_KEY: z.string().optional(),
    RESEND_SEGMENT_ID: z.string().optional(),
    TURNSTILE_SECRET_KEY: z.string().optional(),
    TURNSTILE_EXPECTED_HOSTNAME: z.string().optional(),
    // PostHog server-side analytics (uses same project API key)
    POSTHOG_API_KEY: z.string().optional(),
    POSTHOG_HOST: z.string().url().optional(),
    ADMIN_EMAIL: z.string().email().optional().default("info@chimborazopark.org"),
    NEWSLETTER_FROM_EMAIL: z.string().email().optional().default("noreply@chimborazopark.org"),
    // Verified email domain for admin notifications (must match Resend domain)
    VERIFIED_EMAIL_DOMAIN: z.string().optional().default("@chimborazopark.org"),
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
    // Visual Editing - Studio URL for click-to-edit
    VITE_SANITY_STUDIO_URL: z.string().url().optional(),
    // Newsletter signup
    VITE_TURNSTILE_SITE_KEY: z.string().optional(),
    // PostHog client-side analytics
    VITE_POSTHOG_KEY: z.string().optional(),
    VITE_POSTHOG_HOST: z.string().url().optional(),
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
    RESEND_SEGMENT_ID: process.env.RESEND_SEGMENT_ID,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    TURNSTILE_EXPECTED_HOSTNAME: process.env.TURNSTILE_EXPECTED_HOSTNAME,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    POSTHOG_HOST: process.env.POSTHOG_HOST,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
    VERIFIED_EMAIL_DOMAIN: process.env.VERIFIED_EMAIL_DOMAIN,
    // Client-side variables from import.meta.env
    VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
    VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID,
    VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET,
    VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION,
    VITE_SANITY_STUDIO_URL: import.meta.env.VITE_SANITY_STUDIO_URL,
    VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
    VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,
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
