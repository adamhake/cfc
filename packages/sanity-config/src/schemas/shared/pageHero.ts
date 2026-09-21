import { defineField } from "sanity"

/**
 * The page hero block shared by every singleton page document.
 *
 * All eleven page schemas previously repeated this object verbatim, so any
 * improvement (a description, a validation rule) had to be made eleven times.
 */

export interface CreatePageHeroFieldOptions {
  /** Group to assign the field to. Omit for schemas without groups. */
  group?: string
  /** Overrides the default description on the hero image. */
  imageDescription?: string
}

export function createPageHeroField(options: CreatePageHeroFieldOptions = {}) {
  const {
    group,
    imageDescription = "The wide image behind the page title. A landscape photo at least 1600px wide works best.",
  } = options

  return defineField({
    name: "pageHero",
    title: "Page Hero",
    type: "object",
    description: "The title, intro text, and image at the top of the page.",
    ...(group ? { group } : {}),
    fields: [
      defineField({
        name: "title",
        title: "Title",
        type: "string",
        description: "The page heading, also used as the browser tab title.",
        validation: (rule) => rule.required().max(80),
      }),
      defineField({
        name: "description",
        title: "Description",
        type: "text",
        description:
          "A short intro shown under the title, and used as the page's search-result summary.",
        validation: (rule) => rule.max(500),
      }),
      defineField({
        name: "imageV2",
        title: "Hero Image",
        type: "contentImage",
        description: imageDescription,
      }),
    ],
    validation: (rule) => rule.required(),
  })
}
