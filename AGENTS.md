# Repository Guidelines

## Project Structure & Module Organization
Chimborazo Park Conservancy is a pnpm + Turborepo workspace. `apps/web/` hosts the TanStack Start React site (routes in `src/routes`, shared UI in `src/components`, helpers in `src/lib`). `apps/studio/` is the Sanity Studio for editors. Shared schemas and GROQ queries belong in `packages/sanity-config/`. Root config (`turbo.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`) handles pipelines and aliases; reusable utilities live under `packages/`.

## Build, Test, and Development Commands
- `pnpm install` with pnpm only; `preinstall` blocks npm/yarn.
- `pnpm run dev` → `turbo run dev`, starting the web app on :3000 and Studio on :3333; scope with `pnpm --filter @chimborazo/web dev`.
- `pnpm run build` runs production builds for all workspaces; use `pnpm --filter @chimborazo/studio build` for scoped deploys.
- `pnpm run lint`, `pnpm run type-check`, and `pnpm run format` call ESLint, tsc, and Prettier through Turbo.
- `pnpm run clean` removes cached artifacts; reinstall afterward if dependencies changed.

## Coding Style & Naming Conventions
TypeScript + React everywhere, 2-space indentation, `.ts/.tsx` only. Prettier (with the Tailwind plugin) owns formatting; ESLint and Biome enforce lint (`pnpm run lint`, `pnpm --filter @chimborazo/web check`). Components are PascalCase, hooks camelCase prefixed with `use`, and route filenames mirror URL segments inside `apps/web/src/routes`. Favor named exports and import helpers via `@/` (web internals) or `@chimborazo/sanity-config` (shared schemas) instead of deep relatives.

## Testing Guidelines
Vitest drives unit and component tests; colocate specs as `*.test.tsx`. Run `pnpm run test` (or `pnpm --filter @chimborazo/web test`) before every push. Manual QA notes live in `apps/web/docs/testing/`—extend `dark-mode-manual-tests.md` for new regressions. Prioritize coverage on data loaders, Sanity query adapters, and complex UI state; pair new routes with Storybook stories or integration tests to document intent.

## Commit & Pull Request Guidelines
Commits use short, imperative, lower-case summaries describing the user-visible outcome (“add the park gallery to homepage”). Keep dependency bumps separate from feature work. Pull requests should summarize the change, link the Linear/GitHub issue, note which app(s) are touched, include UI screenshots when relevant, call out new env vars, and confirm `pnpm run lint`, `test`, and `type-check` all pass.

## Environment & Security Notes
Copy `.env.example` files in `apps/web/` and `apps/studio/` before running dev servers, and keep filled `.env` files out of git. Store Sanity tokens (Editor scope) only in local `.env` files or Netlify vars, and document any new secret in README plus deployment notes so operators can configure production safely.
