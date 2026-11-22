"use client"

import { useState } from "react"

export default function DonateFormClient() {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  return (
    // min-h reserves the form's height up front so nothing jumps when Zeffy
    // loads. While it loads, a quiet outline of a form on the page's own
    // surface stands in, instead of an empty grey box with a spinner.
    <div className="relative min-h-[700px] w-full">
      {!isIframeLoaded && (
        <div
          role="status"
          className="absolute inset-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-6 md:p-8 dark:border-primary-700 dark:bg-primary-950"
        >
          <span className="sr-only">Loading the donation form…</span>
          <div aria-hidden="true" className="space-y-5 motion-safe:animate-pulse">
            <div className="h-7 w-2/3 rounded-lg bg-neutral-200 dark:bg-primary-800" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
              <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
              <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
            </div>
            <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
            <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
            <div className="h-12 rounded-xl bg-neutral-200 dark:bg-primary-800" />
            <div className="h-12 w-1/2 rounded-xl bg-neutral-300 dark:bg-primary-700" />
          </div>
        </div>
      )}
      <iframe
        title="Donation form powered by Zeffy"
        style={{
          position: "absolute",
          border: 0,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "100%",
          height: "100%",
          opacity: isIframeLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        src="https://www.zeffy.com/embed/donation-form/general-donation-125"
        allow="payment"
        onLoad={() => setIsIframeLoaded(true)}
      />
    </div>
  )
}
