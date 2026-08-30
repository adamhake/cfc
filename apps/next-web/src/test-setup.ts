import "@testing-library/jest-dom/vitest"

// Belt and braces: Vitest doesn't load `.env`, so this is already unset — but
// making it explicit means a stray key in the shell can never turn a test run
// into live PostHog ingestion. Every telemetry helper no-ops without it.
process.env.NEXT_PUBLIC_POSTHOG_KEY = ""
