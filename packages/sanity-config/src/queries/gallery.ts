import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getGalleriesQuery = defineQuery(`
  *[_type == "gallery"] | order(order asc){
    _id,
    title,
    galleryType,
    images[]{
      "image": imageV2{
        ${imageFieldProjection}
      },
      showOnMobile
    },
    order
  }
`)

export const getGalleryByTypeQuery = defineQuery(`
  *[_type == "gallery" && galleryType == $type] | order(order asc){
    _id,
    title,
    galleryType,
    images[]{
      "image": imageV2{
        ${imageFieldProjection}
      },
      showOnMobile
    },
    order
  }
`)

export const getGalleryByIdQuery = defineQuery(`
  *[_type == "gallery" && _id == $id][0]{
    _id,
    title,
    galleryType,
    images[]{
      "image": imageV2{
        ${imageFieldProjection}
      },
      showOnMobile
    },
    order
  }
`)
