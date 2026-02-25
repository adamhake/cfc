import React from "react"

/**
 * Shared Portable Text (rich text) block configuration.
 *
 * These helpers eliminate duplication across schema files that define
 * body/content/introduction fields with Portable Text arrays.
 */

// ---------------------------------------------------------------------------
// Link annotation (shared by all rich text variants)
// ---------------------------------------------------------------------------

interface CreateLinkAnnotationOptions {
  /** The display title for the annotation in the Studio toolbar. Defaults to "URL". */
  title?: string
}

export function createLinkAnnotation(options: CreateLinkAnnotationOptions = {}) {
  const { title = "URL" } = options
  return {
    name: "link",
    type: "object",
    title,
    fields: [
      {
        title: "URL",
        name: "href",
        type: "url",
        validation: (Rule: { uri: (opts: object) => unknown }) =>
          Rule.uri({
            allowRelative: true,
            scheme: ["http", "https", "mailto", "tel"],
          }),
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Block type configuration
// ---------------------------------------------------------------------------

export interface CreateRichTextBlocksOptions {
  /** Include the blockquote style. Defaults to false. */
  includeBlockquote?: boolean
  /** Title used for the link annotation. Defaults to "URL". */
  linkAnnotationTitle?: string
}

/**
 * Returns a Portable Text `block` type configuration with the project's
 * standard styles, lists, decorators, and link annotation.
 */
export function createRichTextBlocks(options: CreateRichTextBlocksOptions = {}) {
  const { includeBlockquote = false, linkAnnotationTitle = "URL" } = options

  const styles: Array<{
    title: string
    value: string
    component?: (props: { children?: React.ReactNode }) => React.ReactElement
  }> = [
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
  ]

  if (includeBlockquote) {
    styles.push({ title: "Quote", value: "blockquote" })
  }

  return {
    type: "block" as const,
    styles,
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [createLinkAnnotation({ title: linkAnnotationTitle })],
    },
  }
}

// ---------------------------------------------------------------------------
// Inline image type (used inside body/content arrays)
// ---------------------------------------------------------------------------

/**
 * Returns an inline image type with hotspot support, required alt text,
 * and an optional caption.
 */
export function createInlineImage() {
  return {
    type: "image" as const,
    options: {
      hotspot: true,
    },
    fields: [
      {
        name: "alt",
        type: "string",
        title: "Alternative text",
        validation: (Rule: { required: () => unknown }) => Rule.required(),
      },
      {
        name: "caption",
        type: "string",
        title: "Caption",
      },
    ],
  }
}

// ---------------------------------------------------------------------------
// Inline file attachment type
// ---------------------------------------------------------------------------

/**
 * Returns an inline file attachment type that accepts common document formats.
 */
export function createInlineFile() {
  return {
    type: "file" as const,
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
  }
}

// ---------------------------------------------------------------------------
// Complete body/content field helpers
// ---------------------------------------------------------------------------

export interface CreateBodyFieldOptions {
  /** Field name. Defaults to "body". */
  name?: string
  /** Field title. Defaults to "Body". */
  title?: string
  /** Field description. */
  description?: string
  /** Include blockquote style in block config. Defaults to true. */
  includeBlockquote?: boolean
  /** Include inline images. Defaults to true. */
  includeImages?: boolean
  /** Include file attachments. Defaults to true. */
  includeFiles?: boolean
  /** Group to assign the field to. */
  group?: string
  /** Whether the field is required. Defaults to false. */
  required?: boolean
}

/**
 * Returns a complete Sanity field definition for a rich text body/content field.
 *
 * By default it includes blockquote styles, inline images (with required alt),
 * and file attachments -- matching the "full" variant used by event, project,
 * update, and historyPage schemas.
 *
 * For "introduction" variants (eventsPage, projectsPage, etc.) pass
 * `{ includeBlockquote: false, includeImages: false, includeFiles: false }`.
 */
export function createBodyField(options: CreateBodyFieldOptions = {}) {
  const {
    name = "body",
    title = "Body",
    description,
    includeBlockquote = true,
    includeImages = true,
    includeFiles = true,
    group,
    required = false,
  } = options

  const ofArray: unknown[] = [
    createRichTextBlocks({ includeBlockquote }),
  ]

  if (includeImages) {
    ofArray.push(createInlineImage())
  }
  if (includeFiles) {
    ofArray.push(createInlineFile())
  }

  return {
    name,
    title,
    type: "array" as const,
    of: ofArray,
    ...(description ? { description } : {}),
    ...(group ? { group } : {}),
    ...(required
      ? { validation: (rule: { required: () => unknown }) => rule.required() }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// Introduction field helper (simplified variant for page schemas)
// ---------------------------------------------------------------------------

export interface CreateIntroductionFieldOptions {
  /** Field name. Defaults to "introduction". */
  name?: string
  /** Field title. Defaults to "Introduction". */
  title?: string
  /** Field description. Defaults to "Rich text content for the page introduction". */
  description?: string
}

/**
 * Returns a Sanity field definition for a page introduction rich text field.
 *
 * This is the simplified variant without blockquote, inline images, or files,
 * matching the pattern used by eventsPage, amenitiesPage, projectsPage, and
 * updatesPage schemas.
 */
export function createIntroductionField(options: CreateIntroductionFieldOptions = {}) {
  const {
    name = "introduction",
    title = "Introduction",
    description = "Rich text content for the page introduction",
  } = options

  return {
    name,
    title,
    type: "array" as const,
    description,
    of: [createRichTextBlocks({ includeBlockquote: false, linkAnnotationTitle: "Link" })],
  }
}
