import { CogIcon } from "@sanity/icons/Cog"
import { DocumentTextIcon } from "@sanity/icons/DocumentText"
import { ImageIcon } from "@sanity/icons/Image"
import { LinkIcon } from "@sanity/icons/Link"
import { defineField, defineType } from "sanity"
import { createBodyField } from "./shared"

export const updateSchema = defineType({
  name: "update",
  title: "Updates",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    {
      name: "editorial",
      title: "Editorial",
      icon: DocumentTextIcon,
      default: true,
    },
    {
      name: "media",
      title: "Media",
      icon: ImageIcon,
    },
    {
      name: "relationships",
      title: "Relationships",
      icon: LinkIcon,
    },
    {
      name: "settings",
      title: "Settings",
      icon: CogIcon,
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "editorial",
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
      group: "settings",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
      description: "Brief summary shown in update listings (max 200 characters)",
      group: "editorial",
    }),
    defineField({
      name: "heroImageV2",
      title: "Hero Image",
      type: "contentImage",
      description: "Optional. Short notices can be published without a photo.",
      group: "media",
    }),
    createBodyField({
      name: "body",
      title: "Update Content",
      description:
        "Optional details, links, images, or attachments. The short description can stand alone for brief notices.",
      group: "editorial",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
      description:
        "Optional last day this notice applies. After this date (Richmond time), it is labeled Ended. The article stays published and readable.",
      group: "editorial",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "updateCategory" }],
      description: "Categorize this update for filtering on the Updates page",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "relatedEvents",
      title: "Related Events",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "event" }],
        },
      ],
      description: "Events associated with this update",
      validation: (Rule) => Rule.unique(),
      group: "relationships",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      description: "Projects associated with this update",
      validation: (Rule) => Rule.unique(),
      group: "relationships",
    }),
    defineField({
      name: "featured",
      title: "Featured Update",
      type: "boolean",
      initialValue: false,
      description: "Show this update prominently on the homepage and listing page",
      group: "settings",
    }),
    defineField({
      name: "publishedAt",
      title: "Publication Date",
      description:
        "Date shown to readers and used for ordering. This does not schedule publication; use Publish to make the update live.",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      group: "settings",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      date: "publishedAt",
      featured: "featured",
      media: "heroImageV2",
    },
    prepare(selection) {
      const { title, category, date, featured, media } = selection
      const dateStr = date ? new Date(date).toLocaleDateString() : "No date"
      const categoryStr = category || "Uncategorized"
      return {
        title: featured ? `${title}` : title,
        subtitle: `${categoryStr} • ${dateStr}${featured ? " • Featured" : ""}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
})
