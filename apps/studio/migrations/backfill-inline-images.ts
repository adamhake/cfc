/**
 * Backfill script for migrating mediaImage references to inline contentImage fields.
 *
 * Run from apps/studio:
 * npx sanity@latest exec migrations/backfill-inline-images.ts --with-user-token -- --dry-run
 * npx sanity@latest exec migrations/backfill-inline-images.ts --with-user-token
 */
import { getCliClient } from "sanity/cli"

type ReferenceLike = {
  _ref?: string
  _type?: string
}

type ContentImageValue = {
  _type: "contentImage"
  asset?: ReferenceLike
  hotspot?: unknown
  crop?: unknown
  alt?: string
  caption?: string
  title?: string
  category?: string
  tags?: unknown[]
}

type MediaImageDoc = {
  _id: string
  title?: string
  category?: string
  image?: {
    asset?: ReferenceLike
    hotspot?: unknown
    crop?: unknown
    alt?: string
    caption?: string
  }
  imageV2?: {
    asset?: ReferenceLike
    hotspot?: unknown
    crop?: unknown
    alt?: string
    caption?: string
    title?: string
    category?: string
    tags?: unknown[]
  }
}

type GenericDoc = {
  _id: string
  [key: string]: unknown
}

type SingleFieldConfig = {
  type: string
  legacyPath: string
  v2Path: string
}

