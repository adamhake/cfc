import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getAmenitiesPageQuery = defineQuery(`
  *[_type == "amenitiesPage"][0]{
    _id,
    _type,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction,
    amenities[]{
      title,
      slug,
      icon,
      description,
      details,
      "images": imagesV2[defined(asset)][]{
        ${imageFieldProjection}
      },
      externalLink,
      linkText,
      section
    }
  }
`)
