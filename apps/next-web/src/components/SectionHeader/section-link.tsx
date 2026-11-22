"use client"

import Link from "next/link"
import { trackCtaClick } from "@/integrations/posthog/events"

interface SectionLinkProps {
  href: string
  children: string
  /** Fires PostHog "cta_clicked" with this location, matching Button's tracking */
  trackingLocation: string
}

/**
 * The "see everything" link that sits on a section's heading row. It replaces
 * a centred outline button under each list: the same three buttons in a row
 * of sections set one template rhythm for the whole homepage, and a link on
 * the heading line reads as where the list continues rather than as a
 * separate call to action.
 */
export function SectionLink({ href, children, trackingLocation }: SectionLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => trackCtaClick(trackingLocation, children)}
      className="inline-flex min-h-11 items-center rounded-lg font-body text-base font-semibold text-accent-800 underline decoration-accent-300 decoration-2 underline-offset-4 transition-colors hover:decoration-accent-700 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-accent-300 dark:decoration-accent-700 dark:hover:decoration-accent-300"
    >
      {children}
    </Link>
  )
}
