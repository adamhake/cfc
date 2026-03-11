"use client"

import posthog from "posthog-js"
import { useEffect } from "react"
import { Button } from "@/components/Button/button"

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js error boundary convention requires this function name
export default function Error({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    posthog.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border-2 border-grey-200 bg-white p-8 text-center dark:border-grey-700 dark:bg-grey-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl text-grey-900 dark:text-grey-100">
            Something went wrong
          </h1>
          <p className="font-body text-base text-grey-600 dark:text-grey-400">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>
        <Button onClick={reset} variant="primary" className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  )
}
