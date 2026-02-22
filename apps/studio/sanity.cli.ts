import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  reactStrictMode: true,
  api: {
    projectId: "pntpob7k",
    dataset: "production",
  },
  typegen: {
    path: "../../packages/sanity-config/src/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "../../packages/sanity-config/src/sanity.types.ts",
  },
})
