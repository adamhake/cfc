/**
 * Audit script for the media model migration.
 *
 * Run from apps/studio:
 * npx sanity@latest exec migrations/audit-media-usage.ts --with-user-token
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

type AuditFieldConfig = {
  label: string
  type: string
  legacyPath: string
  v2Path: string
}

const SINGLE_FIELD_CONFIGS: AuditFieldConfig[] = [
  {
    label: "homePage.hero.heroImage",
    type: "homePage",
    legacyPath: "hero.heroImage",
    v2Path: "hero.heroImageV2",
  },
  {
    label: "project.heroImage",
    type: "project",
    legacyPath: "heroImage",
    v2Path: "heroImageV2",
  },
  {
    label: "update.heroImage",
    type: "update",
    legacyPath: "heroImage",
    v2Path: "heroImageV2",
  },
  {
    label: "quote.backgroundImage",
    type: "quote",
    legacyPath: "backgroundImage",
    v2Path: "backgroundImageV2",
  },
  {
    label: "aboutPage.pageHero.image",
    type: "aboutPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "amenitiesPage.pageHero.image",
    type: "amenitiesPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "donatePage.pageHero.image",
    type: "donatePage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "eventsPage.pageHero.image",
    type: "eventsPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "getInvolvedPage.pageHero.image",
    type: "getInvolvedPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "historyPage.pageHero.image",
    type: "historyPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "mediaPage.pageHero.image",
    type: "mediaPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "projectsPage.pageHero.image",
    type: "projectsPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
  {
    label: "updatesPage.pageHero.image",
    type: "updatesPage",
    legacyPath: "pageHero.image",
    v2Path: "pageHero.imageV2",
  },
]

const getByPath = (obj: unknown, path: string): unknown => {
  if (!obj || typeof obj !== "object") return undefined
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

const hasLegacyReference = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false
  return typeof (value as ReferenceLike)._ref === "string"
}

const hasV2Image = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false
  const image = value as ImageLike
  return typeof image.asset?._ref === "string"
}

const auditMediaUsage = async (client: {
  fetch: <T>(query: string, params?: Record<string, string>) => Promise<T>
}) => {
  console.log("Starting media migration audit...")

  const mediaImageCount = await client.fetch<number>('count(*[_type == "mediaImage"])')
  console.log(`Media library docs: ${mediaImageCount}`)

  const mediaImageDocs = await client.fetch<Array<{ _id: string; image?: ImageLike; imageV2?: ImageLike }>>(
    '*[_type == "mediaImage"]{_id, image{asset}, imageV2{asset}}'
  )
  const mediaImageLegacyCount = mediaImageDocs.filter((doc) => hasV2Image(doc.image)).length
  const mediaImageV2Count = mediaImageDocs.filter((doc) => hasV2Image(doc.imageV2)).length
  console.log(`Media image docs: legacy image=${mediaImageLegacyCount}, imageV2=${mediaImageV2Count}`)
  console.log("")

  const docsByType = new Map<string, GenericDoc[]>()

  for (const type of Array.from(new Set(SINGLE_FIELD_CONFIGS.map((config) => config.type)))) {
    const docs = await client.fetch<GenericDoc[]>(`*[_type == $type]{_id, ...}`, { type })
    docsByType.set(type, docs)
  }

  console.log("Single-image fields")
  for (const config of SINGLE_FIELD_CONFIGS) {
    const docs = docsByType.get(config.type) || []
    const legacyCount = docs.filter((doc) => hasLegacyReference(getByPath(doc, config.legacyPath))).length
    const v2Count = docs.filter((doc) => hasV2Image(getByPath(doc, config.v2Path))).length

    console.log(`- ${config.label}: legacy=${legacyCount}, v2=${v2Count}`)
  }

  const galleries = await client.fetch<
    Array<{
      _id: string
      images?: Array<{
        image?: ReferenceLike
        imageV2?: ImageLike
      }>
    }>
  >('*[_type == "gallery"]{_id, images}')

  let galleryLegacyItems = 0
  let galleryV2Items = 0
  for (const gallery of galleries) {
    for (const item of gallery.images || []) {
      if (hasLegacyReference(item.image)) galleryLegacyItems += 1
      if (hasV2Image(item.imageV2)) galleryV2Items += 1
    }
  }

  console.log("")
  console.log(`Gallery items: legacy=${galleryLegacyItems}, v2=${galleryV2Items}`)

  const amenitiesPages = await client.fetch<
    Array<{
      _id: string
      amenities?: Array<{
        images?: ReferenceLike[]
        imagesV2?: ImageLike[]
      }>
    }>
  >('*[_type == "amenitiesPage"]{_id, amenities}')

  let amenityLegacyItems = 0
  let amenityV2Items = 0

  for (const page of amenitiesPages) {
    for (const amenity of page.amenities || []) {
      amenityLegacyItems += (amenity.images || []).filter(hasLegacyReference).length
      amenityV2Items += (amenity.imagesV2 || []).filter(hasV2Image).length
    }
  }

  console.log(`Amenities image items: legacy=${amenityLegacyItems}, v2=${amenityV2Items}`)
  console.log("")
  console.log("Audit complete.")
}

export default auditMediaUsage

const run = async () => {
  const client = getCliClient({ apiVersion: "2025-01-01" })
  await auditMediaUsage(client)
}

await run().catch((error: unknown) => {
  console.error("Audit failed:", error)
  process.exitCode = 1
})
