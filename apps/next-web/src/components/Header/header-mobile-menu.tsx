"use client"

import { X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import IconLogo from "@/components/IconLogo/icon-logo"
import { SocialLinks } from "@/components/SocialLinks/social-links"
import { isNavigationItemActive, NAVIGATION_ITEMS } from "@/lib/navigation"
import { Button } from "../Button/button"
import { ThemeToggle } from "../ThemeToggle/theme-toggle"

interface HeaderMobileMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  currentPath: string
  facebookUrl?: string
  instagramUrl?: string
}

/**
 * Full-screen mobile navigation, built on a native modal `<dialog>`.
 *
 * `showModal()` gives us focus placement, the focus trap, an inert page
 * underneath, Escape/back-gesture dismissal, and focus return to the toggle
 * button for free. The open/close fade lives in globals.css (`.modal-dialog`).
 */
export default function HeaderMobileMenu({
  menuOpen,
  setMenuOpen,
  currentPath,
  facebookUrl,
  instagramUrl,
}: HeaderMobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Sync React state to the dialog. This also runs on mount, which matters:
  // the menu is lazy-loaded, so on the first open it mounts with menuOpen
  // already true and must open itself.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) {
      dialog.showModal()
    } else if (!menuOpen && dialog.open) {
      dialog.close()
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <dialog
      id="mobile-menu"
      ref={dialogRef}
      // Escape and the back gesture close the dialog natively; mirror that
      // into state so the toggle button's aria-expanded stays correct.
      onClose={close}
      className="modal-dialog m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto border-0 bg-grey-50 p-0 lg:hidden dark:bg-primary-900"
      aria-label="Mobile navigation menu"
    >
      <div className="flex min-h-full flex-col p-6">
        <div className="mb-12 flex items-center justify-between">
          {/* Logo and branding */}
          <Link
            href="/"
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-lg text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
          >
            <IconLogo className="h-8 w-8 shrink-0" />
            <div className="flex flex-col font-display">
              <span className="text-base leading-none font-semibold">Chimborazo</span>
              <span className="text-sm leading-none text-primary-700 dark:text-primary-400">
                Park Conservancy
              </span>
            </div>
          </Link>

          <Button
            onClick={close}
            variant="secondary"
            className="flex h-12 w-12 items-center justify-center rounded-full border p-0 dark:border-grey-700 dark:bg-grey-800 dark:hover:bg-grey-700"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1" aria-label="Mobile navigation">
          <ul className="space-y-6">
            {NAVIGATION_ITEMS.map(({ href, label }) => {
              const isActive = isNavigationItemActive(currentPath, href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${isActive ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Social Media Links */}
        <div className="mt-6">
          <SocialLinks
            className="flex gap-3"
            linkClassName="transition-transform active:scale-90"
            iconClassName="h-6 w-6 fill-grey-700 transition hover:fill-accent-700 dark:fill-primary-400 dark:hover:fill-accent-400"
            facebookUrl={facebookUrl}
            instagramUrl={instagramUrl}
          />
        </div>

        {/* Footer CTA */}
        <div className="mt-6">
          <Button
            as="a"
            variant="accent"
            href="/donate"
            trackingLocation="mobile-menu"
            className="block w-full text-center"
          >
            Donate
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="mt-4 border-t border-accent-600/20 pt-4 dark:border-accent-500/20">
          <ThemeToggle variant="button" showLabel={true} />
        </div>
      </div>
    </dialog>
  )
}
