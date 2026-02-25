import { defineQuery } from "groq"
import { imageFieldProjection } from "./imageProjections"

export const getProjectsPageQuery = defineQuery(`
  *[_type == "projectsPage" && !(_id in path("drafts.**"))][0]{
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
