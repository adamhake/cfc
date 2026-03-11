import { withPostHogConfig } from "@posthog/nextjs-config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheLife: {
    sanity: {
      stale: 60,
      revalidate: 1800,
      expire: 7776000, // 90 days — Sanity Live handles on-demand revalidation
    },
  },
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID,
  sourcemaps: {
    releaseName: "chimborazo-next-web",
    deleteAfterUpload: true,
    enabled: true,
  },
});
