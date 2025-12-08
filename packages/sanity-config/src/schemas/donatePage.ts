import { defineField, defineType } from "sanity"

export default defineType({
  name: "donatePage",
  title: "Donate Page",
  type: "document",
  fields: [
    defineField({
      name: "pageHero",
      title: "Page Hero",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          validation: (rule) => rule.max(500),
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "reference",
          to: [{ type: "mediaImage" }],
          description: "Select an image from the media library to use as the hero image",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Donate Page",
        subtitle: "Donation and support information",
      }
    },
  },
})
