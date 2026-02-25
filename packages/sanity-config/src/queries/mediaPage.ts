import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getMediaPageQuery = defineQuery(`
  *[_type == "mediaPage" && !(_id in path("drafts.**"))][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    }
  }
`)
