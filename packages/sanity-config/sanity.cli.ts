import { defineCliConfig } from "sanity/cli"
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./src/sanity-constants"

export default defineCliConfig({
  api: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  },
  typegen: {
    path: "./src/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./src/sanity.types.ts",
    overloadClientMethods: true,
  },
})
