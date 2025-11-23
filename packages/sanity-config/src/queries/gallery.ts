import { defineQuery } from "groq"

export const getGalleriesQuery = defineQuery(`
  *[_type == "gallery"] | order(order asc){
    _id,
    title,
    galleryType,
    images[]{
      image->{
        _id,
        title,
        image{
          asset->{
            _id,
            url,
            metadata{
              dimensions,
              lqip,
              palette
            }
          },
          alt,
          caption,
          hotspot,
          crop
        },
        category,
        featured
      },
      showOnMobile
    },
    order
  }
`)

export const getGalleryByTypeQuery = defineQuery(`
  *[_type == "gallery" && galleryType == $type] | order(order asc){
    _id,
    title,
    galleryType,
    images[]{
      image->{
        _id,
        title,
        image{
          asset->{
            _id,
            url,
            metadata{
              dimensions,
              lqip,
              palette
            }
          },
          alt,
          caption,
          hotspot,
          crop
        },
        category,
        featured
      },
      showOnMobile
    },
    order
  }
`)

export const getGalleryByIdQuery = defineQuery(`
  *[_type == "gallery" && _id == $id][0]{
    _id,
    title,
    galleryType,
    images[]{
      image->{
        _id,
        title,
        image{
          asset->{
            _id,
            url,
            metadata{
              dimensions,
              lqip,
              palette
            }
          },
          alt,
          caption,
          hotspot,
          crop
        },
        category,
        featured
      },
      showOnMobile
    },
    order
  }
`)
