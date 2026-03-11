import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getMediaPageQuery = defineQuery(`
  *[_type == "mediaPage"][0]{
    _id,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    }
  }
`)
