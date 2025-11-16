import { defineField, defineType } from "sanity"

export const mediaImageSchema = defineType({
  name: "mediaImage",
  title: "Media Image",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Internal title for organization",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
        metadata: ["blurhash", "lqip", "palette"],
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Park Views", value: "park-views" },
          { title: "Events", value: "events" },
          { title: "Nature", value: "nature" },
          { title: "Community", value: "community" },
          { title: "History", value: "history" },
        ],
      },
      initialValue: "park-views",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show in featured gallery sections",
    }),
    defineField({
      name: "uploadedAt",
      title: "Uploaded at",
      type: "datetime",
      description: "When this image was uploaded",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Upload Date, Newest",
      name: "uploadDateDesc",
      by: [{ field: "uploadedAt", direction: "desc" }],
    },
    {
      title: "Upload Date, Oldest",
      name: "uploadDateAsc",
      by: [{ field: "uploadedAt", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
})