const SINGLE_FIELD_CONFIGS: SingleFieldConfig[] = [
  { type: "homePage", legacyPath: "hero.heroImage", v2Path: "hero.heroImageV2" },
  { type: "project", legacyPath: "heroImage", v2Path: "heroImageV2" },
  { type: "update", legacyPath: "heroImage", v2Path: "heroImageV2" },
  { type: "quote", legacyPath: "backgroundImage", v2Path: "backgroundImageV2" },
  { type: "aboutPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "amenitiesPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "donatePage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "eventsPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "getInvolvedPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "historyPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "mediaPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "projectsPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
  { type: "updatesPage", legacyPath: "pageHero.image", v2Path: "pageHero.imageV2" },
]

const parseDryRun = (): boolean => process.argv.includes("--dry-run") || process.argv.includes("--dryRun")

const getByPath = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

const hasLegacyReference = (value: unknown): value is ReferenceLike => {
  if (!value || typeof value !== "object") return false
  return typeof (value as ReferenceLike)._ref === "string"
}

const hasV2Image = (value: unknown): value is { asset?: ReferenceLike } => {
  if (!value || typeof value !== "object") return false
  return typeof (value as { asset?: ReferenceLike }).asset?._ref === "string"
}

const buildContentImage = (mediaDoc: MediaImageDoc): ContentImageValue | null => {
  if (hasV2Image(mediaDoc.imageV2)) {
    return {
      _type: "contentImage",
      asset: mediaDoc.imageV2.asset,
      hotspot: mediaDoc.imageV2.hotspot ?? mediaDoc.image?.hotspot,
      crop: mediaDoc.imageV2.crop ?? mediaDoc.image?.crop,
      alt: mediaDoc.imageV2.alt ?? mediaDoc.image?.alt,
      caption: mediaDoc.imageV2.caption ?? mediaDoc.image?.caption,
      title: mediaDoc.imageV2.title ?? mediaDoc.title,
      category: mediaDoc.imageV2.category ?? mediaDoc.category,
      tags: mediaDoc.imageV2.tags,
    }
  }

  if (!mediaDoc.image?.asset?._ref) {
    return null
  }

  return {
    _type: "contentImage",
    asset: mediaDoc.image.asset,
    hotspot: mediaDoc.image.hotspot,
    crop: mediaDoc.image.crop,
    alt: mediaDoc.image.alt,
    caption: mediaDoc.image.caption,
    title: mediaDoc.title,
    category: mediaDoc.category,
  }
}

const buildContentImageWithKey = (mediaDoc: MediaImageDoc, key: string) => {
  const base = buildContentImage(mediaDoc)
  if (!base) return null
  return {
    ...base,
    _key: key,
  }
}

const backfillInlineImages = async (client: {
  fetch: <T>(query: string, params?: Record<string, string>) => Promise<T>
  patch: (id: string) => {
    set: (value: Record<string, unknown>) => { commit: () => Promise<unknown> }
  }
}) => {
  const dryRun = parseDryRun()
  console.log(`Starting inline image backfill (${dryRun ? "dry-run" : "write"} mode)...`)

  const mediaImages = await client.fetch<MediaImageDoc[]>(
    '*[_type == "mediaImage"]{_id, title, category, image{asset, hotspot, crop, alt, caption}, imageV2{asset, hotspot, crop, alt, caption, title, category, tags}}'
  )

  const mediaImageById = new Map(mediaImages.map((doc) => [doc._id, doc]))

  const stats = {
    mediaImagePatches: 0,
    singleFieldPatches: 0,
    galleryPatches: 0,
    amenitiesPatches: 0,
    missingMediaRefs: 0,
  }

  for (const mediaDoc of mediaImages) {
    if (hasV2Image(mediaDoc.imageV2) || !hasV2Image(mediaDoc.image)) {
      continue
    }

    const contentImage = buildContentImage(mediaDoc)
    if (!contentImage) continue

    if (!dryRun) {
      await client.patch(mediaDoc._id).set({ imageV2: contentImage }).commit()
    }

    stats.mediaImagePatches += 1
  }

  const docsByType = new Map<string, GenericDoc[]>()
  for (const type of Array.from(new Set(SINGLE_FIELD_CONFIGS.map((config) => config.type)))) {
    const docs = await client.fetch<GenericDoc[]>(`*[_type == $type]{_id, ...}`, { type })
    docsByType.set(type, docs)
  }

  for (const config of SINGLE_FIELD_CONFIGS) {
    const docs = docsByType.get(config.type) || []

    for (const doc of docs) {
      const legacyRef = getByPath(doc, config.legacyPath)
      const v2Value = getByPath(doc, config.v2Path)

      if (!hasLegacyReference(legacyRef) || hasV2Image(v2Value)) {
        continue
      }

      const mediaDoc = mediaImageById.get(legacyRef._ref as string)
      if (!mediaDoc) {
        stats.missingMediaRefs += 1
        continue
      }

      const contentImage = buildContentImage(mediaDoc)
      if (!contentImage) {
        continue
      }

      if (!dryRun) {
        await client.patch(doc._id).set({ [config.v2Path]: contentImage }).commit()
      }

      stats.singleFieldPatches += 1
    }
  }

  const galleries = await client.fetch<
    Array<{
      _id: string
      images?: Array<{
        _key?: string
        image?: ReferenceLike
        imageV2?: { asset?: ReferenceLike }
        showOnMobile?: boolean
      }>
    }>
  >('*[_type == "gallery"]{_id, images}')

  for (const gallery of galleries) {
    const originalItems = gallery.images || []
    let changed = false

    const nextItems = originalItems.map((item, index) => {
      if (!hasLegacyReference(item.image) || hasV2Image(item.imageV2)) {
        return item
      }

      const mediaDoc = mediaImageById.get(item.image._ref as string)
      if (!mediaDoc) {
        stats.missingMediaRefs += 1
        return item
      }

      const contentImage = buildContentImage(mediaDoc)
      if (!contentImage) {
        return item
      }

      changed = true
      return {
        ...item,
        imageV2: contentImage,
        _key: item._key || `gallery-item-${index}`,
      }
    })

    if (!changed) continue

    if (!dryRun) {
      await client.patch(gallery._id).set({ images: nextItems }).commit()
    }

    stats.galleryPatches += 1
  }

  const amenitiesPages = await client.fetch<
    Array<{
      _id: string
      amenities?: Array<{
        _key?: string
        images?: ReferenceLike[]
        imagesV2?: Array<{ asset?: ReferenceLike }>
      }>
    }>
  >('*[_type == "amenitiesPage"]{_id, amenities}')

  for (const page of amenitiesPages) {
    const originalAmenities = page.amenities || []
    let changed = false

    const nextAmenities = originalAmenities.map((amenity, amenityIndex) => {
      const hasExistingV2Images = (amenity.imagesV2 || []).some((image) => hasV2Image(image))
      if (hasExistingV2Images || !(amenity.images || []).length) {
        return amenity
      }

      const nextImagesV2 = (amenity.images || [])
        .map((ref, imageIndex) => {
          if (!hasLegacyReference(ref)) return null
          const mediaDoc = mediaImageById.get(ref._ref as string)
          if (!mediaDoc) {
            stats.missingMediaRefs += 1
            return null
          }

          return buildContentImageWithKey(mediaDoc, `amenity-${amenityIndex}-image-${imageIndex}`)
        })
        .filter((image): image is ContentImageValue & { _key: string } => Boolean(image))

      if (!nextImagesV2.length) {
        return amenity
      }

      changed = true
      return {
        ...amenity,
        _key: amenity._key || `amenity-${amenityIndex}`,
        imagesV2: nextImagesV2,
      }
    })

    if (!changed) continue

    if (!dryRun) {
      await client.patch(page._id).set({ amenities: nextAmenities }).commit()
    }

    stats.amenitiesPatches += 1
  }

  console.log("Backfill summary")
  console.log(`- Media image doc patches: ${stats.mediaImagePatches}`)
  console.log(`- Single field patches: ${stats.singleFieldPatches}`)
  console.log(`- Gallery patches: ${stats.galleryPatches}`)
  console.log(`- Amenities patches: ${stats.amenitiesPatches}`)
  console.log(`- Missing media refs: ${stats.missingMediaRefs}`)
  console.log("Backfill complete.")
}

export default backfillInlineImages

const run = async () => {
  const client = getCliClient({ apiVersion: "2025-01-01" })
  await backfillInlineImages(client)
}

await run().catch((error: unknown) => {
  console.error("Backfill failed:", error)
  process.exitCode = 1
})
