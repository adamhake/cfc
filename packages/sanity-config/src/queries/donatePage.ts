import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getDonatePageQuery = defineQuery(`
  *[_type == "donatePage"][0]{
    _id,
    _type,
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    }
  }
`)
