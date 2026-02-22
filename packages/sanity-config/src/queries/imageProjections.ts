export const imageFieldProjection = `
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
`

export const mediaImageDocumentProjection = `
  _id,
  _type,
  "title": coalesce(imageV2.title, "Untitled image"),
  "image": imageV2{
    ${imageFieldProjection}
  },
  "category": coalesce(imageV2.category, "park-views"),
  featured
`
