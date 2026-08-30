"use client"

import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react"
import { PortableText } from "@portabletext/react"
import { BookOpenText, HeartHandshake, LeafyGreen, type LucideIcon, Trees } from "lucide-react"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { cn } from "@/utils/cn"

type Pillar = "restoration" | "preservation" | "connection" | "recreation"

interface VisionProps {
  title: string
  description?: string | string[]
  content?: PortableTextBlock[]
  pillar: Pillar
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
}

interface PillarStyle {
  Icon: LucideIcon
  iconBackground: string
  iconColor: string
  labelColor: string
  numeralColor: string
  ordinal: string
}

const pillarStyles: Record<Pillar, PillarStyle> = {
  restoration: {
    Icon: LeafyGreen,
    iconBackground: "bg-primary-100 dark:bg-primary-800",
    iconColor: "stroke-primary-800 dark:stroke-primary-200",
    labelColor: "text-primary-700 dark:text-primary-300",
    numeralColor: "text-primary-700/10 dark:text-primary-200/10",
    ordinal: "01",
  },
  recreation: {
    Icon: Trees,
    iconBackground: "bg-navy-100 dark:bg-navy-800",
    iconColor: "stroke-navy-800 dark:stroke-navy-200",
    labelColor: "text-navy-700 dark:text-navy-300",
    numeralColor: "text-navy-700/10 dark:text-navy-200/10",
    ordinal: "02",
  },
  connection: {
    Icon: HeartHandshake,
    iconBackground: "bg-heather-100 dark:bg-heather-800",
    iconColor: "stroke-heather-900 dark:stroke-heather-200",
    labelColor: "text-heather-700 dark:text-heather-300",
    numeralColor: "text-heather-700/10 dark:text-heather-200/10",
    ordinal: "03",
  },
  preservation: {
    Icon: BookOpenText,
    iconBackground: "bg-terra-100 dark:bg-terra-800",
    iconColor: "stroke-terra-800 dark:stroke-terra-200",
    labelColor: "text-terra-700 dark:text-terra-300",
    numeralColor: "text-terra-700/10 dark:text-terra-200/10",
    ordinal: "04",
  },
}

export default function Vision({ title, description, content, pillar }: VisionProps) {
  const prefersReducedMotion = useReducedMotion()
  const { Icon, iconBackground, iconColor, labelColor, numeralColor, ordinal } =
    pillarStyles[pillar]

  return (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-neutral-200",
        "bg-neutral-50 p-8 lg:p-10",
        "dark:border-primary-700 dark:bg-primary-950",
        !prefersReducedMotion &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-primary-600",
      )}
    >
      <div className="relative">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className={cn("inline-flex rounded-full p-3", iconBackground)}>
            <Icon className={cn("h-8 w-8 md:h-10 md:w-10", iconColor)} aria-hidden="true" />
          </div>
          <span
            className={cn("select-none font-display text-6xl leading-none", numeralColor)}
            aria-hidden="true"
          >
            {ordinal}
          </span>
        </div>

        <p
          className={cn(
            "mb-2 font-body text-xs font-semibold tracking-[0.14em] uppercase",
            labelColor,
          )}
        >
          Pillar {ordinal}
        </p>
        <h3 className="mb-4 font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>

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
