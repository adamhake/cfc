import { PostHogProvider as PHProvider } from "@posthog/react";

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return (
    <PHProvider
      apiKey={posthogKey}
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
    </PHProvider>
  );
}
