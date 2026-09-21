import { type StegaCleaned, stegaClean } from "@sanity/client/stega"

/**
 * Strips Content Source Map (stega) characters from a Sanity string value.
 *
 * When Visual Editing is on, Sanity encodes the document id and field path into
 * every string as invisible Unicode. That is what makes click-to-edit work, and
 * it is harmless when the value is only rendered. It is *not* harmless when the
 * value is used as program logic:
 *
 * - `styles[pillar]` misses and returns `undefined` (a crash, not a typo)
 * - `section === "upper-park"` is always false (content silently disappears)
 * - the value is passed to a third party that validates its input
 *
 * Use this at every point where a Sanity enum becomes an object key, an
 * equality check, or a switch. Do **not** use it on text being rendered, or on
 * values passed to `<PortableText />` or the image helpers -- that would strip
 * the very markers those rely on.
 *
 * Returns `undefined` for empty values so callers can `??` a fallback.
 *
 * The return type is `StegaCleaned<T>`, which strips the `StegaString` brand.
 * That is what lets a cleaned value be passed where a string-literal union is
 * expected -- `StegaString<"blue">` is deliberately not assignable to `"blue"`,
 * which is how TypeScript catches this bug class for us.
 */
export function cleanEnum<T extends string>(
  value: T | null | undefined,
): StegaCleaned<T> | undefined {
  if (value == null) return undefined
  const cleaned = stegaClean(value)
  return (cleaned || undefined) as StegaCleaned<T> | undefined
}
