import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  reactStrictMode: true,
  api: {
    projectId: "pntpob7k",
    dataset: "production",
  },
})
