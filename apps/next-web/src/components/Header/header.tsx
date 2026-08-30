"use client"

import { Menu } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import IconLogo from "@/components/IconLogo/icon-logo"
import { useReducedMotion } from "@/hooks/useReducedMotion"
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
 * - Smooth animations with reduced motion support
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
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [menuOpen])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen || !mobileMenuRef.current) return

    const menuElement = mobileMenuRef.current
    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element when menu opens
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    menuElement.addEventListener("keydown", handleTabKey)
    return () => menuElement.removeEventListener("keydown", handleTabKey)
  }, [menuOpen])

  return (
    <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
      <header className="w-full max-w-6xl rounded-2xl transition md:border md:border-primary-200/70 md:bg-grey-50/95 md:px-3 md:py-2 md:shadow-sm md:backdrop-blur dark:md:border-primary-700 dark:md:bg-primary-900/95">
        <div className="flex w-full items-center justify-between gap-2">
          {/* Logo - Mobile only */}
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-200 bg-grey-50 text-primary-800 shadow-md focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden dark:border-primary-700 dark:bg-primary-900 dark:text-primary-400"
          >
            <IconLogo className="h-7 w-7" />
          </Link>

          {/* Branding - Desktop only */}
          <Link
            href="/"
            className="group hidden shrink-0 items-center gap-2 rounded-xl px-2 py-1 text-primary-800 transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none md:flex dark:text-grey-100 dark:hover:bg-primary-800/50"
          >
            <IconLogo className="mr-1 h-10 w-10 transition group-hover:text-accent-600 dark:text-primary-600 dark:group-hover:text-accent-400" />
            <div className="flex flex-col font-display transition group-hover:text-accent-700 dark:group-hover:text-accent-400">
              <span className="text-xl leading-none">Chimborazo</span>
              <span className="text-sm leading-none">Park Conservancy</span>
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
                      ? "bg-primary-100 text-primary-900 dark:bg-primary-800 dark:text-primary-100"
                      : "text-grey-700 hover:bg-neutral-100 hover:text-primary-900 dark:text-grey-200 dark:hover:bg-primary-800/60 dark:hover:text-grey-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Button
            as="a"
            variant="accent"
            size="small"
            href="/donate"
            trackingLocation="mobile-header"
            className="px-3 py-2 text-xs md:hidden"
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
            className="flex h-12 w-12 items-center justify-center border p-0 shadow-md lg:hidden dark:border-grey-800 dark:bg-grey-900"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop donate button */}
          <Button
            as="a"
            variant="accent"
            size="small"
            href="/donate"
            trackingLocation="header"
            className="hidden shrink-0 text-center md:inline-flex"
          >
            Donate
          </Button>
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
          mobileMenuRef={mobileMenuRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </div>
  )
}
