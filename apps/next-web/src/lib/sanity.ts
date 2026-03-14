import {
  createSanityClient,
  urlForImage as urlForImageBase,
} from "@chimborazo/sanity-config/client"
import { env } from "@/env"

export const sanityClient = createSanityClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
})

// Image URL builder helper
export function urlForImage(source: Parameters<typeof urlForImageBase>[0]) {
  return urlForImageBase(source, {
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  })
}
