"use client";

import IconLogo from "@/components/IconLogo/icon-logo";
import { SocialLinks } from "@/components/SocialLinks/social-links";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";
import { Button } from "../Button/button";
import { ThemeToggle } from "../ThemeToggle/theme-toggle";

interface HeaderMobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  currentPath: string;
  currentHash: string;
  facebookUrl?: string;
  instagramUrl?: string;
  mobileMenuRef: RefObject<HTMLDivElement | null>;
  prefersReducedMotion: boolean;
}

export default function HeaderMobileMenu({
  menuOpen,
  setMenuOpen,
  currentPath,
  currentHash,
  facebookUrl,
  instagramUrl,
  mobileMenuRef,
  prefersReducedMotion,
}: HeaderMobileMenuProps) {
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          id="mobile-menu"
          ref={mobileMenuRef}
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-grey-50 md:hidden dark:bg-primary-900"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div className="flex min-h-full flex-col p-6">
            {/* Close button */}
            <div className="mb-12 flex items-center justify-between">
              {/* Logo and branding */}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
              >
                <IconLogo className="h-8 w-8 shrink-0" />
                <div className="flex flex-col font-display">
                  <span className="text-base leading-none font-semibold">
                    Chimborazo
                  </span>
                  <span className="text-sm leading-none text-primary-700 dark:text-primary-400">
                    Park Conservancy
                  </span>
                </div>
              </Link>

              <Button
                onClick={() => setMenuOpen(false)}
                variant="secondary"
                className="flex h-12 w-12 items-center justify-center rounded-full border p-0 dark:border-grey-700 dark:bg-grey-800 dark:hover:bg-grey-700"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              <motion.ul className="space-y-6">
                {[
                  {
                    href: "/",
                    label: "Home",
                    isActive: currentPath === "/" && !currentHash,
                    delay: 0.01,
                  },
                  {
                    href: "/about",
                    label: "About Us",
                    isActive: currentPath === "/about" && !currentHash,
                    delay: 0.01,
                  },
                  {
                    href: "/amenities",
                    label: "Amenities",
                    isActive: currentPath === "/amenities",
                    delay: 0.02,
                  },
                  {
                    href: "/projects",
                    label: "Projects",
                    isActive: currentPath === "/projects",
                    delay: 0.03,
                  },
                  {
                    href: "/events",
                    label: "Events",
                    isActive: currentPath === "/events",
                    delay: 0.03,
                  },
                  {
                    href: "/get-involved",
                    label: "Get Involved",
                    isActive: currentPath === "/get-involved",
                    delay: 0.04,
                  },
                  {
                    href: "/history",
                    label: "History",
                    isActive: currentPath === "/history",
                    delay: 0.045,
                  },
                  {
                    href: "/media",
                    label: "Media",
                    isActive: currentPath === "/media",
                    delay: 0.05,
                  },
                ].map(({ href, label, isActive, delay }) => (
                  <motion.li
                    key={href}
                    initial={
                      prefersReducedMotion ? {} : { opacity: 0, x: -20 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : delay }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${isActive ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
