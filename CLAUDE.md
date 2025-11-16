# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Chimborazo Park Conservancy website - a monorepo for a 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood. The project includes a public-facing website and a Sanity Studio CMS for content management.

### Monorepo Structure

This is a **Turborepo** monorepo managed with **pnpm**. The workspace is organized as follows:

- `apps/web/` - Main public-facing website (@chimborazo/web)
- `apps/studio/` - Sanity Studio CMS (@chimborazo/studio)
- `packages/sanity-config/` - Shared Sanity configuration (@chimborazo/sanity-config)

### Package Manager

- **pnpm 10.22.0+** is required (enforced via preinstall hook)
- Use `pnpm` for all package management operations, NOT `npm` or `yarn`
- Workspace dependencies use `workspace:*` protocol
- Install dependencies: `pnpm install`
- Add dependencies: `pnpm add <package> --filter @chimborazo/web` (or other workspace)

## Development Commands

### Root-level Commands (via Turborepo)

Run from the monorepo root to execute tasks across all workspaces:

- `pnpm dev` - Start all dev servers (web on port 3000, studio on port 3333)
- `pnpm build` - Build all projects
- `pnpm lint` - Lint all projects
- `pnpm format` - Format all projects with Prettier
- `pnpm test` - Run tests across all projects
- `pnpm type-check` - TypeScript type checking across all projects
- `pnpm clean` - Clean build artifacts and node_modules

### Web App Commands (apps/web)

Run from `apps/web/` directory or use `pnpm --filter @chimborazo/web <command>`:

- `pnpm dev` - Start development server on port 3000
- `pnpm start` - Alias for dev
- `pnpm build` - Build for production (outputs to `dist/client`)
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Lint code with ESLint
- `pnpm format` - Format code with Prettier
- `pnpm check` - Check code with Biome
- `pnpm type-check` - TypeScript type checking
- `pnpm storybook` - Start Storybook dev server on port 6006
- `pnpm build-storybook` - Build Storybook for deployment

### Studio Commands (apps/studio)

Run from `apps/studio/` directory or use `pnpm --filter @chimborazo/studio <command>`:

- `pnpm dev` - Start Sanity Studio dev server on port 3333
- `pnpm build` - Build Sanity Studio
- `pnpm deploy` - Deploy Studio to Sanity hosting

## Architecture & Tech Stack

### Monorepo & Build System

- **Turborepo**: Task orchestration and caching for the monorepo
- **pnpm Workspaces**: Package management and dependency resolution
- **TypeScript**: Shared base configuration in `tsconfig.base.json`
- All paths below are relative to the monorepo root unless specified

### Web App (apps/web)

#### Core Framework

- **TanStack Start**: Full-stack React framework with SSR support
- **TanStack Router**: File-based routing system with type-safe navigation
- **TanStack Query**: Server state management integrated with router SSR
- **React 19**: Latest React with concurrent features
- **Sanity CMS**: Headless CMS for content management via `@chimborazo/sanity-config`

#### Styling

- **Tailwind CSS v4**: Utility-first styling via `@tailwindcss/vite` plugin
- **Framer Motion**: Animation library for interactive components
- Custom design system using Tailwind utilities (see `apps/web/src/styles.css`)

#### Routing Architecture

Routes are file-based in `apps/web/src/routes/`:

- `__root.tsx` - Root layout with Header/Footer, devtools, and shell component
- `index.tsx` - Homepage
- `events/$slug.tsx` - Dynamic event detail pages
- `media.tsx` - Media gallery page
- `routeTree.gen.ts` - Auto-generated route tree (do not edit manually)

The router integrates TanStack Query for SSR data fetching via `setupRouterSsrQueryIntegration` in `apps/web/src/router.tsx`.

#### State Management & Data Fetching

- **TanStack Query**: Primary data fetching solution, context provided via `apps/web/src/integrations/tanstack-query/root-provider.tsx`
- **Sanity Client**: Content fetching from Sanity CMS using shared config from `@chimborazo/sanity-config`
- Router context includes `QueryClient` (see `MyRouterContext` in `__root.tsx`)
- Query client is created in `getContext()` and passed through router setup

#### Environment Variables

- Managed via T3 Env (`@t3-oss/env-core`) in `apps/web/src/env.ts`
- Client variables must be prefixed with `VITE_`
- Server variables: `SERVER_URL` (optional)
- Client variables: `VITE_APP_TITLE` (optional)
- Use: `import { env } from "@/env"` then access `env.VITE_APP_TITLE`

#### Path Aliases

- `@/*` maps to `apps/web/src/*` (configured in `apps/web/tsconfig.json` and `vite-tsconfig-paths`)
- Always use path aliases for imports: `import { Button } from "@/components/Button/button"`

#### Component Organization

