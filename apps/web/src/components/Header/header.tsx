import { events } from "@/data/events";
import IconLogo from "@/IconLogo/icon-logo";
import { Link, useRouterState } from "@tanstack/react-router";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../Button/button";
import EventCardCondensed from "../EventCardCondensed/event-card-condensed";
import { ThemeToggle } from "../ThemeToggle/theme-toggle";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentHash = routerState.location.hash;

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
            <div className="flex flex-col font-display transition group-hover:text-accent-700 dark:group-hover:text-accent-400">
              <span className="text-xl leading-none">Chimborazo</span>
              <span className="text-sm leading-none">Park Conservancy</span>
            </div>
            <IconLogo className="mx-3 h-10 w-10 transition group-hover:text-accent-600 dark:text-primary-600 dark:group-hover:text-accent-400" />
            <div className="flex flex-col font-display transition group-hover:text-accent-700 dark:group-hover:text-accent-400">
              <span className="text-xl leading-none">Friends of</span>
              <span className="text-sm leading-none">Chimborazo Park</span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <Button
            onClick={() => setMenuOpen((s) => !s)}
            variant="secondary"
            className="flex h-12 w-12 items-center justify-center border p-0 shadow-md md:hidden dark:border-grey-800 dark:bg-grey-900"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop donate button */}
          <Button
            as="a"
            variant="accent"
            size="small"
            zeffy-form-link="https://www.zeffy.com/embed/donation-form/general-donation-125?modal=true"
            className="hidden text-center md:block md:w-28"
          >
            Donate
          </Button>
        </div>

        {/* Dropdown menu - Desktop only */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mainMenu"
              initial={{ maxHeight: 0, opacity: 0 }}
              animate={{ maxHeight: 500, opacity: 1 }}
              exit={{ maxHeight: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
              className="hidden md:block"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-4 flex w-full justify-between gap-12 border-t border-accent-600/20 p-6 pt-8 transition dark:border-accent-500/20"
              >
                <nav className="flex-1 border-r border-accent-600/20 pr-12 dark:border-accent-500/20">
                  <ul className="space-y-4">
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
                        to="/"
                        hash="get-involved"
                        onClick={() => setMenuOpen(false)}
                        className="group inline-block font-body text-lg font-medium text-grey-800 transition focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
                      >
                        <span
                          className={`border-b-2 transition group-hover:border-accent-600 dark:group-hover:border-accent-400 ${currentPath === "/" && currentHash === "#get-involved" ? "border-accent-600 dark:border-accent-400" : "border-transparent"}`}
                        >
                          Get Involved
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
                  <div className="mt-8">
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/friendsofchimborazopark"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform active:scale-90"
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-grey-700 transition hover:fill-primary-700 dark:fill-primary-400 dark:hover:fill-primary-300"
                        >
                          <title>Facebook</title>
                          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/friendsofchimborazopark/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform active:scale-90"
                      >
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-grey-700 transition hover:fill-primary-700 dark:fill-primary-400 dark:hover:fill-primary-300"
                        >
                          <title>Instagram</title>
                          <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </nav>
                <div className="w-72">
                  <h3 className="mb-3 font-display text-base font-semibold text-primary-700 dark:text-primary-400">
                    Upcoming Event
                  </h3>
                  <EventCardCondensed {...events[0]} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-grey-50 md:hidden dark:bg-grey-900"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex min-h-full flex-col p-6">
              {/* Close button */}
              <div className="mb-8 flex justify-end">
                <Button
                  onClick={() => setMenuOpen(false)}
                  variant="secondary"
                  className="flex h-12 w-12 items-center justify-center rounded-full border p-0 dark:border-grey-700 dark:bg-grey-800 dark:hover:bg-grey-700"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Logo and branding */}
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="mb-12 flex items-center justify-center gap-2 rounded-lg text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-100"
              >
                <div className="flex flex-col text-right font-display">
                  <span className="text-base leading-none font-semibold">Chimborazo</span>
                  <span className="text-xs leading-none text-primary-700 dark:text-primary-400">
                    Park Conservancy
                  </span>
                </div>
                <IconLogo className="h-10 w-10 shrink-0" />
                <div className="flex flex-col font-display">
                  <span className="text-base leading-none font-semibold">Friends of</span>
                  <span className="text-xs leading-none text-primary-700 dark:text-primary-400">
                    Chimborazo Park
                  </span>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="flex-1">
                <motion.ul className="space-y-6">
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link
                      to="/"
                      hash="get-involved"
                      onClick={() => setMenuOpen(false)}
                      className={`block rounded-lg font-display text-3xl transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:text-accent-400 ${currentPath === "/" && currentHash === "#get-involved" ? "text-accent-700 dark:text-accent-400" : "text-grey-800 dark:text-grey-100"}`}
                    >
                      Get Involved
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
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
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/friendsofchimborazopark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform active:scale-90"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-grey-700 transition hover:fill-primary-700 dark:fill-primary-400 dark:hover:fill-primary-300"
                    >
                      <title>Facebook</title>
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/friendsofchimborazopark/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform active:scale-90"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-grey-700 transition hover:fill-primary-700 dark:fill-primary-400 dark:hover:fill-primary-300"
                    >
                      <title>Instagram</title>
                      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-6">
                <Button
                  as="a"
                  variant="accent"
                  zeffy-form-link="https://www.zeffy.com/embed/donation-form/general-donation-125?modal=true"
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
