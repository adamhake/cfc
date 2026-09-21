# Sanity Studio (@chimborazo/studio)

## Overview

Thin wrapper around Sanity Studio v6. All schemas are imported from `@chimborazo/sanity-config` — do not define schemas here.

## Configuration

- `src/routes.ts` — the single document → URL map. Preview links, Presentation
  `mainDocuments`, and `locations` are all derived from it; don't add a route in
  one place only.
- `src/badges.tsx` — document badges (event timing, project status, featured)

### Singletons

Singletons are enforced in three places, all keyed off `SINGLETON_TYPES` in
`src/routes.ts`: Structure pins them to a fixed document ID, `document.actions`
strips delete/duplicate, and `schema.templates` removes them from the global
"Create new" menu. Adding a singleton means adding it to that array.

## Environment

Every `SANITY_STUDIO_*` variable is inlined into the public browser bundle by
Vite — **never put a secret behind this prefix.** Server-side keys belong in
`apps/next-web/.env`. Variables read at build time must also be listed under
`tasks.build.env` in the root `turbo.json`, or the build cache won't notice
when they change.

## Deployment

Built and hosted on Netlify as an SPA (see `netlify.toml`), which also runs
`sanity schema deploy` on each build. `pnpm deploy` additionally publishes to
Sanity's own hosting.
