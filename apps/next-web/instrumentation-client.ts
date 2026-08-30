import posthog from "posthog-js"
import { POSTHOG_HOST, POSTHOG_KEY, POSTHOG_UI_HOST } from "@/integrations/posthog/config"

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: POSTHOG_UI_HOST,
    person_profiles: "identified_only",

    // MUST stay "history_change", never `true`. The App Router navigates by
    // pushState, and posthog-js only hooks the History API for this exact
    // value — with `true` it captures the initial load and nothing after it,
    // so every soft navigation goes uncounted. `defaults` below would give us
    // "history_change" on its own, but an explicit key overrides the preset,
    // so the wrong value here silently wins.
    capture_pageview: "history_change",
    capture_pageleave: true,

    autocapture: true,
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: true,
    },
    enable_recording_console_log: true,
    defaults: "2026-01-30",
  })
}
