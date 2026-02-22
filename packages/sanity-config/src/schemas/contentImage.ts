import { defineArrayMember, defineField, defineType } from "sanity"

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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Image title",
      description: "Optional internal label for editors",
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      options: {
        list: mediaCategoryList,
      },
      initialValue: "park-views",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "mediaTag" }],
        }),
      ],
      options: {
        layout: "tags",
      },
      description: "Optional tags for organizing and filtering images",
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
