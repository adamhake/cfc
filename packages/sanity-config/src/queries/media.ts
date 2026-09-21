import { defineQuery } from "groq"
import { imageFieldProjectionSlim } from "./imageProjections"

// Paginated media images query
// Uses slice-based pagination with limit and offset
export const paginatedMediaImagesQuery = defineQuery(`
  *[_type == "mediaImage" && defined(imageV2.asset)] | order(_createdAt desc) [$start...$end] {
    _id,
    _type,
    "title": coalesce(imageV2.title, "Untitled image"),
    "image": imageV2{
      ${imageFieldProjectionSlim}
    },
    "category": coalesce(imageV2.category, "park-views")
  }
`)

// Get total count of media images
export const mediaImagesCountQuery = defineQuery(`
  count(*[_type == "mediaImage" && defined(imageV2.asset)])
`)
