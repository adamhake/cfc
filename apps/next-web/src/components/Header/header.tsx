"use client"

import { useClickAway } from "@uidotdev/usehooks"
import { Menu, X } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import IconLogo from "@/components/IconLogo/icon-logo"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import type { SanityProjectCard } from "@/lib/sanity-types"
import { Button } from "../Button/button"

const HeaderDesktopMenu = dynamic(() => import("./header-desktop-menu"), { ssr: false })
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
  /** Featured project data, fetched server-side */
  featuredProject?: SanityProjectCard | null
  /** Social media URLs from site settings */
  facebookUrl?: string
  instagramUrl?: string
}

export default function Header({
  featuredProject: featuredProjectProp,
  facebookUrl,
  instagramUrl,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentPath = pathname
  // Always init to "" so SSR and first client render match; sync after mount
  const [currentHash, setCurrentHash] = useState("")
  useEffect(() => {
    setCurrentHash(window.location.hash.replace("#", ""))
    const onHashChange = () => setCurrentHash(window.location.hash.replace("#", ""))
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])
  const featuredProject = featuredProjectProp
  const prefersReducedMotion = useReducedMotion()

  const ref = useClickAway<HTMLElement>(() => {
    // Only close on click-away for desktop menu
    // Mobile menu has its own close handlers on links/buttons
    // Use matchMedia instead of window.innerWidth to avoid forced reflow
    if (window.matchMedia("(min-width: 768px)").matches) {
      setMenuOpen(false)
    }
  })

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
      <header
        ref={ref}
        className="w-full max-w-6xl rounded-2xl transition md:border md:border-grey-200 md:bg-grey-50 md:p-3 md:shadow-md dark:md:border-primary-700 dark:md:bg-primary-900"
      >
        <div className="flex w-full items-center justify-between gap-2">
          {/* Menu button - Desktop only */}
          <Button
            onClick={() => {
              setHasOpened(true)
              setMenuOpen((s) => !s)
            }}
            variant="outline"
            size="small"
            className="hidden w-28 items-center gap-2 border tracking-normal normal-case md:flex"
            aria-expanded={menuOpen}
            aria-controls="desktop-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </Button>

          {/* Logo - Mobile only */}
          <Link
            href="/"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-200 bg-grey-50 text-primary-800 shadow-md focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden dark:border-primary-700 dark:bg-primary-900 dark:text-primary-400"
          >
            <IconLogo className="h-7 w-7" />
          </Link>

          {/* Center branding - Desktop only */}
          <Link
            href="/"
            className="group hidden items-center gap-2 rounded-xl px-3 py-1 text-primary-800 transition hover:bg-grey-50/50 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none md:flex dark:text-grey-100 dark:hover:bg-primary-800/50"
          >
            <IconLogo className="mr-1 h-10 w-10 transition group-hover:text-accent-600 dark:text-primary-600 dark:group-hover:text-accent-400" />
            <div className="flex flex-col font-display transition group-hover:text-accent-700 dark:group-hover:text-accent-400">
              <span className="text-xl leading-none">Chimborazo</span>
              <span className="text-sm leading-none">Park Conservancy</span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <Button
            onClick={() => {
              setHasOpened(true)
              setMenuOpen((s) => !s)
            }}
            variant="secondary"
            className="flex h-12 w-12 items-center justify-center border p-0 shadow-md md:hidden dark:border-grey-800 dark:bg-grey-900"
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
            className="hidden text-center md:block md:w-28"
          >
            Donate
          </Button>
        </div>

        {/* Dropdown menu - Desktop only */}
        {hasOpened && (
          <HeaderDesktopMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            currentPath={currentPath}
            currentHash={currentHash}
            facebookUrl={facebookUrl}
            instagramUrl={instagramUrl}
            prefersReducedMotion={prefersReducedMotion}
            featuredProject={featuredProject}
          />
        )}
      </header>

      {/* Full-screen Mobile Menu */}
      {hasOpened && (
        <HeaderMobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          currentPath={currentPath}
          currentHash={currentHash}
          facebookUrl={facebookUrl}
          instagramUrl={instagramUrl}
          mobileMenuRef={mobileMenuRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </div>
  )
}
