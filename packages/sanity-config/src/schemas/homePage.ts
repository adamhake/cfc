import { defineField, defineType } from "sanity"

/**
 * Restricted block content for section body text.
 * Paragraphs only with bold/italic. No headings, images, or links.
 */
const simpleBlockContent = {
  type: "block" as const,
  styles: [{ title: "Normal", value: "normal" as const }],
  lists: [],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" as const },
      { title: "Italic", value: "em" as const },
    ],
    annotations: [],
  },
}

/**
 * Same as simpleBlockContent but with bullet lists enabled.
 */
const simpleBlockContentWithLists = {
  type: "block" as const,
  styles: [{ title: "Normal", value: "normal" as const }],
  lists: [{ title: "Bullet", value: "bullet" as const }],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" as const },
      { title: "Italic", value: "em" as const },
    ],
    annotations: [],
  },
}

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro" },
    { name: "vision", title: "Our Vision" },
    { name: "projects", title: "Projects" },
    { name: "park", title: "The Park" },
    { name: "events", title: "Events" },
    { name: "getInvolved", title: "Get Involved" },
    { name: "partners", title: "Partners" },
    { name: "quote", title: "Quote" },
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
          description: "Upload/select an image directly. Preferred for new content.",
          validation: (rule) =>
            rule.custom((value) => {
              const hasAsset = Boolean(
                (value as { asset?: { _ref?: string } } | undefined)?.asset?._ref
              )
              return hasAsset ? true : "Hero image is required"
            }),
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
                'Internal path (e.g., "/donate") or anchor (e.g., "#get-involved")',
              validation: (rule) => rule.required(),
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
          description:
            "Narrative paragraphs displayed alongside the rotating gallery",
        }),
        defineField({
          name: "today",
          title: "Current State",
          type: "text",
          rows: 3,
          description:
            "Paragraph about the park today (displayed below the gallery grid)",
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
      description:
        "Rotating image gallery displayed alongside the history content",
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
      description: "Select partner organizations to display on the homepage",
    }),

    // ─── Quote Section (existing) ───
    defineField({
      name: "featuredQuote",
      title: "Featured Quote",
      type: "reference",
      to: [{ type: "quote" }],
      group: "quote",
      description: "Select a quote to display on the homepage",
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
