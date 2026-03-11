import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getProjectsPageQuery = defineQuery(`
  *[_type == "projectsPage"][0]{
    _id,
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
