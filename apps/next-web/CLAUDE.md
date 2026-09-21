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

## Environment Variables

- Managed via T3 Env (`@t3-oss/env-nextjs`) in `src/env.ts`
- Client variables must be prefixed with `NEXT_PUBLIC_`

## Component Organization

Feature folders in `src/components/`:

- `[ComponentName]/[component-name].tsx`

## Deployment

Netlify — build command: `pnpm run build --filter=@chimborazo/next-web`

## Next.js Docs

What you remember about Next.js is likely wrong for this project. Always search
and read `./.next-docs` before any Next.js task. If the directory is missing:
`npx @next/codemod agents-md --output CLAUDE.md`
