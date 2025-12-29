import { useLocation } from "@tanstack/react-router";

/**
 * Button to exit preview mode.
 * Displayed when viewing the site with draft content enabled.
 */
export function DisablePreview() {
  const location = useLocation();

  // Build the disable URL with redirect back to current page
  const disableUrl = `/api/draft/disable?redirect=${encodeURIComponent(location.pathname)}`;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <a
        href={disableUrl}
        className="inline-flex items-center gap-2 rounded-lg bg-grey-900 px-4 py-2 font-body text-sm font-medium text-white shadow-lg transition-colors hover:bg-grey-800 focus-visible:ring-2 focus-visible:ring-grey-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-grey-100 dark:text-grey-900 dark:hover:bg-grey-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        Exit Preview
      </a>
    </div>
  );
}
