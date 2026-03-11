import { defineEnableDraftMode } from "next-sanity/draft-mode"
import { env } from "@/env"
import { sanityClient } from "@/lib/sanity"

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: env.SANITY_API_TOKEN,
  }),
})
