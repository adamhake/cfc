import { cookies, draftMode } from "next/headers"
import {
  defineLive,
  type LivePerspective,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type StrictDefinedFetchType,
} from "next-sanity/live"
import { cache } from "react"
import { env } from "@/env"
import { sanityClient } from "./sanity"

const token = env.SANITY_API_TOKEN

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient.withConfig({
    stega: {
      studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? "http://localhost:3333",
    },
  }),
  serverToken: token,
  browserToken: env.SANITY_API_BROWSER_TOKEN || false,
  // Required for Cache Components: `cookies()` and `draftMode()` can't be read
  // inside a `use cache` boundary, so there is no cookie auto-resolution here.
  // Every call site states its `perspective` and `stega` explicitly, and those
  // become part of the cache key — published and draft content get separate
  // entries rather than one that leaks between them.
  strict: true,
})

/**
 * The app's single `use cache` boundary.
 *
 * `sanityFetch` registers `cacheTag`/`cacheLife` internally but deliberately
 * does not open the boundary itself, so this wrapper provides it once — callers
 * must not add their own `use cache`. Everything the query depends on
 * (`perspective`, `stega`, `params`) arrives as an argument and therefore
 * becomes part of the cache key.
 *
 * Cached entries live for a year and are invalidated by tag, never by expiry.
 * See `cacheLife` in next.config.ts.
 */
export const cachedSanityFetch: StrictDefinedFetchType = async (options) => {
  "use cache"
  return sanityFetch(options)
}

export interface DynamicFetchOptions {
  perspective: LivePerspective
  variant?: string
  stega: boolean
}

/**
 * Resolves the per-request fetch options that `strict: true` no longer derives
 * from cookies on its own.
 *
 * Reads `draftMode()` and `cookies()`, so it must be called *outside* any
 * `use cache` boundary and its result passed in as an argument. Reproduces the
 * behavior non-strict `sanityFetch` had implicitly: published content for
 * ordinary visitors, and the cookie-selected perspective with stega encoding
 * (which powers Visual Editing overlays) inside draft mode.
 *
 * Wrapped in `React.cache` so the pages that fetch several queries per render
 * resolve this once per request rather than once per query.
 */
export const getDynamicFetchOptions = cache(async (): Promise<DynamicFetchOptions> => {
  const { isEnabled: isDraftMode } = await draftMode()
  if (!isDraftMode) {
    return { perspective: "published", stega: false }
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar })
  const variant = await resolveVariantFromCookies({ cookies: jar })
  return { perspective: perspective ?? "drafts", variant, stega: true }
})
