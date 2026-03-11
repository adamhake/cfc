import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"
import { richTextProjection } from "./richTextProjection"

export const getHistoryPageQuery = defineQuery(`
  *[_type == "historyPage"][0]{
    content[]{
      ${richTextProjection}
    },
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
  }
`)
