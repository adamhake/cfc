import { defineField, defineType } from "sanity"

export default defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
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
              name: "image",
              title: "Image",
              type: "reference",
              to: [{ type: "mediaImage" }],
              description: "Select an image from the media library",
              validation: (rule) => rule.required(),
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
              title: "image.title",
              subtitle: "image.category",
              media: "image.image",
              showOnMobile: "showOnMobile",
            },
            prepare({ title, subtitle, media, showOnMobile }) {
              return {
                title: title || "Untitled",
                subtitle: `${subtitle || "Uncategorized"}${!showOnMobile ? " (hidden on mobile)" : ""}`,
                media,
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
      media: "images.0.image.image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: `${subtitle} gallery`,
        media,
      }
    },
  },
})
