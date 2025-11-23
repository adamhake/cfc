import { defineQuery } from "groq"

export const getEventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0]{
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
