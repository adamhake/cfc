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

export default async function config(
  phase: string,
  { defaultConfig }: { defaultConfig: NextConfig },
): Promise<NextConfig> {
  if (process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID) {
    const { withPostHogConfig } = await import("@posthog/nextjs-config")
    const configFn = withPostHogConfig(nextConfig, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      sourcemaps: {
        releaseName: "chimborazo-next-web",
        deleteAfterUpload: true,
        enabled: true,
      },
    }) as unknown as (
      phase: string,
      context: { defaultConfig: NextConfig },
    ) => Promise<NextConfig>
    return configFn(phase, { defaultConfig })
  }
  return nextConfig
}
