import { defineQuery } from "groq"
import { imageFieldProjection, imageFieldProjectionSlim } from "./imageProjections"

// Get all media images
export const allMediaImagesQuery = defineQuery(`
  *[_type == "mediaImage" && defined(imageV2.asset)] | order(_createdAt desc) {
    _id,
    _type,
    "title": coalesce(imageV2.title, "Untitled image"),
    "image": imageV2{
      ${imageFieldProjectionSlim}
    },
    "category": coalesce(imageV2.category, "park-views")
  }
`)

// Get media images by category
export const mediaImagesByCategoryQuery = defineQuery(`
  *[
    _type == "mediaImage" &&
    defined(imageV2.asset) &&
    imageV2.category == $category
  ] | order(_createdAt desc) {
    _id,
    _type,
    "title": coalesce(imageV2.title, "Untitled image"),
    "image": imageV2{
      ${imageFieldProjectionSlim}
    },
    "category": coalesce(imageV2.category, "park-views")
  }
`)

// Get media image by ID
export const mediaImageByIdQuery = defineQuery(`
  *[_type == "mediaImage" && defined(imageV2.asset) && _id == $id][0] {
    _id,
    _type,
    "title": coalesce(imageV2.title, "Untitled image"),
    "image": imageV2{
      ${imageFieldProjection}
    },
    "category": coalesce(imageV2.category, "park-views")
  }
`)

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
