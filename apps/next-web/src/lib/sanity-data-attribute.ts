import { createDataAttribute } from "@sanity/visual-editing"
import { env } from "@/env"

/**
 * Builds the `data-sanity` attribute that makes an element click-to-edit in the
 * Presentation tool.
 *
 * Stega markers only ride along inside *strings*, so overlays come for free on
 * rendered text and nowhere else. Images, dates, booleans, references and array
 * order have no text of their own, and without an explicit attribute an editor
 * clicking one in the preview gets nothing — which covers most of what they
 * actually want to change.
 *
 * ```tsx
 * <img data-sanity={sanityAttr(doc, "heroImage")} … />
 * ```
 *
 * Array items use a `_key` predicate rather than an index, so the reference
 * survives reordering:
 *
 * ```tsx
 * <li data-sanity={sanityAttr(doc, `images[_key=="${item._key}"]`)}>
 * ```
 */
export function sanityAttr(
  doc: { _id?: string | null; _type?: string | null } | null | undefined,
  path: string,
): string | undefined {
  if (!doc?._id || !doc._type) return undefined

  return createDataAttribute({
    baseUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
    // Drafts carry a `drafts.` prefix; the Studio expects the published id.
    id: doc._id.replace(/^drafts\./, ""),
    type: doc._type,
    path,
  }).toString()
}

/**
 * Same as {@link sanityAttr} but for a document whose id and type are known
 * separately — singleton pages, where the rendered object is a nested field
 * rather than the document itself.
 */
export function sanityAttrFor(id: string, type: string, path: string): string {
  return createDataAttribute({
    baseUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
    id: id.replace(/^drafts\./, ""),
    type,
    path,
  }).toString()
}
