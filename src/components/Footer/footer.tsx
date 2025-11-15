import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle/theme-toggle";

export default function Footer() {
  return (
    <footer className="relative bg-grey-50 pt-24 pb-8 text-grey-800 dark:bg-primary-900 dark:text-grey-100">
      {/* Curved divider at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full rotate-180 lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-green-900"
          />
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-accent-500 dark:stroke-accent-500"
            strokeWidth="7"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        {/* Main footer content */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* About section */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
              Chimborazo Park Conservancy
            </h3>
            <p className="font-body text-sm leading-relaxed text-grey-700 dark:text-grey-300">
              A 501(c)(3) non-profit dedicated to preserving and enhancing Chimborazo Park in
              Richmond, VA's Church Hill neighborhood.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
              >
                Home
              </Link>
              <Link
                to="/amenities"
                className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
              >
                Amenities
              </Link>
              <Link
                to="/events"
                className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
              >
                Events
              </Link>
              <Link
                to="/"
                hash="get-involved"
                className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
              >
                Get Involved
              </Link>
              <Link
                to="/media"
                className="font-body text-sm text-grey-700 transition hover:text-accent-700 dark:text-grey-300 dark:hover:text-accent-400"
              >
                Media
              </Link>
            </nav>
          </div>

          {/* Connect section */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-primary-800 dark:text-primary-400">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/friendsofchimborazopark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-600 transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-400 dark:hover:text-accent-400"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.instagram.com/friendsofchimborazopark/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-600 transition hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-grey-400 dark:hover:text-accent-400"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" strokeWidth={1.5} />
              </a>
            </div>
            <div className="space-y-2 pt-4">
              <ThemeToggle variant="button" showLabel={true} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-grey-200 pt-8 md:flex-row dark:border-primary-700">
          <p className="font-body text-sm text-grey-600 dark:text-grey-400">
            &copy; {new Date().getFullYear()} Chimborazo Park Conservancy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy-policy"
              className="font-body text-sm text-grey-600 transition hover:text-accent-700 dark:text-grey-400 dark:hover:text-accent-400"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
