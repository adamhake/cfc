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

export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID ?? "",
  host: "https://d.chimborazoparkconservancy.org",
  sourcemaps: {
    releaseName: "chimbo-park-next-web",
    deleteAfterUpload: true,
  },
})
