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

async function getConfig(): Promise<NextConfig> {
  if (process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID) {
    const { withPostHogConfig } = await import("@posthog/nextjs-config")
    return withPostHogConfig(nextConfig, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: "https://d.chimborazoparkconservancy.org",
      sourcemaps: {
        releaseName: "chimborazo-next-web",
        deleteAfterUpload: true,
        enabled: true,
      },
    })
  }
  return nextConfig
}

export default getConfig()
