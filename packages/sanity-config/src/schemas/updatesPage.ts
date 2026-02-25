import { defineField, defineType } from "sanity"
import { createIntroductionField } from "./shared"

export default defineType({
  name: "updatesPage",
  title: "Updates Page",
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
          description: "Upload/select an image directly. Preferred for new content.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField(createIntroductionField()),
  ],
  preview: {
    prepare() {
      return {
        title: "Updates Page",
        subtitle: "Updates page configuration",
      }
    },
  },
})
