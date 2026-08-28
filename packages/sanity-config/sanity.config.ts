import { defineConfig } from "sanity"
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./src/sanity-constants"
import { schemas } from "./src/schemas"

// Minimal config for schema extraction and type generation.
// The full studio config lives in apps/studio/sanity.config.ts.
export default defineConfig({
  name: "chimborazo-typegen",
  title: "Chimborazo Typegen",
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  schema: { types: schemas },
})
