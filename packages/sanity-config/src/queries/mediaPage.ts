import { defineQuery } from "groq"

export const getMediaPageQuery = defineQuery(`
  *[_type == "mediaPage"][0]{
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
