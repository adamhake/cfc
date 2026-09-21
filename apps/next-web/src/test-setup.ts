import "@testing-library/jest-dom/vitest"

// Belt and braces: Vitest doesn't load `.env`, so this is already unset — but
// making it explicit means a stray key in the shell can never turn a test run
// into live PostHog ingestion. Every telemetry helper no-ops without it.
process.env.NEXT_PUBLIC_POSTHOG_KEY = ""

// Vitest doesn't load `.env`, so `src/env.ts` throws on import. Any component
// that reaches env — directly, or through a helper like `sanityAttr` — would
// otherwise fail the whole suite at import time rather than at assertion time.
// These are non-secret build-time identifiers; the values only need to be
// well-formed, and nothing in a test talks to the real project.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= "test-project"
process.env.NEXT_PUBLIC_SANITY_DATASET ||= "test"
process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||= "http://localhost:3333"
