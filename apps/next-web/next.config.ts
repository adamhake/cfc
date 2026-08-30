import { withPostHogConfig } from "@posthog/nextjs-config"
import type { NextConfig } from "next"
import { sanity } from "next-sanity/live/cache-life"

const nextConfig: NextConfig = {
  cacheComponents: true,
  // next-sanity's own profile: revalidate is effectively infinite (1 year).
  // Content freshness comes from tag invalidation — the Sanity webhook calling
  // revalidateTag, plus the sync tags sanityFetch registers for Sanity Live —
  // not from an expiry timer. That only holds while every document type maps to
  // a cache tag, which the coverage guard in the webhook route tests enforces.
  cacheLife: {
    default: sanity,
  },
  experimental: {
    // Belt-and-suspenders tree-shaking for barrel-exported packages.
    // Next converts named imports to direct path imports at build time.
    optimizePackageImports: ["lucide-react", "@uidotdev/usehooks", "framer-motion"],
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
