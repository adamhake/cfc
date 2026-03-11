# Shared Sanity Config (@chimborazo/sanity-config)

## Commands

- `pnpm build` — Compile TypeScript (`tsc`)
- `pnpm type-check` — Check types without emitting
- `pnpm lint` / `pnpm format`

## Package Exports

```typescript
import { ... } from "@chimborazo/sanity-config";           // Main index
import { ... } from "@chimborazo/sanity-config/schemas";   // Schema definitions
import { ... } from "@chimborazo/sanity-config/queries";   // GROQ queries
import { ... } from "@chimborazo/sanity-config/client";    // Sanity client factory
import { ... } from "@chimborazo/sanity-config/components"; // Shared components
```

## Structure

- `src/schemas/` — Sanity document and object type definitions
- `src/schemas/shared/` — Reusable schema helpers (`richText.ts` with `createBodyField`, `createInlineImage`, `createInlineFile`, etc.)
- `src/queries/` — GROQ query strings
- `src/client.ts` — `createSanityClient()` factory
- `src/components/` — Shared components used by both studio and web

## Query Conventions

### Shared Projections

Reusable GROQ projection fragments in `src/queries/`:

- **`imageFieldProjection`** (`imageProjections.ts`) — Dereferences image assets with metadata (dimensions, lqip, blurhash, palette), alt, hotspot, crop
- **`richTextProjection`** (`richTextProjection.ts`) — Dereferences both image and fileAttachment assets in Portable Text arrays. Use for all `body[]`, `content[]`, `recap[]` fields:
  ```
  body[]{
    ${richTextProjection}
  }
  ```

### Slug Safety

All list queries that return slugged documents must include `defined(slug.current)` in the filter. This prevents incomplete documents from reaching the frontend. Enforced by tests in `apps/next-web`.

### By-slug Queries

Detail queries filter by `slug.current == $slug` which implicitly requires a slug, so they don't need the `defined()` guard.

## Schema Conventions

### Rich Text Fields

Use helpers from `src/schemas/shared/richText.ts`:

- `createBodyField()` — Full rich text with blockquote, images, and file attachments
- `createIntroductionField()` — Simplified rich text (no images/files)
- `createRichTextBlocks()` — Block config with styles, lists, decorators
- `createInlineImage()` — Image with hotspot, alt (required), caption
- `createInlineFile()` — File attachment accepting PDF, Office docs, etc.
