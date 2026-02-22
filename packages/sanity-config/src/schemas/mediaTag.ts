import { TagIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"

export const mediaTagSchema = defineType({
  name: "mediaTag",
  title: "Media Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Tag label used for media organization",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional notes about when this tag should be used",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      }
    },
  },
  orderings: [
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
})
