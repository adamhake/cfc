import { ImagesIcon } from "@sanity/icons/Images"
import { defineField, defineType } from "sanity"
import { requiredImage } from "./shared"

export default defineType({
  name: "gallery",
  title: "Galleries",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal title for identifying this gallery",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "galleryType",
      title: "Gallery Type",
      type: "string",
      description: "Where this gallery is used",
      options: {
        list: [
          { title: "Homepage", value: "homepage" },
          { title: "Amenities", value: "amenities" },
          { title: "Events", value: "events" },
          { title: "About", value: "about" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "imageV2",
              title: "Image (Direct Upload)",
              type: "contentImage",
              description: "Upload/select an image.",
              validation: (rule) => rule.custom(requiredImage()),
            }),
            defineField({
              name: "showOnMobile",
              title: "Show on Mobile",
              type: "boolean",
              description: "Display this image on mobile devices",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "imageV2.title",
              subtitle: "imageV2.category",
              media: "imageV2",
              showOnMobile: "showOnMobile",
            },
            prepare({ title, subtitle, media, showOnMobile }) {
              return {
                title: title || "Untitled",
                subtitle: `${subtitle || "Uncategorized"}${!showOnMobile ? " (hidden on mobile)" : ""}`,
                media: media,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(20),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order for galleries of the same type",
      validation: (rule) => rule.required().min(0),
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "galleryType",
      media: "images.0.imageV2",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled gallery",
        subtitle: subtitle ? `${subtitle} gallery` : "No gallery type set",
        media: media,
      }
    },
  },
  orderings: [
    {
      title: "Type, then Display Order",
      name: "typeThenOrder",
      by: [
        { field: "galleryType", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
})
