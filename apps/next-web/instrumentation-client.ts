import posthog from "posthog-js"

if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "https://d.chimborazoparkconservancy.org",
    ui_host: "https://us.posthog.com",
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
