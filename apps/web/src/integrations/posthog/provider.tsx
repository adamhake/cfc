import { lazy, Suspense, useSyncExternalStore } from "react";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;

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
          api_host: "/ph",
          ui_host: "https://us.posthog.com",
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
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Render children directly during SSR and initial hydration to avoid
  // a tree mismatch (server renders no Suspense, client would add one).
  // After hydration, mount the lazy PostHog provider.
  if (!posthogKey || !mounted) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={children}>
      <LazyPostHogProvider>{children}</LazyPostHogProvider>
    </Suspense>
  );
}
