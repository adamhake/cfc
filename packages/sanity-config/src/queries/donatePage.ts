import { defineQuery } from "groq"

export const getDonatePageQuery = defineQuery(`
  *[_type == "donatePage"][0]{
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
    }
  }
`)
