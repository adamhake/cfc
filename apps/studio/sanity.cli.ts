import { defineCliConfig } from "sanity/cli"

// NOTE: These values must match `packages/sanity-config/src/sanity-constants.ts`.
// We can't import from the workspace here because Sanity's CLI loader
// does not resolve workspace package specifiers at config load time.
const SANITY_PROJECT_ID = "pntpob7k"
const SANITY_DATASET = "production"

export default defineCliConfig({
  reactStrictMode: true,
  api: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  },
})
