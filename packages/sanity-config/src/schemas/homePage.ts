import { BlockquoteIcon } from "@sanity/icons/Blockquote"
import { CalendarIcon } from "@sanity/icons/Calendar"
import { HeartIcon } from "@sanity/icons/Heart"
import { HomeIcon } from "@sanity/icons/Home"
import { ImageIcon } from "@sanity/icons/Image"
import { RocketIcon } from "@sanity/icons/Rocket"
import { SparklesIcon } from "@sanity/icons/Sparkles"
import { TextIcon } from "@sanity/icons/Text"
import { UsersIcon } from "@sanity/icons/Users"
import { defineField, defineType } from "sanity"
import { createSimpleBlocks, internalPathOrAnchor, requiredImage } from "./shared"

/**
 * Restricted block content for section body text.
 * Paragraphs with bold/italic and links. No headings, images, or files --
 * the homepage layout is fixed by the design, not by the editor.
 */
const simpleBlockContent = createSimpleBlocks()

/**
 * Same as simpleBlockContent but with bullet lists enabled.
 */
const simpleBlockContentWithLists = createSimpleBlocks({ includeLists: true })

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", icon: ImageIcon, default: true },
    { name: "intro", title: "Intro", icon: TextIcon },
    { name: "vision", title: "Our Vision", icon: SparklesIcon },
    { name: "projects", title: "Projects", icon: RocketIcon },
    { name: "park", title: "The Park", icon: HomeIcon },
    { name: "events", title: "Events", icon: CalendarIcon },
    { name: "getInvolved", title: "Get Involved", icon: HeartIcon },
    { name: "partners", title: "Partners", icon: UsersIcon },
    { name: "quote", title: "Quote", icon: BlockquoteIcon },
  ],
  fields: [
    // ─── Hero Section (existing) ───
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required().max(100),
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          validation: (rule) => rule.required().max(300),
        }),
        defineField({
          name: "heroImageV2",
          title: "Hero Image (Direct Upload)",
          type: "contentImage",
          description:
            "The full-width image behind the hero heading. A wide landscape photo works best.",
          validation: (rule) => rule.custom(requiredImage("Hero image is required")),
        }),
        defineField({
          name: "ctaButton",
          title: "Call-to-Action Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              description:
                'Internal path (e.g., "/donate") or anchor (e.g., "#get-involved"). External links are not supported here.',
              validation: (rule) => rule.required().custom(internalPathOrAnchor()),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ─── Intro Section ───
    defineField({
      name: "introSection",
      title: "Intro Content",
      type: "object",
      group: "intro",
      description: "The introductory text displayed below the hero",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "text",
          rows: 3,
          description: "Bold introductory paragraph (displayed larger)",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "array",
          of: [simpleBlockContent],
          description: "Additional paragraphs below the heading",
        }),
      ],
    }),
    defineField({
      name: "homepageGallery",
      title: "Intro Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      group: "intro",
      description: "Image gallery displayed below the intro text",
    }),

    // ─── Vision Section ───
    defineField({
      name: "visionSection",
      title: "Vision Content",
      type: "object",
      group: "vision",
      description: "The four core pillars of the conservancy's mission",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "Our Vision" if left empty',
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "text",
          rows: 3,
          description: "Introductory paragraph below the section title",
        }),
        defineField({
          name: "pillars",
          title: "Vision Pillars",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Pillar Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "pillar",
                  title: "Pillar Type",
                  type: "string",
                  options: {
                    list: [
                      { title: "Restoration", value: "restoration" },
                      { title: "Recreation", value: "recreation" },
                      { title: "Connection", value: "connection" },
                      { title: "Preservation", value: "preservation" },
                    ],
                  },
                  validation: (rule) => rule.required(),
                  description: "Determines the icon and color scheme",
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "array",
                  of: [simpleBlockContentWithLists],
                  description: "Pillar description. Use bullet lists for multiple points.",
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "pillar" },
              },
            },
          ],
          validation: (rule) => rule.max(4),
        }),
      ],
    }),

    // ─── Projects Section ───
    defineField({
      name: "projectsSectionHeader",
      title: "Projects Header",
      type: "object",
      group: "projects",
      description: "Title and description for the featured projects section",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "Projects" if left empty',
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),

    // ─── The Park Section ───
    defineField({
      name: "parkSection",
      title: "Park Content",
      type: "object",
      group: "park",
      description: "Narrative content about the park's history and mission",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "The Park" if left empty',
        }),
        defineField({
          name: "intro",
          title: "Introduction",
          type: "text",
          rows: 4,
          description: "Bold opening paragraph about the park's history",
        }),
        defineField({
          name: "body",
          title: "History Content",
          type: "array",
          of: [simpleBlockContent],
          description: "Narrative paragraphs displayed alongside the rotating gallery",
        }),
        defineField({
          name: "today",
          title: "Current State",
          type: "text",
          rows: 3,
          description: "Paragraph about the park today (displayed below the gallery grid)",
        }),
        defineField({
          name: "callout",
          title: "Callout Content",
          type: "array",
          of: [simpleBlockContent],
          description:
            "Highlighted content in the callout box. Use bold for emphasis (e.g. bold 'We're changing that.').",
        }),
      ],
    }),
    defineField({
      name: "parkGallery",
      title: "Park Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      group: "park",
      description: "Rotating image gallery displayed alongside the history content",
    }),

    // ─── Events Section ───
    defineField({
      name: "eventsSectionHeader",
      title: "Events Header",
      type: "object",
      group: "events",
      description: "Title and description for the events section",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "Events" if left empty',
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),

    // ─── Get Involved Section ───
    defineField({
      name: "getInvolvedSection",
      title: "Get Involved Content",
      type: "object",
      group: "getInvolved",
      description: "Title and description for the get involved section",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "Get Involved" if left empty',
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),

    // ─── Partners Section ───
    defineField({
      name: "partnersSectionHeader",
      title: "Partners Header",
      type: "object",
      group: "partners",
      description: "Title and description for the partners section",
      fields: [
        defineField({
          name: "title",
          title: "Section Title",
          type: "string",
          description: 'Defaults to "Partners" if left empty',
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: "featuredPartners",
      title: "Featured Partners",
      type: "array",
      of: [{ type: "reference", to: [{ type: "partner" }] }],
      group: "partners",
      description:
        "Select partner organizations to display on the homepage. They appear in the order set by each Partner's own Display Order field.",
      validation: (rule) => rule.unique(),
    }),

    // ─── Quote Section (existing) ───
    defineField({
      name: "featuredQuote",
      title: "Featured Quote",
      type: "reference",
      to: [{ type: "quote" }],
      group: "quote",
      description:
        "Select a quote to display on the homepage. Takes precedence over the fallback in Site Settings.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Homepage",
        subtitle: "Site homepage content",
      }
    },
  },
})