Components are organized in feature folders with co-located stories in `apps/web/src/components/`:

- `[ComponentName]/[component-name].tsx` - Component implementation
- `[ComponentName]/[component-name].stories.ts` - Storybook stories
- Examples: `Button`, `Header`, `Hero`, `Event`, `Vision`, `Quote`

#### Data Management

- **Sanity CMS**: Primary content source for events, media, and other dynamic content
- Shared schemas and queries in `packages/sanity-config/src/`
- Legacy static data files in `apps/web/src/data/` (migrating to Sanity)

#### Development Tools

- **TanStack Devtools**: Unified devtools for Router and Query (configured in `__root.tsx`)
- **Storybook**: Component development with a11y and theme addons
- **ESLint**: Flat config with React Hooks, React Refresh, and TanStack Router plugins
- **Prettier**: Code formatting with Tailwind plugin for class sorting
- **Vitest**: Unit testing framework

### Sanity Studio (apps/studio)

#### Core Framework

- **Sanity Studio v4**: Headless CMS Studio built on React
- **@sanity/vision**: GraphQL query playground for testing queries
- Uses shared schema and configuration from `@chimborazo/sanity-config`

#### Configuration

- Studio config in `apps/studio/sanity.config.ts`
- Schemas imported from `@chimborazo/sanity-config`
- Development server runs on port 3333

### Shared Sanity Config (packages/sanity-config)

A shared package containing Sanity schemas, queries, and client configuration used by both the web app and studio.

#### Contents

- `src/schemas/` - Sanity schema definitions (events, media, etc.)
- `src/queries/` - GROQ queries for fetching content
- `src/client.ts` - Sanity client configuration
- `src/index.ts` - Main exports

#### Usage

Import from the package in other workspaces:

```typescript
import { schemas } from "@chimborazo/sanity-config/schemas";
import { queries } from "@chimborazo/sanity-config/queries";
import { createClient } from "@chimborazo/sanity-config/client";
```

## Key Patterns

### Route Components

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/path")({
  component: ComponentName,
  // Optional: loader for data fetching
  // Optional: head for meta tags
});
```

### Shell/Layout Components

The root route uses `shellComponent` property for the document shell. This is where you add HTML, head tags, and body structure. The `Outlet` is rendered as `children` prop.

### Styling Conventions

- Use Tailwind utilities with semantic color names (e.g., `text-green-800`, `bg-grey-50`)
- Dark mode support via `dark:` prefix (see `__root.tsx` body classes)
- Custom fonts via `font-display` and `font-body` utilities

### Image Handling

- Static images in `apps/web/public/` directory
- Sanity CMS for managed media assets (preferred for new content)
- Use `@unpic/react` for optimized image loading where needed
- WebP format preferred for photos

## Deployment

### Web App (apps/web)

Configured for Netlify deployment:

- Build command: `pnpm build --filter @chimborazo/web` or `cd apps/web && pnpm build`
- Publish directory: `apps/web/dist/client`
- Dev server: port 3000 (see `apps/web/netlify.toml` if present)

### Sanity Studio (apps/studio)

Can be deployed to Sanity hosting:

- Build command: `pnpm build --filter @chimborazo/studio`
- Deploy command: `pnpm --filter @chimborazo/studio deploy`

## TypeScript Configuration

### Base Configuration (tsconfig.base.json)

Shared TypeScript configuration for all workspaces:

- Strict mode enabled
- ESM module system with bundler resolution
- Path aliases configured per workspace

### Web App (apps/web/tsconfig.json)

Extends base config with:

- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports` - Be careful with side-effect imports
- `verbatimModuleSyntax: false` - Allows type-only imports without explicit `type` keyword
- Path alias: `@/*` → `./src/*`

## Working with the Monorepo

### Running Commands in Specific Workspaces

Use Turborepo's filter syntax or navigate to the workspace:

```bash
# Option 1: Filter from root
pnpm --filter @chimborazo/web dev
pnpm --filter @chimborazo/studio build

# Option 2: Navigate to workspace
cd apps/web
pnpm dev
```

### Adding Dependencies

Always use pnpm with the --filter flag from the root:

```bash
# Add to web app
pnpm add react-hook-form --filter @chimborazo/web

# Add dev dependency
pnpm add -D vitest --filter @chimborazo/web

# Add workspace dependency
pnpm add @chimborazo/sanity-config --filter @chimborazo/web --workspace
```

### Turborepo Task Pipeline

Turborepo orchestrates tasks with dependency awareness (see `turbo.json`):

- `build` - Depends on upstream builds (`^build`)
- `dev` - No caching, runs persistently
- `lint`, `type-check`, `test` - Depend on upstream builds
- `clean` - No caching

Tasks are cached for faster subsequent runs.
