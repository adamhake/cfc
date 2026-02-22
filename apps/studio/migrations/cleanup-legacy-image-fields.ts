/**
 * Cleanup script for removing legacy media image reference fields once v2 data exists.
 *
 * Run from apps/studio:
 * npx sanity@latest exec migrations/cleanup-legacy-image-fields.ts --with-user-token -- --dry-run
 * npx sanity@latest exec migrations/cleanup-legacy-image-fields.ts --with-user-token
 */
import { getCliClient } from "sanity/cli"

type ReferenceLike = {
  _ref?: string
}

type ImageLike = {
  asset?: ReferenceLike
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

const hasV2Image = (value: unknown): value is ImageLike => {
  if (!value || typeof value !== "object") return false
  return typeof (value as ImageLike).asset?._ref === "string"
}

const cleanupLegacyImageFields = async (client: {
  fetch: <T>(query: string, params?: Record<string, string>) => Promise<T>
  patch: (id: string) => {
    unset: (paths: string[]) => { commit: () => Promise<unknown> }
    set: (value: Record<string, unknown>) => { commit: () => Promise<unknown> }
  }
}) => {
  const dryRun = parseDryRun()
  console.log(`Starting legacy image cleanup (${dryRun ? "dry-run" : "write"} mode)...`)

  const stats = {
    singleFieldUnsets: 0,
    mediaImageFieldUnsets: 0,
    galleryPatches: 0,
    amenitiesPatches: 0,
  }

  const docsByType = new Map<string, GenericDoc[]>()
  for (const type of Array.from(new Set(SINGLE_FIELD_CONFIGS.map((config) => config.type)))) {
    const docs = await client.fetch<GenericDoc[]>(`*[_type == $type]{_id, ...}`, { type })
    docsByType.set(type, docs)
  }

  for (const config of SINGLE_FIELD_CONFIGS) {
    const docs = docsByType.get(config.type) || []

    for (const doc of docs) {
      const legacyValue = getByPath(doc, config.legacyPath)
      const v2Value = getByPath(doc, config.v2Path)
      if (!hasLegacyReference(legacyValue) || !hasV2Image(v2Value)) continue

      if (!dryRun) {
        await client.patch(doc._id).unset([config.legacyPath]).commit()
      }
      stats.singleFieldUnsets += 1
    }
  }

  const mediaImages = await client.fetch<
    Array<{
      _id: string
      title?: string
      category?: string
      image?: ImageLike
      imageV2?: ImageLike
    }>
  >('*[_type == "mediaImage"]{_id, title, category, image{asset}, imageV2{asset}}')

  for (const mediaImage of mediaImages) {
    if (!hasV2Image(mediaImage.imageV2)) continue

    const unsetPaths: string[] = []
    if (hasV2Image(mediaImage.image)) unsetPaths.push("image")
    if (typeof mediaImage.title === "string" && mediaImage.title.trim().length > 0) unsetPaths.push("title")
    if (typeof mediaImage.category === "string" && mediaImage.category.trim().length > 0)
      unsetPaths.push("category")

    if (!unsetPaths.length) continue

    if (!dryRun) {
      await client.patch(mediaImage._id).unset(unsetPaths).commit()
    }
    stats.mediaImageFieldUnsets += unsetPaths.length
  }

  const galleries = await client.fetch<
    Array<{
      _id: string
      images?: Array<{
        _key?: string
        image?: ReferenceLike
        imageV2?: ImageLike
        showOnMobile?: boolean
      }>
    }>
  >('*[_type == "gallery"]{_id, images}')

  for (const gallery of galleries) {
    const originalItems = gallery.images || []
    let changed = false

    const nextItems = originalItems.map((item) => {
      if (!hasLegacyReference(item.image) || !hasV2Image(item.imageV2)) {
        return item
      }

      const { image: _legacyImage, ...rest } = item
      changed = true
      return rest
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
        imagesV2?: ImageLike[]
      }>
    }>
  >('*[_type == "amenitiesPage"]{_id, amenities}')

  for (const page of amenitiesPages) {
    const originalAmenities = page.amenities || []
    let changed = false

    const nextAmenities = originalAmenities.map((amenity) => {
      const hasLegacyImages = (amenity.images || []).some((image) => hasLegacyReference(image))
      const hasAnyV2Images = (amenity.imagesV2 || []).some((image) => hasV2Image(image))

      if (!hasLegacyImages || !hasAnyV2Images) {
        return amenity
      }

      const { images: _legacyImages, ...rest } = amenity
      changed = true
      return rest
    })

    if (!changed) continue
    if (!dryRun) {
      await client.patch(page._id).set({ amenities: nextAmenities }).commit()
    }
    stats.amenitiesPatches += 1
  }

  console.log("Cleanup summary")
  console.log(`- Single field unsets: ${stats.singleFieldUnsets}`)
  console.log(`- mediaImage legacy field unsets: ${stats.mediaImageFieldUnsets}`)
  console.log(`- Gallery patches: ${stats.galleryPatches}`)
  console.log(`- Amenities patches: ${stats.amenitiesPatches}`)
  console.log("Cleanup complete.")
}

export default cleanupLegacyImageFields

const run = async () => {
  const client = getCliClient({ apiVersion: "2025-01-01" })
  await cleanupLegacyImageFields(client)
}

await run().catch((error: unknown) => {
  console.error("Cleanup failed:", error)
  process.exitCode = 1
})
