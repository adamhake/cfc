import { defineField, defineType } from "sanity"
import { requiredImage } from "./shared"

export default defineType({
  name: "quote",
  title: "Quotes",
  type: "document",
  fields: [
    defineField({
      name: "quoteText",
      title: "Quote Text",
      type: "text",
      description: "The inspirational quote text",
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Author or source of the quote",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundImageV2",
      title: "Background Image (Direct Upload)",
      type: "contentImage",
      description: "Upload/select an image.",
      validation: (rule) => rule.custom(requiredImage("Background image is required")),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Mark as featured to display on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Optional category or theme for filtering",
      options: {
        list: [
          { title: "Nature", value: "nature" },
          { title: "Community", value: "community" },
          { title: "Conservation", value: "conservation" },
          { title: "History", value: "history" },
        ],
        layout: "dropdown",
      },
    }),
  ],
  preview: {
    select: {
      title: "quoteText",
      subtitle: "attribution",
      media: "backgroundImageV2",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      const text = title ? `${title.slice(0, 60)}${title.length > 60 ? "…" : ""}` : "Untitled quote"
      return {
        title: featured ? `⭐ ${text}` : text,
        subtitle: subtitle ? `— ${subtitle}` : "No attribution",
        media,
      }
    },
  },
})
