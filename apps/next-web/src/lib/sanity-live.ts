import { defineLive } from "next-sanity/live";
import { sanityClient } from "./sanity";
import { env } from "@/env";

const token = env.SANITY_API_TOKEN;

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient.withConfig({
    stega: {
      studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
    },
  }),
  serverToken: token,
  browserToken: env.SANITY_API_BROWSER_TOKEN || token,
  fetchOptions: {
    revalidate: 1800,
  },
});
