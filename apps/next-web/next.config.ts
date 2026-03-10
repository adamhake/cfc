import type { NextConfig } from "next";

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
  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
};

export default nextConfig;
