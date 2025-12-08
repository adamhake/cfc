import { defineField, defineType } from "sanity"
import { TagIcon } from "@sanity/icons"

export const updateCategorySchema = defineType({
  name: "updateCategory",
  title: "Update Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Category name (e.g., 'News', 'Volunteer Spotlight')",
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
      description: "URL-friendly identifier for filtering",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional description for editors",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      description: "Optional accent color for category chips (e.g., 'green', 'blue')",
      options: {
        list: [
          { title: "Green", value: "green" },
          { title: "Blue", value: "blue" },
          { title: "Orange", value: "orange" },
          { title: "Purple", value: "purple" },
          { title: "Teal", value: "teal" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      color: "color",
    },
    prepare(selection) {
      const { title, color } = selection
      return {
        title: title,
        subtitle: color ? `Color: ${color}` : "No color set",
      }
    },
  },
  orderings: [
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
})
