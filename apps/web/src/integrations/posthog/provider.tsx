import { lazy, Suspense } from "react";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * Lazy-load the actual PostHog provider so posthog-js is never imported
 * during SSR/prerendering (it accesses browser-only APIs at module scope).
 */
const LazyPostHogProvider = lazy(() =>
  import("@posthog/react").then(({ PostHogProvider }) => ({
    default: ({ children }: { children: React.ReactNode }) => (
      <PostHogProvider
        apiKey={posthogKey!}
        options={{
          api_host: posthogHost,
          person_profiles: "identified_only",

          // Web Analytics
          capture_pageview: true,
          capture_pageleave: true,
          autocapture: true,

          // Error Tracking
          capture_exceptions: {
            capture_unhandled_errors: true,
            capture_unhandled_rejections: true,
            capture_console_errors: true,
          },

          // Session Replay - include console logs in recordings
          enable_recording_console_log: true,
        }}
      >
        {children}
      </PostHogProvider>
    ),
  })),
);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!posthogKey || typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={children}>
      <LazyPostHogProvider>{children}</LazyPostHogProvider>
    </Suspense>
  );
}
