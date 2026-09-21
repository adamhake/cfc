import { CalendarIcon } from "@sanity/icons/Calendar"
import { CogIcon } from "@sanity/icons/Cog"
import { ImageIcon } from "@sanity/icons/Image"
import { defineField, defineType } from "sanity"
import { altRequiredWithImage, createBodyField, requiredImage } from "./shared"

export const eventSchema = defineType({
  name: "event",
  title: "Events",
  type: "document",
  icon: CalendarIcon,
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
        // Request LQIP + blurhash so placeholders render with the responsive <img>
        metadata: ["blurhash", "lqip", "palette"],
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) => rule.custom(altRequiredWithImage()),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
      description: "Shown at the top of the event page and on event cards in listings.",
      validation: (Rule) => Rule.custom(requiredImage("Hero image is required")),
      group: "media",
    }),
    defineField({
      name: "date",
      title: "Event Date",
      type: "date",
      description: "The day the event happens. Used to sort events and to mark them as past.",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "time",
      title: "Event Time",
      type: "string",
      placeholder: "9am - 12pm",
      description:
        'Displayed exactly as typed, so keep the format consistent across events (e.g. "9am - 12pm").',
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'Where in (or near) the park to meet, e.g. "Upper park, near the gazebo"',
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    createBodyField({
      name: "body",
      title: "Event Details",
      description: "Extended event information",
      group: "editorial",
    }),
    createBodyField({
      name: "recap",
      title: "Event Recap",
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
      title: "Publication Date",
      type: "datetime",
      description:
        "Date this event was announced, used for ordering. This does not schedule publication; use Publish to make the event live.",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
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
        title: title || "Untitled event",
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
