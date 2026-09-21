import React from "react"
import { defineArrayMember, defineField } from "sanity"
import { altRequiredWithImage } from "./validation"

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
    type: "object" as const,
    title,
    fields: [
      defineField({
        title: "URL",
        name: "href",
        type: "url",
        description:
          "A full URL (https://...), an internal path (/events), an email (mailto:...), or a phone number (tel:...).",
        // Warning, not error: production contains a few orphaned link markDefs
        // with no href that are not reachable from the editor, so a hard rule
        // would make those documents permanently unpublishable.
        validation: (rule) =>
          rule
            .uri({
              allowRelative: true,
              scheme: ["http", "https", "mailto", "tel"],
            })
            .required()
            .warning("This link has no destination and will render as plain text"),
      }),
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
        React.createElement("p", { style: { fontSize: "1rem", lineHeight: "1.6" } }, children),
    },
    {
      title: "Leading Large",
      value: "leading-lg",
      component: ({ children }: { children?: React.ReactNode }) =>
        React.createElement("p", { style: { fontSize: "1.25rem", lineHeight: "1.6" } }, children),
    },
    { title: "H2", value: "h2" },
    { title: "H3", value: "h3" },
  ]

  if (includeBlockquote) {
    styles.push({ title: "Quote", value: "blockquote" })
  }

  return defineArrayMember({
    type: "block",
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
  })
}

// ---------------------------------------------------------------------------
// Simple block configuration (section prose)
// ---------------------------------------------------------------------------

export interface CreateSimpleBlocksOptions {
  /** Enable bullet lists. Defaults to false. */
  includeLists?: boolean
  /** Enable the link annotation. Defaults to true. */
  includeLinks?: boolean
  /** Title used for the link annotation. Defaults to "Link". */
  linkAnnotationTitle?: string
}

/**
 * Returns a restricted Portable Text `block` configuration for section prose:
 * paragraphs with bold/italic and (by default) links. No headings, images, or
 * file attachments -- those belong in full `body` fields.
 *
 * Used by the homepage sections, which are laid out by the design rather than
 * by the editor.
 */
export function createSimpleBlocks(options: CreateSimpleBlocksOptions = {}) {
  const { includeLists = false, includeLinks = true, linkAnnotationTitle = "Link" } = options

  return defineArrayMember({
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: includeLists ? [{ title: "Bullet", value: "bullet" }] : [],
    marks: {
      decorators: [
        { title: "Bold", value: "strong" },
        { title: "Italic", value: "em" },
      ],
      annotations: includeLinks ? [createLinkAnnotation({ title: linkAnnotationTitle })] : [],
    },
  })
}

// ---------------------------------------------------------------------------
// Inline image type (used inside body/content arrays)
// ---------------------------------------------------------------------------

/**
 * Returns an inline image type with hotspot support, required alt text,
 * and an optional caption.
 */
export function createInlineImage() {
  return defineArrayMember({
    type: "image",
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "alt",
        type: "string",
        title: "Alternative text",
        description:
          'Describe what the image shows, for screen readers. Don\'t start with "Image of".',
        validation: (rule) => rule.custom(altRequiredWithImage()),
      }),
      defineField({
        name: "caption",
        type: "string",
        title: "Caption",
        description: "Optional. Visible text printed below the image.",
      }),
    ],
  })
}

// ---------------------------------------------------------------------------
// Inline file attachment type
// ---------------------------------------------------------------------------

/**
 * Returns an inline file attachment type that accepts common document formats.
 */
export function createInlineFile() {
  return defineArrayMember({
    type: "file",
    name: "fileAttachment",
    title: "File Attachment",
    options: {
      accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.csv,.txt",
    },
    fields: [
      defineField({
        name: "title",
        type: "string",
        title: "File Title",
        description: "Optional custom label for the file. Defaults to the uploaded filename.",
      }),
      defineField({
        name: "description",
        type: "text",
        title: "Description",
        description: "Optional description of the file content",
      }),
    ],
  })
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
 * update, aboutPage, and historyPage schemas.
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

  type BodyMember =
    | ReturnType<typeof createRichTextBlocks>
    | ReturnType<typeof createInlineImage>
    | ReturnType<typeof createInlineFile>

  const of: BodyMember[] = [createRichTextBlocks({ includeBlockquote })]

  if (includeImages) {
    of.push(createInlineImage())
  }
  if (includeFiles) {
    of.push(createInlineFile())
  }

  return defineField({
    name,
    title,
    type: "array",
    of,
    ...(description ? { description } : {}),
    ...(group ? { group } : {}),
    validation: required ? (rule) => rule.required() : undefined,
  })
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

  return defineField({
    name,
    title,
    type: "array",
    description,
    of: [createRichTextBlocks({ includeBlockquote: false, linkAnnotationTitle: "Link" })],
  })
}
