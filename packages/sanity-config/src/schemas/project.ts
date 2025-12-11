import { CogIcon, ImageIcon, LinkIcon, RocketIcon } from "@sanity/icons"
import React from "react"
import { defineField, defineType } from "sanity"

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    {
      name: "editorial",
      title: "Editorial",
      icon: RocketIcon,
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
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: "Brief summary shown in project listings",
      group: "editorial",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "reference",
      to: [{ type: "mediaImage" }],
      description: "Select an image from the media library to use as the hero image",
      validation: (Rule) => Rule.required(),
      group: "media",
    }),
    defineField({
      name: "status",
      title: "Project Status",
      type: "string",
      options: {
        list: [
          { title: "Planned", value: "planned" },
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "planned",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
      validation: (Rule) => Rule.required(),
      group: "editorial",
    }),
    defineField({
      name: "startDateOverride",
      title: "Start Date Override",
      type: "string",
      description:
        "Display this text instead of the formatted start date (e.g., 'Spring 2024', 'Early 2025')",
      group: "editorial",
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
      description: "Optional - leave blank for ongoing projects",
      group: "editorial",
    }),
    defineField({
      name: "completionDateOverride",
      title: "Completion Date Override",
      type: "string",
      description:
        "Display this text instead of the formatted completion date (e.g., 'Fall 2025', 'Ongoing')",
      group: "editorial",
    }),
    defineField({
      name: "goal",
      title: "Project Goal",
      type: "text",
      rows: 3,
      description: "What this project aims to achieve",
      group: "editorial",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Specific area within the park, if applicable",
      group: "editorial",
    }),
    defineField({
      name: "budget",
      title: "Budget",
      type: "string",
      description: "Project budget or funding goal (e.g., '$50,000')",
      group: "editorial",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Restoration", value: "restoration" },
          { title: "Recreation", value: "recreation" },
          { title: "Connection", value: "connection" },
          { title: "Preservation", value: "preservation" },
        ],
      },
      description: "Aligns with the Conservancy's vision pillars",
      group: "editorial",
    }),
    defineField({
      name: "body",
      title: "Project Details",
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
      description: "Extended project information and updates",
      group: "editorial",
    }),
    defineField({
      name: "gallery",
      title: "Project Gallery",
      type: "array",
      of: [
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
      ],
      description: "Additional images showcasing the project",
      group: "media",
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
      description: "Events associated with this project",
      group: "relationships",
    }),
    defineField({
      name: "partners",
      title: "Project Partners",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "partner" }],
        },
      ],
      description: "Organizations partnering on this project",
      group: "relationships",
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
      description: "Show this project prominently on the homepage",
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
      status: "status",
      startDate: "startDate",
      media: "heroImage",
    },
    prepare(selection) {
      const { title, status, startDate, media } = selection
      const statusLabel =
        status === "planned" ? "Planned" : status === "active" ? "Active" : "Completed"
      const dateStr = startDate ? new Date(startDate).toLocaleDateString() : "No date"
      return {
        title: title,
        subtitle: `${statusLabel} • ${dateStr}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: "Start Date, Newest",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Start Date, Oldest",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Status",
      name: "statusOrder",
      by: [
        { field: "status", direction: "asc" },
        { field: "startDate", direction: "desc" },
      ],
    },
  ],
})
