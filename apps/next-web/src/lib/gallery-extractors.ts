import type { SanityImageObject } from "@/components/SanityImage/sanity-image"
import type { SanitySiteSettings } from "./sanity-types"

/**
 * Extracts normalized `SanityImageObject` entries from the
 * `siteSettings.getInvolvedGallery.images` field.
 *
 * The CMS schema has two legacy shapes for each gallery item:
 *   1. `{ image: <SanityImageObject> }` (current)
 *   2. `{ image: { image: <SanityImageObject> } }` (older wrapper)
 * This helper tolerates both.
 */
export function extractGetInvolvedGalleryImages(
  siteSettings: SanitySiteSettings | null,
): SanityImageObject[] {
  const items =
    (siteSettings as unknown as { getInvolvedGallery?: { images?: unknown[] } } | null)
      ?.getInvolvedGallery?.images ?? []

  const result: SanityImageObject[] = []
  for (const rawItem of items) {
    if (!rawItem || typeof rawItem !== "object") continue
    const outer = (rawItem as { image?: unknown }).image
    if (!outer || typeof outer !== "object") continue
    // Case 1: outer IS the image (has `asset`)
    if ("asset" in outer) {
      result.push(outer as SanityImageObject)
      continue
    }
    // Case 2: outer wraps the image under `.image`
    const nested = (outer as { image?: unknown }).image
    if (nested && typeof nested === "object" && "asset" in nested) {
      result.push(nested as SanityImageObject)
    }
  }
  return result
}
