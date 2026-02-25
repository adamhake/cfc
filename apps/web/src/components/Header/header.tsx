import IconLogo from "@/components/IconLogo/icon-logo";
import { SocialLinks } from "@/components/SocialLinks/social-links";
import { useProject } from "@/hooks/useProject";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Link, useRouterState } from "@tanstack/react-router";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button/button";
import ProjectCardCondensed from "../ProjectCardCondensed/project-card-condensed";
import { ThemeToggle } from "../ThemeToggle/theme-toggle";

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
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentHash = routerState.location.hash;
  const { data: featuredProject } = useProject("parkwide-native-tree-planting");
  const prefersReducedMotion = useReducedMotion();

  const ref = useClickAway<HTMLElement>(() => {
    // Only close on click-away for desktop menu
    // Mobile menu has its own close handlers on links/buttons
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (!isMobile) {
      setMenuOpen(false);
    }
  });

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen || !mobileMenuRef.current) return;

    const menuElement = mobileMenuRef.current;
    const focusableElements = menuElement.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when menu opens
    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    menuElement.addEventListener("keydown", handleTabKey);
    return () => menuElement.removeEventListener("keydown", handleTabKey);
  }, [menuOpen]);

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
              setMenuOpen((s) => !s);
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
            to="/"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-200 bg-grey-50 text-primary-800 shadow-md focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none md:hidden dark:border-primary-700 dark:bg-primary-900 dark:text-primary-400"
          >
            <IconLogo className="h-7 w-7" />
          </Link>

          {/* Center branding - Desktop only */}
          <Link
            to="/"
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
            onClick={() => setMenuOpen((s) => !s)}
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
                  ease: [0.16, 1, 0.3, 1], // Smooth ease-out
                },
              }}
              exit={{
                opacity: 0,
                y: -4,
                transition: {
                  duration: prefersReducedMotion ? 0 : 0.15,
                  ease: [0.4, 0, 1, 1], // Ease-in for exit (snappier)
                },
              }}
              className="hidden md:block"
            >
              <div className="mt-4 flex w-full justify-between gap-12 border-t border-accent-600/20 p-6 pt-8 transition dark:border-accent-500/20">
                <nav className="flex flex-1 flex-col justify-between border-r border-accent-600/20 pr-12 dark:border-accent-500/20">
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-5">
                    <li>
                      <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/" && !currentHash ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Home
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/events"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/events" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Events
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/about" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          About Us
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/amenities"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/amenities" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Amenities
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/projects"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/projects" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Projects
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/get-involved"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/get-involved" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Get Involved
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/history"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/history" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          History
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/media"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/media" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Media
                        </span>
                      </Link>
                    </li>
                  </ul>

                  {/* Social Media Links */}
                  <div className="mt-6">
                    <SocialLinks
                      className="flex gap-3"
                      linkClassName="transition-transform active:scale-90"
                      iconClassName="h-6 w-6 fill-grey-700 transition hover:fill-accent-600 dark:fill-primary-400 dark:hover:fill-accent-400"
                    />
                  </div>
                </nav>
                {featuredProject && (
                  <div className="w-72">
                    <h3 className="mb-3 font-display text-base font-semibold text-primary-700 dark:text-primary-400">
                      Featured Project
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
      </header>

      {/* Full-screen Mobile Menu */}
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
                  to="/"
                  onClick={() => setMenuOpen(false)}
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
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.01 }}
                  >
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/" && !currentHash ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Home
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.02 }}
                  >
                    <Link
                      to="/amenities"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/amenities" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Amenities
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.03 }}
                  >
                    <Link
                      to="/projects"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/projects" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Projects
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.03 }}
                  >
                    <Link
                      to="/events"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/events" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Events
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.04 }}
                  >
                    <Link
                      to="/get-involved"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/get-involved" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Get Involved
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.045 }}
                  >
                    <Link
                      to="/history"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/history" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      History
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 0.05 }}
                  >
                    <Link
                      to="/media"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/media" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Media
                    </Link>
                  </motion.li>
                </motion.ul>
              </nav>

              {/* Social Media Links */}
              <div className="mt-6">
                <SocialLinks
                  className="flex gap-3"
                  linkClassName="transition-transform active:scale-90"
                  iconClassName="h-6 w-6 fill-grey-700 transition hover:fill-accent-700 dark:fill-primary-400 dark:hover:fill-accent-400"
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
    </div>
  );
}
