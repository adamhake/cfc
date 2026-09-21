"use client"

import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import { BookOpenText, HeartHandshake, LeafyGreen, type LucideIcon, Trees } from "lucide-react"
import type { MaybeStega } from "@/lib/sanity-types"
import { cleanEnum } from "@/lib/stega"
import { cn } from "@/utils/cn"

type Pillar = "restoration" | "preservation" | "connection" | "recreation"

interface VisionProps {
  title: string
  description?: string | string[]
  content?: PortableTextBlock[]
  pillar: MaybeStega<Pillar>
  /**
   * Click-to-edit target for this array item. Also what lets an editor drag the
   * pillars into a new order from inside the preview.
   */
  dataSanity?: string
}

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  // Pillar descriptions use the homepage block config, which allows links.
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined
      if (!href) return <>{children}</>
      const isExternal = href.startsWith("http")
      return (
        <a
          href={href}
          className="underline decoration-primary-600/50 underline-offset-2 hover:decoration-primary-600"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      )
    },
  },
}

/**
 * The four pillars are parallel, not sequential — restoration isn't a step
 * before preservation — so they carry no ordinal.
 *
 * They also carry no card. A bordered, rounded, near-page-colored box around
 * each one equalised the heights (leaving voids under the shorter entries) and
 * left the pillar's colour doing nothing but tinting a small icon.
 *
 * The tinted circular icon well stays, because it is a shape the site already
 * uses elsewhere — SiteAlert and the amenities Location/Hours cells both set
 * their icon in one. Carrying the pillar colour in that well keeps these in
 * the site's existing vocabulary instead of introducing a new marker.
 */
interface PillarStyle {
  Icon: LucideIcon
  iconBackground: string
  iconColor: string
}

const pillarStyles: Record<Pillar, PillarStyle> = {
  restoration: {
    Icon: LeafyGreen,
    iconBackground: "bg-primary-700/10 dark:bg-primary-400/15",
    iconColor: "stroke-primary-700 dark:stroke-primary-300",
  },
  recreation: {
    Icon: Trees,
    iconBackground: "bg-soft-blue-600/10 dark:bg-soft-blue-300/15",
    iconColor: "stroke-soft-blue-700 dark:stroke-soft-blue-300",
  },
  connection: {
    Icon: HeartHandshake,
    iconBackground: "bg-heather-600/12 dark:bg-heather-300/15",
    iconColor: "stroke-heather-700 dark:stroke-heather-300",
  },
  preservation: {
    Icon: BookOpenText,
    iconBackground: "bg-terra-600/12 dark:bg-terra-300/15",
    iconColor: "stroke-terra-700 dark:stroke-terra-300",
  },
}

export default function Vision({ title, description, content, pillar, dataSanity }: VisionProps) {
  // `pillar` comes from Sanity, so in draft mode it carries stega characters
  // and would miss the lookup below. Fall back rather than crash if an unknown
  // pillar value ever reaches here.
  const { Icon, iconBackground, iconColor } =
    pillarStyles[cleanEnum(pillar) ?? "restoration"] ?? pillarStyles.restoration

  return (
    <div data-sanity={dataSanity} className="relative">
      <div className="flex items-center gap-4">
        <span className={cn("inline-flex shrink-0 rounded-full p-3.5", iconBackground)}>
          <Icon className={cn("h-7 w-7 md:h-8 md:w-8", iconColor)} aria-hidden="true" />
        </span>
        <h3 className="font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>
      </div>

      <div className="mt-5 max-w-prose">
        {content ? (
          <PortableText value={content} components={descriptionComponents} />
        ) : Array.isArray(description) ? (
          <ul className="list-disc space-y-2 pl-5 font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            {description.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
