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
