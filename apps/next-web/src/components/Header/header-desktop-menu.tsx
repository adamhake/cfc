"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { SocialLinks } from "@/components/SocialLinks/social-links"
import type { SanityProjectCard } from "@/lib/sanity-types"
import ProjectCardCondensed from "../ProjectCardCondensed/project-card-condensed"

interface HeaderDesktopMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  currentPath: string
  currentHash: string
  facebookUrl?: string
  instagramUrl?: string
  prefersReducedMotion: boolean
  featuredProject?: SanityProjectCard | null
}

export default function HeaderDesktopMenu({
  menuOpen,
  setMenuOpen,
  currentPath,
  currentHash,
  facebookUrl,
  instagramUrl,
  prefersReducedMotion,
  featuredProject,
}: HeaderDesktopMenuProps) {
  return (
    <AnimatePresence mode="wait">
      {menuOpen && (
        <motion.div
          id="desktop-menu"
          key="mainMenu"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            opacity: 0,
            y: -4,
            transition: {
              duration: prefersReducedMotion ? 0 : 0.15,
              ease: [0.4, 0, 1, 1],
            },
          }}
          className="hidden md:block"
        >
          <div className="mt-4 flex w-full justify-between gap-12 border-t border-accent-600/20 p-6 pt-8 transition dark:border-accent-500/20">
            <nav className="flex flex-1 flex-col justify-between border-r border-accent-600/20 pr-12 dark:border-accent-500/20">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  {
                    href: "/",
                    label: "Home",
                    isActive: currentPath === "/" && !currentHash,
                  },
                  {
                    href: "/events",
                    label: "Events",
                    isActive: currentPath === "/events",
                  },
                  {
                    href: "/about",
                    label: "About Us",
                    isActive: currentPath === "/about",
                  },
                  {
                    href: "/amenities",
                    label: "Amenities",
                    isActive: currentPath === "/amenities",
                  },
                  {
                    href: "/projects",
                    label: "Projects",
                    isActive: currentPath === "/projects",
                  },
                  {
                    href: "/get-involved",
                    label: "Get Involved",
                    isActive: currentPath === "/get-involved",
                  },
                  {
                    href: "/history",
                    label: "History",
                    isActive: currentPath === "/history",
                  },
                  {
                    href: "/media",
                    label: "Media",
                    isActive: currentPath === "/media",
                  },
                ].map(({ href, label, isActive }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                    >
                      <span
                        className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${isActive ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                      >
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Media Links */}
              <div className="mt-6">
                <SocialLinks
                  className="flex gap-3"
                  linkClassName="transition-transform active:scale-90"
                  iconClassName="h-6 w-6 fill-grey-700 transition hover:fill-accent-600 dark:fill-primary-400 dark:hover:fill-accent-400"
                  facebookUrl={facebookUrl}
                  instagramUrl={instagramUrl}
                />
              </div>
            </nav>
            {featuredProject && (
              <div className="w-72">
                <h3 className="mb-3 font-display text-base font-semibold text-primary-700 dark:text-primary-400">
                  2022 Survey Results
                </h3>
                <ProjectCardCondensed
                  project={featuredProject}
                  onClick={() => setMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
