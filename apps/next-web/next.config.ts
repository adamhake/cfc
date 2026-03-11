import { withPostHogConfig } from "@posthog/nextjs-config"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  cacheLife: {
    sanity: {
      stale: 60,
      revalidate: 1800,
      expire: 7776000, // 90 days — Sanity Live handles on-demand revalidation
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
}

const isCI = !!(process.env.CI || process.env.NETLIFY)
const hasPostHog = isCI && !!(process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID)

export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID ?? "0",
  sourcemaps: {
    releaseName: "chimborazo-next-web",
    deleteAfterUpload: true,
    enabled: hasPostHog,
  },
})
