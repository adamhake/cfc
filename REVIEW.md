Chimborazo Park Conservancy – Code Review (TanStack Start + Sanity)
==================================================================

Findings (ordered by severity)
------------------------------
- api/webhooks/sanity.tsx:38-55 – GET endpoint returns whether SANITY_WEBHOOK_SECRET/NETLIFY_* are configured. This leaks operational state (attacker learns secrets are set) and is unnecessary—prefer 204/404 or authenticated access.
- api/webhooks/sanity.tsx:57-165 – Webhook reads the full request body with `request.text()` and lacks size or time limits. A large/slow request can tie up the server before signature validation (DoS risk). Add a max body size check, respect/limit `content-length`, and use an abortable timeout.
- api/webhooks/sanity.tsx:118-146,216-257 – Cache tags are computed but ignored; every webhook purges the entire Netlify cache. This is a correctness/performance bug and increases downtime risk. If Netlify supports scoped purges, pass tags/paths; otherwise, scope to affected routes and log the limitation.
- api/draft.tsx:6-32 – Preview cookie uses HttpOnly but not `Secure`; risk of sending over HTTP. Also accepts `redirectTo` from Sanity without an allowlist, so a leaked secret enables open redirect. Enforce same-origin redirects and set `Secure; SameSite=Lax` (or `None` if cross-site is required).
- routes/index.tsx:251-268 – `events.sort` is called twice on the same array, mutating shared data and doing redundant work each render. Copy and memoize once per render to avoid ordering bugs and extra computation.

Architecture & TanStack usage
------------------------------
- TanStack Start/Router structure is consistent (file routes, root layout, SSR query integration via `setupRouterSsrQueryIntegration`). Theme/palette managers are shared via router context; good doc/hydration handling with `<HeadContent>`/`<Scripts>`.
- Query patterns: nice use of `queryOptions` + `ensureQueryData` in loaders for SSR hydration. Defaults in `getContext` disable focus/refetch and set a 1m staleTime; most routes override with longer staleTime/gcTime—consistent. Consider setting `networkMode: "always"` for SSR queries that must run on server regardless of reject-on-SSR defaults.
- Cache keys centralized in `queryKeys`; route loaders map to keys correctly. Avoid in-render sorts on shared arrays (homepage). Some fallback to static data is good resilience.
- Error boundaries and notFound wiring are present at root; individual routes lack per-route error components, so failures will bubble to global boundary—fine but add route-level error UIs for better UX.

Sanity integration
------------------
- Clients: split between CDN (`perspective: "raw"`) and preview (`perspective: "previewDrafts"`, no CDN, token). Good separation. Ensure `env` schema keeps server-only tokens off client bundles (current setup is correct). Consider adding `useCdn: true` on prod only (flag via env) and `resultSourceMap: true` if you ever need debugging.
- Queries live in `packages/sanity-config` and are consumed via generated types—good. However, queries don’t request `__i18n_lang` or draft metadata; if you need live preview diffing, consider `perspective: "raw"` plus `isDraft` flags.
- Webhook review already noted: signature verified but no size/time limits; cache purging ignores tags.
- Preview endpoint sets a cookie (`sanity-preview`) without `Secure`, and open redirect risk; also not clearing cookie on disable route (no disable route present). Add `/api/draft/disable` to clear cookie and document flow.

Caching & rendering
-------------------
- Route loaders use `ensureQueryData` to prefetch; good for SSR. Stale/gc times vary per resource: homepage 30m/60m, events list 5m/15m, event detail 10m/30m, media 15m/60m. These are reasonable but could align with content update frequency. Consider background refetch on window focus for fresher UX if Sanity updates are frequent.
- Hydration: root injects theme/palette script before `<HeadContent>`—good to avoid FOUC. Consider adding `color-scheme` meta for better form styling.
- Image handling: using `@unpic/react` and Sanity image metadata for dimensions; good. For Sanity images, consider using `srcset` via Unpic builder or Sanity’s `imageUrlBuilder` to control widths and formats (avif/webp) instead of raw URLs.

Performance
-----------
- Avoid repeated sorts on shared arrays (homepage). Use `useMemo` where mapping/sorting is stable.
- Media route returns all images and does client-side pagination. If the gallery grows, add server-side pagination or limit + “load more” via query params and route loader to avoid shipping large payloads.
- Animations (framer-motion) check `useReducedMotion`—good. Consider lazy-loading heavy sections below the fold with `React.lazy`/`Suspense` if bundle size grows.
- Query defaults disable `refetchOnWindowFocus` globally; that improves bandwidth but hurts data freshness. Evaluate enabling for short-lived data (events) with `refetchOnMount: "always"` for detail pages if staleness matters.

Accessibility & design consistency
----------------------------------
- Global skip link present; Header uses focus management and click-away. Mobile menu uses focus trap and Escape handling—good. Ensure `aria-expanded` on menu toggles to signal state.
- Buttons/links generally have visible focus styles; keep consistent across custom components. Check color contrast in gradients (light-on-light) in primary/hero sections; validate with WCAG AA (e.g., primary-50 backgrounds with grey text).
- Form controls: newsletter input in Get Involved uses console.log; add proper `label`/`aria-label` and error handling when wired up.
- Headings are mostly semantic, but some decorative spans inside buttons; ensure top-level page sections use a single H1 (PageHero likely renders one; verify per route).
- Use `alt` fallbacks for images; many `alt` derive from Sanity data—guard against empty strings in galleries so screen readers don’t get blank descriptions.

Security
--------
- Webhook and preview issues noted. Also consider: enforce HTTPS in cookies, add basic rate limiting on API routes, and instrument logging without echoing secrets. For draft mode, set short cookie lifetime and rotate secrets.

Actionable next steps
---------------------
1) Harden webhooks: add size/time limits, gate GET status, and implement scoped cache purges.
2) Secure preview flow: same-origin redirect check, `Secure; SameSite` cookie, add disable endpoint.
3) Optimize data handling: fix homepage sort, add `aria-expanded` on menu toggles, consider focus/error UIs per route. Evaluate lighter refetch settings for time-sensitive data.
4) Sanity images: use builder/unpic `srcset` for responsive formats; consider pagination for media gallery.
5) Testing: add route-level tests for webhook/preview, and accessibility checks (e.g., axe) on key pages.

Recommendations
---------------
- Lock down the webhook status route: remove sensitive config echoes or require auth; keep consistent JSON error shapes for probes.
- Harden webhook processing: reject bodies over a safe limit (e.g., 256KB), enforce `content-type` and `signature` presence early, and use an AbortController timeout for signature validation and Netlify fetch.
- Implement scoped cache purging or at least route-level purges; document Netlify’s current limitations and emit warnings when falling back to full-site purges.
- Secure preview flow: add same-origin enforcement on `redirectTo`, set `Secure` and appropriate `SameSite` on the preview cookie, and consider expiring/rotating the preview secret.
- Fix homepage event sorting: sort a copy once (`const sorted = useMemo(() => [...events].sort(...), [events])`) and reuse to avoid mutations.

Notes on testing
----------------
- No tests were run in this review. After fixes, run `pnpm run lint`, `pnpm run type-check`, and relevant route-level tests (or add them) for webhook and preview flows.
