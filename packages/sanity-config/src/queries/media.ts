// Base media image fields projection
// Note: These are plain GROQ query strings
export const mediaImageFields = `
  _id,
  _type,
  title,
  "image": image{
    asset->{
      _id,
      url,
      metadata{
        dimensions,
        lqip,
        blurhash,
        palette
      }
    },
    alt,
    caption,
    hotspot,
    crop
  },
  category,
  featured,
  uploadedAt
`

// Get all media images
export const allMediaImagesQuery = `
  *[_type == "mediaImage" && !(_id in path("drafts.**"))] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get media images by category
export const mediaImagesByCategoryQuery = `
  *[_type == "mediaImage" && !(_id in path("drafts.**")) && category == $category] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get featured media images
export const featuredMediaImagesQuery = `
  *[_type == "mediaImage" && !(_id in path("drafts.**")) && featured == true] | order(uploadedAt desc) {
    ${mediaImageFields}
  }
`

// Get media image by ID
export const mediaImageByIdQuery = `
  *[_type == "mediaImage" && _id == $id && !(_id in path("drafts.**"))][0] {
    ${mediaImageFields}
  }
`
