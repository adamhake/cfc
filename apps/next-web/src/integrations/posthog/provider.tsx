"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

/**
 * PostHog initializer component - renders nothing, just inits PostHog on mount.
 * Placed inside the app tree but doesn't wrap children to avoid blocking prerender.
 */
export function PostHogInit() {
  useEffect(() => {
    if (posthogKey && typeof window !== "undefined" && !posthog.__loaded) {
      posthog.init(posthogKey, {
        api_host: "/ph",
        ui_host: "https://us.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: true,
        },
        enable_recording_console_log: true,
      });
    }
  }, []);

  return null;
}
