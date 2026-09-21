import { CogIcon } from "@sanity/icons/Cog"
import { defineField, defineType } from "sanity"
import { altRequiredWithImage, notBeforeSibling } from "./shared"

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "organization", title: "Organization", default: true },
    { name: "park", title: "Park Info" },
    { name: "alert", title: "Homepage Alert" },
    { name: "links", title: "Links & Social" },
    { name: "seo", title: "SEO Defaults" },
    { name: "content", title: "Featured Content" },
  ],
  fields: [
    // ─── Organization ───
    defineField({
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      group: "organization",
      description: 'Primary name of the organization (e.g., "Chimborazo Park Conservancy")',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alternativeName",
      title: "Alternative Name",
      type: "string",
      group: "organization",
      description:
        'Alternative name (e.g., "Friends of Chimborazo Park"). Published in the site\'s structured data so search engines know both names refer to the same organization.',
    }),
    defineField({
      name: "description",
      title: "Organization Description",
      type: "text",
      group: "organization",
      description:
        "Brief description used in the footer and as the default meta description. Aim for 150–160 characters so search results don't truncate it.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "organization",
      description: "Shown in the site footer. Visitors use this to reach the Conservancy.",
      // Warning rather than error: this is currently unset in production, and
      // a hard rule would make Site Settings unpublishable until it is filled.
      validation: (rule) =>
        rule.email().required().warning("The footer has no contact address without this"),
    }),

    // ─── Park Info ───
    defineField({
      name: "parkAddress",
      title: "Park Address",
      type: "object",
      group: "park",
      description:
        "Shown in the footer and published as structured data so the park appears correctly on maps and in search results.",
      fields: [
        defineField({
          name: "street",
          title: "Street Address",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "state",
          title: "State",
          type: "string",
          description: "Two-letter abbreviation, e.g. VA",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "zipCode",
          title: "ZIP Code",
          type: "string",
          description: "Five digits, or ZIP+4",
          validation: (rule) =>
            rule
              .required()
              .regex(/^\d{5}(-\d{4})?$/, { name: "ZIP code" })
              .error("Enter a 5-digit ZIP code, optionally followed by -1234"),
        }),
      ],
    }),
    defineField({
      name: "parkHours",
      title: "Park Hours",
      type: "string",
      group: "park",
      description: 'Shown in the footer and on the Amenities page. e.g., "Dawn to Dusk"',
      validation: (rule) => rule.required(),
    }),

    // ─── Homepage Alert ───
    defineField({
      name: "siteAlert",
      title: "Homepage Alert",
      type: "object",
      group: "alert",
      description:
        "A time-sensitive notice shown above the homepage introduction. Disable it when the notice is no longer needed.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "enabled",
          title: "Show Alert",
          type: "boolean",
          description:
            "The alert only appears when this is on AND the current time is inside the window below.",
          initialValue: false,
        }),
        defineField({
          name: "label",
          title: "Short Label",
          type: "string",
          description: 'A brief heading such as "Park access notice".',
          initialValue: "Park access notice",
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: "message",
          title: "Message",
          type: "array",
          of: [
            {
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
              marks: {
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                  { title: "Underline", value: "underline" },
                ],
                annotations: [],
              },
            },
          ],
          description:
            "Keep the notice concise so it remains easy to scan on mobile. Bold, italic, and underline formatting are available.",
          validation: (rule) =>
            rule.custom((value, context) => {
              const enabled = (context.parent as { enabled?: boolean } | undefined)?.enabled
              if (!enabled) return true
              const blocks = Array.isArray(value) ? value : []
              return blocks.length > 0 ? true : "Add a message before turning the alert on"
            }),
        }),
        defineField({
          name: "startsAt",
          title: "Start Showing",
          type: "datetime",
          description: "Optional. Leave blank to show the alert immediately when enabled.",
        }),
        defineField({
          name: "expiresAt",
          title: "Stop Showing",
          type: "datetime",
          description:
            "Optional. The alert stops appearing at this date and time. Leave blank to show it until you turn it off.",
          validation: (rule) =>
            rule.custom(
              notBeforeSibling("startsAt", '"Stop Showing" must be after "Start Showing"'),
            ),
        }),
      ],
    }),

    // ─── Links & Social ───
    defineField({
      name: "donationUrl",
      title: "Donation Form URL",
      type: "url",
      group: "links",
      description:
        "URL to the Zeffy donation form. Every Donate button on the site points here, so double-check it before publishing.",
      validation: (rule) =>
        rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      group: "links",
      description: "Leave a field blank to hide that icon from the footer.",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["http", "https"],
            }),
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
          validation: (rule) =>
            rule.uri({
              scheme: ["http", "https"],
            }),
        }),
      ],
    }),

    // ─── SEO Defaults ───
    defineField({
      name: "metaDefaults",
      title: "Meta Tag Defaults",
      type: "object",
      group: "seo",
      description:
        "Fallbacks used by pages that don't set their own. Individual events, projects, and updates override these with their own title and hero image.",
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: "siteTitle",
          title: "Default Site Title",
          type: "string",
          description:
            "Shown in the browser tab and as the headline in search results. Falls back to the Organization Name if left empty.",
          validation: (rule) => rule.max(60).warning("Titles over 60 characters get truncated"),
        }),
        defineField({
          name: "ogImage",
          title: "Default Social Share Image",
          type: "image",
          description:
            "Used when a page has no image of its own — for example when someone shares the homepage on Facebook. 1200×630 works best.",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.custom(altRequiredWithImage()),
            }),
          ],
        }),
      ],
    }),

    // ─── Featured Content ───
    defineField({
      name: "getInvolvedGallery",
      title: "Get Involved Gallery",
      type: "reference",
      to: [{ type: "gallery" }],
      group: "content",
      description: "Gallery to display in the 'Get Involved' section",
    }),
    defineField({
      name: "featuredQuote",
      title: "Fallback Featured Quote",
      type: "reference",
      to: [{ type: "quote" }],
      group: "content",
      description:
        "Used on the homepage only when Homepage → Quote is empty. Set the quote there to control it directly.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global site configuration",
      }
    },
  },
})
