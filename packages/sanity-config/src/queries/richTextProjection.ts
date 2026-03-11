/**
 * Shared GROQ projection for rich text (Portable Text) array fields.
 *
 * Dereferences embedded image and file attachment assets so that
 * components receive resolved URLs instead of raw Sanity references.
 *
 * Usage in a query:
 *   body[]{
 *     ${richTextProjection}
 *   }
 */
export const richTextProjection = `
  ...,
  _type == "image" => {
    ...,
    asset->{
      _id,
      url,
      metadata{
        dimensions,
        lqip,
        blurhash
      }
    }
  },
  _type == "fileAttachment" => {
    ...,
    asset->{
      _id,
      url,
      originalFilename,
      size,
      extension,
      mimeType
    }
  }
`
