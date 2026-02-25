import { defineField, defineType } from "sanity"
import { DocumentTextIcon, ImageIcon, CogIcon, LinkIcon } from "@sanity/icons"
import { createRichTextBlocks, createInlineImage, createInlineFile } from "./shared"

export const updateSchema = defineType({
  name: "update",
  title: "Update",
  type: "document",
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
      title: "Hero Image (Direct Upload)",
      type: "contentImage",
      description: "Upload/select an image directly. Preferred for new content.",
      validation: (Rule) =>
        Rule.custom((value) => {
          const hasAsset = Boolean(
            (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref
          )
          return hasAsset ? true : "Hero image is required"
        }),
      group: "media",
    }),
    defineField({
      name: "body",
      title: "Update Content",
      type: "array",
      of: [
        createRichTextBlocks({ includeBlockquote: true }),
        createInlineImage(),
        createInlineFile(),
      ],
      description: "Rich text content for the update",
      group: "editorial",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "updateCategory" }],
      description: "Categorize this update for filtering",
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
      title: "Published at",
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
