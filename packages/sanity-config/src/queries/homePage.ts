import { defineQuery } from "groq"

export const getHomePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    hero{
      heading,
      subheading,
      heroImage{
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        },
        alt,
        caption,
        hotspot
      },
      ctaButton
    },
    visionPillars[] | order(order asc){
      title,
      icon,
      description,
      order
    },
    "partners": featuredPartners[]->{
      _id,
      name,
      slug,
      logo{
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        },
        alt
      },
      description,
      websiteUrl,
      order
    } | order(order asc),
    "quote": featuredQuote->{
      _id,
      quoteText,
      attribution,
      backgroundImage{
        asset->{
          _id,
          url,
          metadata{
            dimensions,
            lqip
          }
        },
        alt,
        caption,
        hotspot
      }
    },
    "gallery": homepageGallery->{
      _id,
      title,
      images[]{
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
          caption,
          hotspot
        },
        showOnMobile
      }
    }
  }
`)
