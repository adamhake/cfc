/**
 * Full image projection (includes palette metadata).
 * Use for detail pages where palette may drive theming.
 */
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

/**
 * Slim image projection without `palette` metadata.
 * Use for list queries — palette adds ~6 swatch objects per item and is not
 * currently consumed on the front-end (verified 2026-04-15).
 */
export const imageFieldProjectionSlim = `
  asset->{
    _id,
    url,
    metadata{
      dimensions,
      lqip,
      blurhash
    }
  },
  alt,
  caption,
  hotspot,
  crop
`
