# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chimborazo Park Conservancy website — a monorepo for a 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood.

### Monorepo Structure

**Turborepo** monorepo managed with **pnpm**:

- `apps/next-web/` — Main public-facing website (@chimborazo/next-web) — Next.js App Router
- `apps/studio/` — Sanity Studio CMS (@chimborazo/studio)
- `packages/sanity-config/` — Shared Sanity schemas, queries, and client (@chimborazo/sanity-config)

### Package Manager

- **pnpm** is required (enforced via preinstall hook)
- Use `pnpm` for all package management, NOT `npm` or `yarn`
- Workspace dependencies use `workspace:*` protocol

## Commands

### Root (Turborepo)

- `pnpm dev` — Start all dev servers (next-web :3001, studio :3333)
- `pnpm build` — Build all projects
- `pnpm lint` / `pnpm format` / `pnpm test` / `pnpm type-check` — Run across all workspaces
- `pnpm clean` — Clean build artifacts and node_modules

### Per-workspace

```bash
pnpm --filter @chimborazo/next-web dev
pnpm --filter @chimborazo/studio build
```

### Adding Dependencies

```bash
pnpm add <package> --filter @chimborazo/next-web
pnpm add -D <package> --filter @chimborazo/next-web
pnpm add @chimborazo/sanity-config --filter @chimborazo/next-web --workspace
```

## Shared Sanity Config (packages/sanity-config)

Shared Sanity schemas, GROQ queries, and client config used by next-web and studio. See `packages/sanity-config/CLAUDE.md` for conventions.

## Key Patterns

### Styling

- Tailwind CSS v4 with semantic color names (e.g., `text-green-800`, `bg-grey-50`)
- Dark mode via `dark:` prefix
- Custom fonts via `font-display` and `font-body` utilities

### Images

- Sanity CMS for managed media assets (preferred)
- Static images in `apps/next-web/public/`
- WebP format preferred for photos

## Deployment

- **next-web**: Netlify — `pnpm run build --filter=@chimborazo/next-web`
- **studio**: Sanity hosting — `pnpm --filter @chimborazo/studio deploy`

## TypeScript

- Shared base config in `tsconfig.base.json` (strict mode, ESM, bundler resolution)
- Path aliases configured per workspace (`@/*` → `./src/*`)

## Turborepo Pipeline

See `turbo.json`:

- `build` — depends on upstream builds (`^build`)
- `dev` — no caching, persistent
- `lint`, `type-check`, `test` — depend on upstream builds
- `clean` — no caching
