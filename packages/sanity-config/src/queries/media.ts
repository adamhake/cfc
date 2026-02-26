import { imageFieldProjection } from "./imageProjections"

// Base media image fields projection
// Note: These are plain GROQ query strings
export const mediaImageFields = `
  _id,
  _type,
  "title": coalesce(imageV2.title, "Untitled image"),
  "image": imageV2{
    ${imageFieldProjection}
  },
  "category": coalesce(imageV2.category, "park-views"),
  featured,
  uploadedAt
`

// Get all media images
export const allMediaImagesQuery = `
  *[_type == "mediaImage" && defined(imageV2.asset) && hideFromMediaPage != true] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get media images by category
export const mediaImagesByCategoryQuery = `
  *[
    _type == "mediaImage" &&
    defined(imageV2.asset) &&
    hideFromMediaPage != true &&
    imageV2.category == $category
  ] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get featured media images
export const featuredMediaImagesQuery = `
  *[_type == "mediaImage" && defined(imageV2.asset) && hideFromMediaPage != true && featured == true] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get media image by ID
export const mediaImageByIdQuery = `
  *[_type == "mediaImage" && defined(imageV2.asset) && _id == $id][0] {
    ${mediaImageFields}
  }
`

// Paginated media images query
// Uses slice-based pagination with limit and offset
export const paginatedMediaImagesQuery = `
  *[_type == "mediaImage" && defined(imageV2.asset) && hideFromMediaPage != true] | order(uploadedAt desc) [$start...$end] {
    ${mediaImageFields}
  }
`

// Get total count of media images
export const mediaImagesCountQuery = `
  count(*[_type == "mediaImage" && defined(imageV2.asset) && hideFromMediaPage != true])
`
