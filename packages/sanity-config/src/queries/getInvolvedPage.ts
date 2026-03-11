import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getGetInvolvedPageQuery = defineQuery(`
  *[_type == "getInvolvedPage"][0]{
    _id,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
