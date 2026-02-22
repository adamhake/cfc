import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getEventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0]{
    pageHero{
      title,
      description,
      "image": imageV2{
        ${imageFieldProjection}
      }
    },
    introduction
  }
`)
