import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getGalleriesQuery = defineQuery(`
  *[_type == "gallery" && !(_id in path("drafts.**"))] | order(order asc){
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
  *[_type == "gallery" && galleryType == $type && !(_id in path("drafts.**"))] | order(order asc){
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
  *[_type == "gallery" && _id == $id && !(_id in path("drafts.**"))][0]{
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
