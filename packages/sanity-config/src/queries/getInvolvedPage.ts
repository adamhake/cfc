import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getGetInvolvedPageQuery = defineQuery(`
  *[_type == "getInvolvedPage" && !(_id in path("drafts.**"))][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
