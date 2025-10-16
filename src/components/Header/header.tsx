import IconLogo from "@/IconLogo/icon-logo";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button/button";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useClickAway<HTMLElement>(() => {
    setMenuOpen(false);
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

  return (
    <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
      <header
        ref={ref}
        className="w-full max-w-6xl rounded-2xl transition md:border md:border-grey-100 md:bg-grey-50/75 md:p-3 md:backdrop-blur md:backdrop-filter dark:md:bg-grey-100"
      >
        <div className="flex w-full items-center justify-between gap-2">
          {/* Menu button - Desktop only */}
          <button
            onClick={() => {
              setMenuOpen((s) => !s);
            }}
            type="button"
            className="hidden w-28 cursor-pointer items-center gap-2 rounded-xl border border-green-800 px-4 py-2 font-body text-sm font-semibold text-green-800 uppercase transition hover:border-green-700 hover:bg-green-700 hover:text-grey-100 md:flex"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>

          {/* Logo - Mobile only */}
          <Link
            to="/"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-100 bg-grey-50/75 backdrop-blur backdrop-filter md:hidden"
          >
            <IconLogo className="h-7 w-7" />
          </Link>

          {/* Center branding - Desktop only */}
          <div className="hidden items-center gap-2 text-green-800 md:flex">
            <div className="flex flex-col font-display">
              <span className="text-xl leading-none">Chimborazo</span>
              <span className="text-sm leading-none">Park Conservancy</span>
            </div>
            <Link to="/">
              <IconLogo className="mx-3 h-10 w-10" />
            </Link>
            <div className="flex flex-col font-display">
              <span className="text-xl leading-none">Friends of</span>
              <span className="text-sm leading-none">Chimborazo Park</span>
            </div>
          </div>

          {/* Donate/Menu button - Mobile shows menu, Desktop shows donate */}
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            className="cursor-pointer rounded-xl border px-4 py-2 text-center font-body text-sm font-semibold uppercase transition md:w-28 md:border-green-800 md:bg-green-700 md:text-white md:hover:border-green-700 md:hover:bg-green-700 md:hover:text-grey-100 border-grey-200 bg-grey-100/75 text-grey-800 backdrop-blur backdrop-filter"
          >
            <span className="md:inline hidden">Donate</span>
            <Menu className="h-6 w-6 md:hidden" />
          </button>
        </div>

        {/* Dropdown menu - Desktop only */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mainMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
              className="hidden md:block"
            >
              <div className="mt-4 flex w-full justify-between border-t border-grey-300 p-6 pt-8 transition">
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/"
                        className="font-body font-medium text-grey-800 transition hover:border-b-2 hover:border-b-green-700"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <a
                        href=""
                        className="font-body font-medium text-grey-800 transition hover:border-b-2 hover:border-b-green-700"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="font-body font-medium text-grey-800 transition hover:border-b-2 hover:border-b-green-700"
                      >
                        Events
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="font-body font-medium text-grey-800 transition hover:border-b-2 hover:border-b-green-700"
                      >
                        Get Involved
                      </a>
                    </li>
                  </ul>
                </nav>
                <div>
                  <div className="flex max-w-58 flex-col">
                    <div className="relative mt-2 mb-2 overflow-hidden rounded-2xl p-6">
                      <div className="relative z-10 flex flex-col items-center justify-center font-body text-green-100">
                        <Calendar className="mb-2 h-8 w-8 stroke-green-100" />
                        <span className="text-xl font-medium">November 6</span>
                      </div>
                      <img
                        src="/chimbo_arial.webp"
                        alt="Quote Icon"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute top-0 left-0 h-full w-full bg-green-800/60"></div>
                    </div>
                    <h2 className="mb-2 font-display text-lg text-grey-800">
                      Fall Cleanup and Tree Planting
                    </h2>
                    <Button variant="outline" size="small">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Full-screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-grey-50 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="flex h-full flex-col p-6">
              {/* Header with logo and close button */}
              <div className="flex items-start justify-between mb-12">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-green-800"
                >
                  <IconLogo className="h-12 w-12 flex-shrink-0" />
                  <div className="flex flex-col font-display">
                    <span className="text-base font-medium leading-tight">Chimborazo</span>
                    <span className="text-xs leading-tight">Park Conservancy</span>
                    <div className="my-2 h-px w-full bg-green-800/30"></div>
                    <span className="text-base font-medium leading-tight">Friends of</span>
                    <span className="text-xs leading-tight">Chimborazo Park</span>
                  </div>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-200 bg-white text-grey-800 transition hover:bg-grey-100"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1">
                <ul className="space-y-6">
                  <li>
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-3xl text-grey-800 transition hover:text-green-700"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <a
                      href=""
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-3xl text-grey-800 transition hover:text-green-700"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href=""
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-3xl text-grey-800 transition hover:text-green-700"
                    >
                      Events
                    </a>
                  </li>
                  <li>
                    <a
                      href=""
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-3xl text-grey-800 transition hover:text-green-700"
                    >
                      Get Involved
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/media"
                      onClick={() => setMenuOpen(false)}
                      className="block font-display text-3xl text-grey-800 transition hover:text-green-700"
                    >
                      Media
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Footer CTA */}
              <div className="mt-8 space-y-4">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-xl border border-green-800 bg-green-700 px-6 py-4 text-center font-body text-base font-semibold text-white uppercase transition active:bg-green-800"
                >
                  Donate
                </button>
                <p className="text-center font-body text-sm text-grey-600">
                  Support Chimborazo Park
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
