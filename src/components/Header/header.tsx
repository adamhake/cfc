import IconLogo from "@/IconLogo/icon-logo";
import { useClickAway, useMediaQuery } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button/button";
import { Link } from "@tanstack/react-router";

export default function Header() {
  const isMoblie = useMediaQuery("screen and (max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useClickAway<HTMLElement>(() => {
    setMenuOpen(false);
  });

  if (isMoblie) {
    return (
      <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
        <header className="flex w-full items-center justify-between rounded-2xl">
          <Link
            to="/"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-grey-100 bg-grey-50/75 backdrop-blur backdrop-filter"
          >
            <IconLogo className="h-7 w-7" />
          </Link>
          <button
            type="button"
            className="cursor-pointer rounded-xl border border-grey-200 bg-grey-100/75 px-4 py-2 font-body text-sm font-semibold text-grey-800 uppercase backdrop-blur backdrop-filter transition"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 left-4 z-20 flex flex-row items-center justify-center">
      <header
        ref={ref}
        className="w-full max-w-6xl rounded-2xl border border-grey-100 bg-grey-50/75 p-3 backdrop-blur backdrop-filter transition dark:bg-grey-100"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <button
            onClick={() => {
              setMenuOpen((s) => !s);
            }}
            type="button"
            className="flex w-28 cursor-pointer items-center gap-2 rounded-xl border border-green-800 px-4 py-2 font-body text-sm font-semibold text-green-800 uppercase transition hover:border-green-700 hover:bg-green-700 hover:text-grey-100"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>{menuOpen ? "Close" : "Menu"}</span>
          </button>
          <div className="flex items-center gap-2 text-green-800">
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
          <div>
            <button
              type="button"
              className="w-28 cursor-pointer rounded-xl border border-green-800 bg-green-700 px-4 py-2 text-center font-body text-sm font-semibold text-white uppercase transition hover:border-green-700 hover:bg-green-700 hover:text-grey-100"
            >
              Donate
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              key="mainMenu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
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
    </div>
  );
}
