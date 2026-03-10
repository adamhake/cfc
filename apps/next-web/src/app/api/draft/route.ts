import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity";
import { env } from "@/env";

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: env.SANITY_API_TOKEN,
  }),
});
