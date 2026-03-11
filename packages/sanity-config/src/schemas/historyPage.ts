import { defineField, defineType } from "sanity"
import { createInlineFile, createInlineImage, createRichTextBlocks } from "./shared"

export default defineType({
  name: "historyPage",
  title: "History Page",
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
          name: "imageV2",
          title: "Hero Image (Direct Upload)",
          type: "contentImage",
          description: "Upload/select an image.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        createRichTextBlocks({ includeBlockquote: true }),
        createInlineImage(),
        createInlineFile(),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "History Page",
        subtitle: "Learn about the rich history of Chimborazo Park",
      }
    },
  },
})
