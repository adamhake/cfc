# Sanity Studio (@chimborazo/studio)

## Commands

- `pnpm dev` — Dev server on port 3333
- `pnpm build` — Build for deployment
- `pnpm deploy` — Deploy to Sanity hosting

## Overview

Thin wrapper around Sanity Studio v4. All schemas are imported from `@chimborazo/sanity-config` — do not define schemas here.

## Configuration

- `sanity.config.ts` — Studio configuration, imports schemas from shared package
- `@sanity/vision` — GROQ query playground for testing queries
- Presentation tool — Visual editing with live preview

## Deployment

Deployed to Sanity hosting via `pnpm deploy`.
