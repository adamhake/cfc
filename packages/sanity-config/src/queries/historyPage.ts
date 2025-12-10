import { defineQuery } from "groq"

export const getHistoryPageQuery = defineQuery(`
  *[_type == "historyPage"][0]{
    pageHero{
      title,
      description,
      image->{
        image{
          asset->{
            _id,
            url,
            metadata{
              dimensions,
              lqip
            }
          },
          alt,
          hotspot
        }
      }
    },
    introduction
  }
`)
