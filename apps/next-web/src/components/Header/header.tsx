"use client"

import { Menu } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import IconLogo from "@/components/IconLogo/icon-logo"
import { isNavigationItemActive, NAVIGATION_ITEMS } from "@/lib/navigation"
import { Button } from "../Button/button"

const HeaderMobileMenu = dynamic(() => import("./header-mobile-menu"), { ssr: false })

/**
 * Site header with navigation, logo, social links, and mobile menu.
 *
 * Features:
 * - Responsive navigation that collapses to hamburger menu on mobile
 * - Theme toggle for dark/light mode
 * - Social media links (Facebook, Instagram)
 * - Upcoming event display in mobile menu
 * - Active route highlighting
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
interface HeaderProps {
  /** Social media URLs from site settings */
  facebookUrl?: string
  instagramUrl?: string
}

export default function Header({ facebookUrl, instagramUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const pathname = usePathname()

  // Focus, the focus trap, Escape, and scroll containment are all handled by
  // the native <dialog> inside HeaderMobileMenu.

  return (
    <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
      {/* One bar at every width. On phones the logo and menu button used to
          float on their own, so body text and photos scrolled straight through
          them. In dark mode the bar sits on a primary-900 page, so it needs
          its own darker surface and a visible edge. */}
      <header className="w-full max-w-6xl rounded-2xl border border-primary-200/70 bg-grey-50/95 px-2 py-1.5 shadow-sm backdrop-blur transition md:px-3 md:py-2 dark:border-primary-600/60 dark:bg-primary-950/95 dark:shadow-lg dark:shadow-primary-950/50">
        <div className="flex w-full items-center justify-between gap-2">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1 text-primary-800 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none md:px-2 dark:text-grey-100 dark:hover:bg-primary-800/50"
          >
            <IconLogo className="h-8 w-8 transition group-hover:text-accent-600 md:mr-1 md:h-10 md:w-10 dark:text-primary-600 dark:group-hover:text-accent-400" />
            <div className="flex flex-col font-wordmark transition group-hover:text-accent-700 dark:group-hover:text-accent-400">
              <span className="text-lg leading-none md:text-xl">Chimborazo</span>
              <span className="text-xs leading-none md:text-sm">Park Conservancy</span>
            </div>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 items-center gap-1 lg:flex"
          >
            {NAVIGATION_ITEMS.filter((item) => item.href !== "/").map((item) => {
              const isActive = isNavigationItemActive(pathname, item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-2.5 py-2 font-body text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:outline-none xl:px-3 ${
                    isActive
                      ? "bg-accent-100 text-accent-900 dark:bg-accent-900/60 dark:text-accent-200"
                      : "text-grey-700 hover:bg-neutral-100 hover:text-primary-900 dark:text-grey-200 dark:hover:bg-primary-800/60 dark:hover:text-grey-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {/* Header Donate is desktop-only (xl and up). Below that the bar
                is just the wordmark and menu button: the mobile menu carries
                Donate, and the homepage hero shows it on the first screen. */}
            <Button
              as="a"
              variant="accent"
              size="small"
              href="/donate"
              trackingLocation="header"
              className="hidden shrink-0 text-center xl:inline-flex"
            >
              Donate
            </Button>

            {/* Mobile menu button */}
            <Button
              onClick={() => {
                setHasOpened(true)
                setMenuOpen((s) => !s)
              }}
              variant="secondary"
              className="flex h-11 w-11 items-center justify-center border p-0 lg:hidden dark:border-primary-700 dark:bg-primary-900"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu */}
      {hasOpened && (
        <HeaderMobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          currentPath={pathname}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
        />
      )}
    </div>
  )
}
