"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { JsonLd } from "@/components/JsonLd/json-ld"
import SectionHeader from "@/components/SectionHeader/section-header"
import { generateFAQStructuredData } from "@/utils/seo"

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
  title?: string
  className?: string
}

/**
 * FAQ accordion. Each question is its own heading (so screen-reader users can
 * move between questions by heading) with the toggle button inside it. Closed
 * answers use `hidden="until-found"`, so find-in-page can still reach them and
 * opens the item when it does. Items open independently.
 */
export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className,
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<ReadonlySet<number>>(() => new Set())
  const idPrefix = useId()

  const structuredData = generateFAQStructuredData(faqs)

  const setItemOpen = (index: number, open: boolean) => {
    setOpenItems((prev) => {
      if (prev.has(index) === open) return prev
      const next = new Set(prev)
      if (open) {
        next.add(index)
      } else {
        next.delete(index)
      }
      return next
    })
  }

  return (
    <div className={className}>
      <JsonLd data={structuredData} />
      <SectionHeader title={title} size="large" />
      <div className="mt-8 space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.question}
            faq={faq}
            panelId={`${idPrefix}-faq-panel-${index}`}
            isOpen={openItems.has(index)}
            onOpenChange={(open) => setItemOpen(index, open)}
          />
        ))}
      </div>
    </div>
  )
}

interface FAQItemProps {
  faq: FAQ
  panelId: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function FAQItem({ faq, panelId, isOpen, onOpenChange }: FAQItemProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // React only knows boolean `hidden`, so it renders `hidden=""` (server and
  // client); upgrade it to "until-found" before paint. Browsers without
  // support treat the value as plain `hidden`.
  useLayoutEffect(() => {
    if (!isOpen) {
      panelRef.current?.setAttribute("hidden", "until-found")
    }
  }, [isOpen])

  // Find-in-page reveals the panel itself; mirror that into state so the
  // button's aria-expanded and chevron agree with what's on screen.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const handleBeforeMatch = () => onOpenChange(true)
    panel.addEventListener("beforematch", handleBeforeMatch)
    return () => panel.removeEventListener("beforematch", handleBeforeMatch)
  }, [onOpenChange])

  return (
    <div className="overflow-hidden rounded-xl border border-grey-200 bg-white dark:border-primary-700 dark:bg-primary-950">
      <h3 className="font-display text-base font-semibold text-grey-900 md:text-lg dark:text-grey-100">
        <button
          type="button"
          onClick={() => onOpenChange(!isOpen)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-grey-50 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:outline-none focus-visible:ring-inset dark:hover:bg-primary-900"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          {faq.question}
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 stroke-grey-500 transition-transform duration-200 dark:stroke-grey-400 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        ref={panelRef}
        hidden={!isOpen}
        className="border-t border-grey-100 px-6 py-5 dark:border-primary-800"
      >
        <p className="font-body leading-relaxed text-grey-700 dark:text-grey-300">{faq.answer}</p>
      </div>
    </div>
  )
}
