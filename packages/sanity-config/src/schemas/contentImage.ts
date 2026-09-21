import { defineField, defineType } from "sanity"
import { altRequiredWithImage } from "./shared"

const mediaCategoryList = [
  { title: "Park Views", value: "park-views" },
  { title: "Events", value: "events" },
  { title: "Nature", value: "nature" },
  { title: "Community", value: "community" },
  { title: "History", value: "history" },
]

export const contentImageSchema = defineType({
  name: "contentImage",
  title: "Content Image",
  type: "image",
  options: {
    hotspot: true,
    metadata: ["blurhash", "lqip", "palette"],
  },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative text",
      description:
        'Describe what the image shows, for screen readers and for when the image fails to load. Don\'t start with "Image of".',
      validation: (rule) => rule.custom(altRequiredWithImage()),
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption",
      description: "Optional. Visible text printed below the image.",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Image title",
      description: "Optional internal label for editors. Not shown on the site.",
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "Used to group images in the Media page gallery.",
      options: {
        list: mediaCategoryList,
      },
      initialValue: "park-views",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "asset",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled image",
        subtitle: subtitle || "Uncategorized",
        media,
      }
    },
  },
})
