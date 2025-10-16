# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Chimborazo Park Conservancy website - a React application for a 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in Richmond, VA's Church Hill neighborhood. The site provides information about the park's history, mission, events, and volunteer opportunities.

## Development Commands

### Running the Application

- `npm run start` - Start development server on port 3000
- `npm run dev` - Alternative development server command
- `npm run build` - Build for production (outputs to `dist/client`)
- `npm run serve` - Preview production build

### Testing & Quality

- `npm run test` - Run tests with Vitest
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Check code with Biome

### Storybook

- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run build-storybook` - Build Storybook for deployment

## Architecture & Tech Stack

### Core Framework

- **TanStack Start**: Full-stack React framework with SSR support
- **TanStack Router**: File-based routing system with type-safe navigation
- **TanStack Query**: Server state management integrated with router SSR
- **React 19**: Latest React with concurrent features

### Styling

- **Tailwind CSS v4**: Utility-first styling via `@tailwindcss/vite` plugin
- **Framer Motion**: Animation library for interactive components
- Custom design system using Tailwind utilities (see `src/styles.css`)

### Routing Architecture

Routes are file-based in `src/routes/`:

- `__root.tsx` - Root layout with Header/Footer, devtools, and shell component
- `index.tsx` - Homepage
- `events/$slug.tsx` - Dynamic event detail pages
- `media.tsx` - Media gallery page
- `routeTree.gen.ts` - Auto-generated route tree (do not edit manually)

The router integrates TanStack Query for SSR data fetching via `setupRouterSsrQueryIntegration` in `src/router.tsx`.

### State Management & Data Fetching

- **TanStack Query**: Primary data fetching solution, context provided via `src/integrations/tanstack-query/root-provider.tsx`
- Router context includes `QueryClient` (see `MyRouterContext` in `__root.tsx`)
- Query client is created in `getContext()` and passed through router setup

### Environment Variables

- Managed via T3 Env (`@t3-oss/env-core`) in `src/env.ts`
- Client variables must be prefixed with `VITE_`
- Server variables: `SERVER_URL` (optional)
- Client variables: `VITE_APP_TITLE` (optional)
- Use: `import { env } from "@/env"` then access `env.VITE_APP_TITLE`

### Path Aliases

- `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite-tsconfig-paths`)
- Always use path aliases for imports: `import { Button } from "@/components/Button/button"`

### Component Organization

Components are organized in feature folders with co-located stories:

- `src/components/[ComponentName]/[component-name].tsx` - Component implementation
- `src/components/[ComponentName]/[component-name].stories.ts` - Storybook stories
- Examples: `Button`, `Header`, `Hero`, `Event`, `Vision`, `Quote`

### Data Management

Static data files in `src/data/`:

- `events.ts` - Event data with `Event` interface

### Development Tools

- **TanStack Devtools**: Unified devtools for Router and Query (configured in `__root.tsx`)
- **Storybook**: Component development with a11y and theme addons
- **ESLint**: Flat config with React Hooks, React Refresh, and TanStack Router plugins
- **Prettier**: Code formatting with Tailwind plugin for class sorting

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

- Static images in `public/` directory
- Use `@unpic/react` for optimized image loading where needed
- WebP format preferred for photos

## Deployment

Configured for Netlify deployment:

- Build command: `vite build`
- Publish directory: `dist/client`
- Dev server: port 3000 (see `netlify.toml`)

## TypeScript Configuration

Strict mode enabled with:

- `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `noUncheckedSideEffectImports` - Be careful with side-effect imports
- ESM module system with bundler resolution
- `verbatimModuleSyntax: false` - Allows type-only imports without explicit `type` keyword
