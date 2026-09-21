import type { CustomValidator } from "sanity"

/**
 * Shared validation helpers.
 *
 * These exist so that the same rule is spelled the same way everywhere --
 * previously each schema hand-rolled its own asset-ref check and there was no
 * cross-field date validation at all.
 */

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/** True when an image-like value has an uploaded asset attached. */
export function hasAssetRef(value: unknown): boolean {
  return Boolean((value as { asset?: { _ref?: string } } | undefined)?.asset?._ref)
}

/**
 * Validator for `contentImage` (and other image object) fields that must have
 * an asset. A plain `rule.required()` only checks that the object exists, which
 * an empty image field satisfies -- hence the custom check.
 *
 * ```ts
 * validation: (rule) => rule.custom(requiredImage("Hero image is required"))
 * ```
 */
export function requiredImage(message = "Image is required"): CustomValidator<unknown> {
  return (value) => (hasAssetRef(value) ? true : message)
}

/**
 * Same as {@link requiredImage} but for arrays of images -- requires at least
 * one entry with an uploaded asset.
 */
export function requiredImageList(
  message = "At least one image is required",
): CustomValidator<unknown> {
  return (value) => {
    if (!Array.isArray(value)) return message
    return value.some(hasAssetRef) ? true : message
  }
}

/**
 * Validator for the `alt` field *inside* an image object: required once an
 * asset has been uploaded, ignored while the image slot is empty.
 *
 * A plain `rule.required()` on `alt` reports "Alternative text is required" on
 * every optional image field that nobody has filled in -- an error about a
 * picture that does not exist, which the editor cannot clear except by
 * uploading one.
 *
 * ```ts
 * defineField({
 *   name: "alt",
 *   type: "string",
 *   validation: (rule) => rule.custom(altRequiredWithImage()),
 * })
 * ```
 */
export function altRequiredWithImage(
  message = "Add alt text describing this image",
): CustomValidator<string | undefined> {
  return (value, context) => {
    if (!hasAssetRef(context.parent)) return true
    return value?.trim() ? true : message
  }
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

function toTime(value: unknown): number | null {
  if (typeof value !== "string" || value === "") return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

/**
 * Validator for a date/datetime field that must not fall before a sibling
 * date/datetime field. Passes when either value is empty, so it composes with
 * optional fields.
 *
 * For a top-level document field the "sibling" is another top-level field; for
 * a field inside an object it is another field of that same object.
 *
 * ```ts
 * validation: (rule) =>
 *   rule.custom(notBeforeSibling("startDate", "Completion date must be on or after the start date"))
 * ```
 */
export function notBeforeSibling(
  siblingName: string,
  message: string,
): CustomValidator<string | undefined> {
  return (value, context) => {
    const self = toTime(value)
    const sibling = toTime((context.parent as Record<string, unknown> | undefined)?.[siblingName])
    if (self === null || sibling === null) return true
    return self >= sibling ? true : message
  }
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

/**
 * Validator for the `link` field on the homepage CTA button: an internal path
 * or an on-page anchor. External URLs belong in a `url` field.
 */
export function internalPathOrAnchor(
  message = 'Use an internal path (e.g. "/donate") or an anchor (e.g. "#get-involved")',
): CustomValidator<string | undefined> {
  return (value) => {
    if (!value) return true
    return /^[/#][^\s]*$/.test(value) ? true : message
  }
}
