# Next Web App (@chimborazo/next-web)

## Next.js

App Router with Cache Components (`cacheComponents: true`).

## Caching

**Read [CACHING.md](./CACHING.md) before touching data fetching or adding a
Sanity document type.** In short:

- All Sanity access goes through `cachedSanityFetch` (`src/lib/sanity-fetch.ts`),
  the app's single `use cache` boundary. Don't add your own `use cache` around it.
- `defineLive` runs with `strict: true`, so `perspective` and `stega` are
  required at every call site. Get them from `getDynamicFetchOptions()`, called
  outside the cache boundary.
- Cache lifetime is a year; freshness comes from `revalidateTag` in the Sanity
  webhook. A new document type without a case in `getCacheTagsForDocumentType`
  will never invalidate its pages — a test enforces this.
- `export const revalidate` and `export const runtime` are incompatible with
  `cacheComponents` and will fail the build.

## Visual Editing (stega)

In draft mode every Sanity string carries invisible stega characters — that's
what makes click-to-edit work. It's harmless when the value is only rendered,
and a bug the moment the value becomes **logic**:

```ts
pillarStyles[pillar]              // undefined → TypeError
amenity.section === "upper-park"  // always false → content vanishes
```

Wrap the value in `cleanEnum()` (`src/lib/stega.ts`) at every point where a
Sanity enum becomes an object key, an equality check, or a switch. Prefer
cleaning *inside* the shared component (as `Chip` does) so call sites can't
forget. Never clean text being rendered, or values passed to `<PortableText />`
or the image helpers — that strips the markers they depend on.

Page metadata must also be stega-free; `resolveSiteMetadata()` in `utils/seo.ts`
handles the root layout.

These bugs are invisible in production and only appear inside Presentation, so
they don't surface in normal review — `src/lib/stega.test.ts` encodes with the
real encoder to keep the guarantee honest.

TypeScript enforces most of this for you. A stega-enabled fetch returns strings
branded as `StegaString`, which *is* assignable to `string` but deliberately is
**not** assignable to a string-literal union — so passing an uncleaned enum
where `"active" | "planned" | …` is expected is a compile error. Type a prop
that receives fetched data as `MaybeStega<T>` (`src/lib/sanity-types.ts`) and
clean the enum inside the component.

### Click-to-edit overlays

Stega markers ride inside strings only, so overlays come for free on rendered
text and nowhere else — images, dates, references and array order have none.
Add `data-sanity={sanityAttr(doc, "fieldName")}`
(`src/lib/sanity-data-attribute.ts`) to make those editable. Array items take a
`_key` predicate, not an index, so the target survives reordering and an editor
can drag items in the preview:

```tsx
data-sanity={sanityAttr(doc, `visionSection.pillars[_key=="${item._key}"]`)}
```

The document's query must select `_type` as well as `_id`, or `sanityAttr`
returns `undefined` and the element is silently not selectable.

## Query result types

`cachedSanityFetch` infers its return type from the query via TypeGen's
`SanityQueries` map, so **never** write `(await cachedSanityFetch(…)) as { data: T }`
— the cast decouples the result from the GROQ projection and a query change
stops producing a type error. Queries must be built with `defineQuery` for this
to work; a bare template string falls back to `unknown`.

## Environment Variables

- Managed via T3 Env (`@t3-oss/env-nextjs`) in `src/env.ts`
- Client variables must be prefixed with `NEXT_PUBLIC_`

## Deployment

Netlify — build command: `pnpm run build --filter=@chimborazo/next-web`

## Next.js Docs

What you remember about Next.js is likely wrong for this project. Always search
and read `./.next-docs` before any Next.js task. If the directory is missing:
`npx @next/codemod agents-md --output CLAUDE.md`
