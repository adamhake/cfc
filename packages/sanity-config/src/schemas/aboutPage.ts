import { defineArrayMember, defineField, defineType } from "sanity"
import { createRichTextBlocks, createInlineImage, createInlineFile } from "./shared"

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "missionVision", title: "Mission & Vision" },
    { name: "content", title: "Content" },
    { name: "board", title: "Board Members" },
  ],
  fields: [
    defineField({
      name: "pageHero",
      title: "Page Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          validation: (rule) => rule.max(500),
        }),
        defineField({
          name: "imageV2",
          title: "Hero Image (Direct Upload)",
          type: "contentImage",
          description: "Upload/select an image directly. Preferred for new content.",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "text",
      group: "missionVision",
      description: "The organization's mission statement.",
      validation: (rule) => rule.required().max(1000),
    }),
    defineField({
      name: "vision",
      title: "Vision Statement",
      type: "text",
      group: "missionVision",
      description: "The organization's vision statement.",
      validation: (rule) => rule.required().max(1000),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "missionVision",
      description:
        "Key facts or stats displayed as a banner (e.g., \"Founded 2023\", \"100% Volunteer-Run\"). 2–4 items work best.",
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "highlight",
          title: "Highlight",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'The prominent text, e.g., "2023" or "100%"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'Descriptive label, e.g., "Year Founded" or "Volunteer-Run"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "contentImage",
      group: "content",
      description:
        "Full-width image displayed between the mission/vision section and the body content. A wide landscape image works best.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      group: "content",
      description:
        "Main body content — tell the story of the organization, its founding, values, and work.",
      of: [
        createRichTextBlocks({ includeBlockquote: true }),
        createInlineImage(),
        createInlineFile(),
      ],
    }),
    defineField({
      name: "calloutImage",
      title: "Callout Image",
      type: "contentImage",
      group: "content",
      description:
        "A wide image displayed as a visual break between the body content and the board section.",
    }),
    defineField({
      name: "boardMembers",
      title: "Board Members",
      type: "array",
      group: "board",
      description: "Members of the board of directors.",
      of: [
        defineArrayMember({
          type: "object",
          name: "boardMember",
          title: "Board Member",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role / Title",
              type: "string",
              description: 'e.g., "President", "Vice President", "Director"',
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
              description: "A short biography (2-3 sentences).",
              validation: (rule) => rule.max(500),
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
        subtitle: "About the Chimborazo Park Conservancy",
      }
    },
  },
})
