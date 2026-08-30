# Caching

Content is cached effectively forever and invalidated by tag when it changes.
Nothing important expires on a timer.

## The layers

| Layer            | What it holds                          | How it clears                             |
| ---------------- | -------------------------------------- | ----------------------------------------- |
| Sanity CDN       | GROQ query responses                   | Sanity, on publish                        |
| Next cache       | Rendered routes + `use cache` entries  | `revalidateTag` from the Sanity webhook   |
| Netlify edge     | HTTP responses                         | Follows Next's cache headers              |

## How a page gets its data

`cacheComponents: true` is on, so every route is prerendered into a static
shell. Anything that can't be prerendered must either be cached or sit behind a
`<Suspense>` boundary.

All Sanity access goes through **one** `use cache` boundary,
`cachedSanityFetch` in `src/lib/sanity-live.ts`:

```ts
export const cachedSanityFetch: StrictDefinedFetchType = async (options) => {
  "use cache"
  return sanityFetch(options)
}
```

`sanityFetch` registers `cacheTag`/`cacheLife` internally but deliberately does
not open the boundary — this wrapper provides it once. **Do not add your own
`use cache` around it.**

Everything the query depends on arrives as an argument, so it becomes part of
the cache key. That includes `perspective` and `stega`, which is what keeps
draft content from ever landing in a cache entry that a published visitor could
read.

`defineLive` runs with `strict: true`, so `perspective` and `stega` are required
at every call site rather than being inferred from cookies. Use
`getDynamicFetchOptions()` to resolve them — it reads `draftMode()` and
`cookies()`, so it must be called **outside** the cache boundary and its result
passed in.

## Cache lifetime

`next.config.ts` sets the `default` profile to the one next-sanity ships:
`revalidate: 31_536_000` (one year). Freshness comes from tag invalidation, not
expiry.

Two deliberate exceptions, both because they depend on the current time — which
can't be read while prerendering without freezing a build timestamp into the
shell:

- **`FooterCopyright`** (`components/Footer/footer.tsx`) caches the copyright
  year with a one-day revalidate. Because the footer is in the root layout, this
  sets every route's revalidate window to one day. That re-render reuses the
  year-long `cachedSanityFetch` entries, so it costs no Sanity queries.
- **Event past/upcoming badges** (`EventStatusChip`) render on the client. They
  are absent from the initial HTML and appear on hydration. This is a decorative
  badge, and client rendering makes it correct for the viewer rather than as of
  the last build.

## Invalidation

`src/app/api/webhooks/sanity/route.ts` receives Sanity publish events and calls
`revalidateTag` for the tags that document type affects.

**Every document type needs an explicit case in
`getCacheTagsForDocumentType`.** Falling through to the default only revalidates
the homepage, leaving that type's own pages stale until — with a one-year cache
— effectively never. `surveyResultsPage` and `updateCategory` were both missing
this way.

The coverage guard in `route.test.ts` enumerates document types from
`@chimborazo/sanity-config/schemas` and fails if any lacks a case. Adding a
document type means:

1. A `CACHE_TAGS` entry in `src/lib/cache-tags.ts` if it needs its own tag
2. A `case` in `getCacheTagsForDocumentType`
3. A row in the `it.each` table in `route.test.ts`

`cache-tags.ts` intentionally has no imports, so tests import the real constants
instead of a hand-copied mock. A drifting copy is how the missing
`SURVEY_RESULTS` tag stayed invisible.

## Gotchas

- **`export const revalidate` / `export const runtime` are incompatible with
  `cacheComponents`.** The build rejects them.
- **`generateStaticParams` must return at least one param.** An empty array is
  a build error. `withPlaceholderSlug` in `src/lib/static-params.ts` covers
  content types with nothing published yet — the placeholder slug resolves to no
  document and hits the page's existing `notFound()`.
- **`new Date()`, `cookies()`, `headers()`, `searchParams`** can't be reached
  during prerendering outside a cache boundary or `<Suspense>`. The build error
  names the file and line.

## Verifying a change

Cache behavior doesn't show up in unit tests. On a deploy preview:

1. Publish an edit to a `project`, an `update`, an `updateCategory`, and the
   `surveyResultsPage`; confirm each public page updates within seconds.
2. Open Studio's Presentation tool: overlays render, inline edits appear.
3. With draft mode on, unpublished edits are visible; in a clean incognito
   window they are not.
4. Reload a page repeatedly and confirm Sanity's request log doesn't show a
   query per request — that's what proves the host's cache handler is actually
   backing `use cache`.
