/**
 * Cache Components requires `generateStaticParams` to return at least one param
 * for a dynamic route, so it can validate at build time that the route doesn't
 * reach for `cookies()`, `headers()`, or `searchParams` at runtime. An empty
 * array is a build error:
 * https://nextjs.org/docs/messages/empty-generate-static-params
 *
 * A content type with nothing published yet returns an empty array legitimately
 * — `/updates/[slug]` does today. This substitutes the placeholder Next
 * documents for that case. The slug resolves to no document, so the page hits
 * its existing `notFound()` and the path 404s, which is the correct response
 * for a section with no content. Once real documents exist they are returned
 * instead and the placeholder disappears.
 */
const PLACEHOLDER_SLUG = "__placeholder__"

/**
 * Also drops null slugs. The slug queries filter on `defined(slug.current)`, so
 * this shouldn't happen, but TypeGen still types the field as nullable and a
 * null would otherwise become a broken prerendered path.
 */
export function withPlaceholderSlug(params: Array<{ slug: string | null }>): Array<{
  slug: string
}> {
  const defined = params.filter((param): param is { slug: string } => param.slug !== null)
  return defined.length > 0 ? defined : [{ slug: PLACEHOLDER_SLUG }]
}
