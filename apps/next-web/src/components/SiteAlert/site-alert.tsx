"use client"

import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import { CircleAlert } from "lucide-react"
import { useEffect, useState } from "react"
import {
  getActiveSiteAlert,
  getConfiguredSiteAlert,
  type SiteAlertSettings,
} from "@/lib/site-alert"

interface SiteAlertProps {
  settings: SiteAlertSettings
}

const messageComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
  },
}

export function SiteAlert({ settings }: SiteAlertProps) {
  const [alert, setAlert] = useState(() =>
    settings.startsAt ? null : getConfiguredSiteAlert(settings),
  )

  useEffect(() => {
    const updateAlert = () => setAlert(getActiveSiteAlert(settings, new Date()))
    updateAlert()

    const now = Date.now()
    const maximumTimeout = 2_147_483_647
    const timers = [settings.startsAt, settings.expiresAt].flatMap((boundary) => {
      if (!boundary) return []

      const timestamp = Date.parse(boundary)
      if (!Number.isFinite(timestamp) || timestamp <= now) return []

      return [window.setTimeout(updateAlert, Math.min(timestamp - now + 50, maximumTimeout))]
    })

    return () =>
      timers.forEach((timer) => {
        window.clearTimeout(timer)
      })
  }, [settings])

  if (!alert) return null

  return (
    <section
      aria-labelledby="site-alert-label"
      className="w-full max-w-4xl rounded-xl border border-terra-300 bg-grey-50 px-4 py-4 text-grey-800 shadow-sm md:px-5 dark:border-terra-700 dark:bg-primary-950 dark:text-grey-100"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terra-100 text-terra-800 dark:bg-terra-900 dark:text-terra-200">
          <CircleAlert className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2
            id="site-alert-label"
            className="shrink-0 font-body text-xs font-bold tracking-[0.12em] text-terra-800 uppercase dark:text-terra-300"
          >
            {alert.label}
          </h2>
          <div className="mt-1 space-y-1 font-body text-sm leading-snug text-grey-700 dark:text-grey-200">
            {typeof alert.message === "string" ? (
              <p>{alert.message}</p>
            ) : (
              <PortableText
                value={alert.message as PortableTextBlock[]}
                components={messageComponents}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
