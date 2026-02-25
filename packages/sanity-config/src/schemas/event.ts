import { CalendarIcon, CogIcon, ImageIcon } from "@sanity/icons"
import { defineField, defineType } from "sanity"
import { createRichTextBlocks, createInlineImage, createInlineFile } from "./shared"

export const eventSchema = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    {
      name: "editorial",
      title: "Editorial",
      icon: CalendarIcon,
      default: true,
    },
    {
      name: "media",
      title: "Media",
      icon: ImageIcon,
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
      rows: 3,
      validation: (Rule) => Rule.required().max(325),
      description: "Brief summary shown in event listings",
      group: "editorial",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
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
      group: "media",
    }),
    defineField({
      name: "date",
      title: "Event Date",
      type: "date",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "time",
      title: "Event Time",
      type: "string",
      placeholder: "9am - 12pm",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "body",
      title: "Event Details",
      type: "array",
      of: [
        createRichTextBlocks({ includeBlockquote: true }),
        createInlineImage(),
        createInlineFile(),
      ],
      description: "Extended event information",
      group: "editorial",
    }),
    defineField({
      name: "recap",
      title: "Event Recap",
      type: "array",
      of: [
        createRichTextBlocks({ includeBlockquote: true }),
        createInlineImage(),
        createInlineFile(),
      ],
      description:
        "Retrospective content shown for past events. When populated, this replaces the Event Details on the public page.",
      group: "editorial",
    }),
    defineField({
      name: "recapGallery",
      title: "Recap Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      description: "Optional photo gallery to display with the event recap",
      group: "media",
    }),
    defineField({
      name: "featured",
      title: "Featured Event",
      type: "boolean",
      initialValue: false,
      description: "Show this event prominently on the homepage",
      group: "settings",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      group: "settings",
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      media: "heroImage",
    },
    prepare(selection) {
      const { title, date, media } = selection
      return {
        title: title,
        subtitle: date ? new Date(date).toLocaleDateString() : "No date",
        media: media,
      }
    },
  },
  orderings: [
    {
      title: "Event Date, Newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Event Date, Oldest",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
})
