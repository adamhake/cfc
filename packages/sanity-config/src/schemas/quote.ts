import { defineField, defineType } from "sanity"

export default defineType({
  name: "quote",
  title: "Quote",
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
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description: "Background image for the quote section",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
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
      media: "backgroundImage",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: featured ? `⭐ ${title.substring(0, 60)}...` : `${title.substring(0, 60)}...`,
        subtitle: `— ${subtitle}`,
        media,
      }
    },
  },
})
