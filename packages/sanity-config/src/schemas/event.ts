import { CalendarIcon, CogIcon, ImageIcon } from "@sanity/icons"
import React from "react"
import { defineField, defineType } from "sanity"

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
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            {
              title: "Leading",
              value: "leading",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1rem", lineHeight: "1.6" } },
                  children
                ),
            },
            {
              title: "Leading Large",
              value: "leading-lg",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1.25rem", lineHeight: "1.6" } },
                  children
                ),
            },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "file",
          name: "fileAttachment",
          title: "File Attachment",
          options: {
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.txt",
          },
          fields: [
            {
              name: "title",
              type: "string",
              title: "File Title",
              description: "Optional custom label for the file",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              description: "Optional description of the file content",
            },
          ],
        },
      ],
      description: "Extended event information",
      group: "editorial",
    }),
    defineField({
      name: "recap",
      title: "Event Recap",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            {
              title: "Leading",
              value: "leading",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1rem", lineHeight: "1.6" } },
                  children
                ),
            },
            {
              title: "Leading Large",
              value: "leading-lg",
              component: ({ children }: { children?: React.ReactNode }) =>
                React.createElement(
                  "p",
                  { style: { fontSize: "1.25rem", lineHeight: "1.6" } },
                  children
                ),
            },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "file",
          name: "fileAttachment",
          title: "File Attachment",
          options: {
            accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.txt",
          },
          fields: [
            {
              name: "title",
              type: "string",
              title: "File Title",
              description: "Optional custom label for the file",
            },
            {
              name: "description",
              type: "text",
              title: "Description",
              description: "Optional description of the file content",
            },
          ],
        },
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
