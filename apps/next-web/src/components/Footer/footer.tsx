import { cacheLife } from "next/cache"
import Link from "next/link"
import { SocialLinks } from "@/components/SocialLinks/social-links"
import { WaveDivider } from "@/components/WaveDivider/wave-divider"
import { NAVIGATION_ITEMS } from "@/lib/navigation"
import { ThemeToggle } from "../ThemeToggle/theme-toggle"

interface FooterProps {
  facebookUrl?: string
  instagramUrl?: string
}

export default function Footer({ facebookUrl, instagramUrl }: FooterProps) {
  return (
    // The footer keeps the page background above the wave and its own surface
    // below it, so the curve itself is where the color changes. The shape is
    // mirrored rather than rotated: rotating would flip the fill to the top
    // edge and put the footer color above the line again.
    <footer className="relative bg-grey-50 text-grey-800 dark:bg-primary-900 dark:text-grey-100">
      {/* James River wave divider */}
      <WaveDivider fill="fill-neutral-100 dark:fill-primary-950" flip />

      {/* -mt-px closes the hairline seam between the svg and this block. */}
      <div className="-mt-px bg-neutral-100 pt-12 pb-8 md:pt-16 dark:bg-primary-950">
        <div className="mx-auto max-w-6xl px-4">
          {/* Main footer content */}
          <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
            {/* About section */}
            <div className="col-span-2 space-y-4 md:col-span-1">
              <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
                Chimborazo Park Conservancy
              </h3>
              <p className="font-body text-sm leading-relaxed text-grey-700 dark:text-grey-300">
                A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in
                Richmond, VA&apos;s Church Hill neighborhood.
              </p>
              <address className="font-body text-sm leading-relaxed text-grey-700 not-italic dark:text-grey-300">
                3215 E. Broad St. <br /> Richmond, VA 23223
              </address>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
                Navigation
              </h3>
              <nav
                aria-label="Footer navigation"
                className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 sm:gap-x-6"
              >
                {NAVIGATION_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect section */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
                Connect
              </h3>
              <SocialLinks
                className="flex gap-3"
                linkClassName="text-grey-600 transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-400 dark:hover:text-accent-400"
                iconClassName="h-6 w-6 fill-grey-600 transition hover:fill-accent-700 dark:fill-grey-400 dark:hover:fill-accent-400"
                facebookUrl={facebookUrl}
                instagramUrl={instagramUrl}
              />
              <div className="space-y-2 pt-4">
                <ThemeToggle variant="button" showLabel={true} />
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-grey-200 pt-8 md:flex-row dark:border-primary-700">
            <FooterCopyright />
            <div className="flex gap-6">
              <Link
                href="/privacy-policy"
                className="font-body text-sm text-grey-600 transition hover:text-accent-700 dark:text-grey-400 dark:hover:text-accent-400"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * `new Date()` can't be read during prerendering — the value would be frozen
 * into the static shell with nothing to correct it. Caching it on a daily
 * revalidate keeps the footer in the shell while bounding how long a stale year
 * can survive a New Year to under a day.
 *
 * (Despite the previous comment here, this was never a client component.)
 */
async function FooterCopyright() {
  "use cache"
  cacheLife({ revalidate: 86_400 })

  return (
    <p className="text-center font-body text-sm text-grey-600 md:text-left dark:text-grey-400">
      &copy; {new Date().getFullYear()} Chimborazo Park Conservancy. All rights reserved.
    </p>
  )
}
