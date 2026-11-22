"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"
import EventStatusChip from "@/components/EventStatusChip/event-status-chip"
import { SanityImage } from "@/components/SanityImage/sanity-image"
import { useOptimisticList } from "@/hooks/use-optimistic-sanity"
import { sanityAttr } from "@/lib/sanity-data-attribute"
import type { SanityEvent } from "@/lib/sanity-types"
import { formatDateParts, isPastDate } from "@/utils/time"

const subscribeNoop = () => () => {}

interface EventListProps {
  events: SanityEvent[]
  /** Where the "hear about the next one" prompt points, e.g. the signup form */
  signupHref?: string
}

/**
 * A dated list of events for the homepage. The date is the fact people scan
 * for, so it leads each row as its own block instead of sitting in a card's
 * metadata footer under a large photo.
 *
 * Past vs. upcoming depends on today's date, which can't be read while the
 * page is prerendered, so both the status chips and the "nothing scheduled"
 * prompt are decided in the browser.
 */
export function EventList({ events, signupHref = "#get-involved" }: EventListProps) {
  const optimisticEvents = useOptimisticList(events)
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  )
  const nothingScheduled =
    hydrated &&
    optimisticEvents.length > 0 &&
    optimisticEvents.every((event) => isPastDate(event.date ?? ""))

  return (
    <div className="mt-10">
      {nothingScheduled && (
        <p className="mb-6 rounded-xl border border-accent-600/20 bg-accent-50 px-5 py-4 font-body text-grey-800 dark:border-accent-500/20 dark:bg-primary-950 dark:text-grey-200">
          Nothing is on the calendar right now.{" "}
          <a
            href={signupHref}
            className="font-semibold text-accent-800 underline decoration-accent-300 decoration-2 underline-offset-4 hover:decoration-accent-700 dark:text-accent-300 dark:decoration-accent-700 dark:hover:decoration-accent-300"
          >
            Get the newsletter
          </a>{" "}
          to hear about the next clean-up or planting.
        </p>
      )}

      <ul className="divide-y divide-primary-200 border-y border-primary-200 dark:divide-primary-700 dark:border-primary-700">
        {optimisticEvents.map((event) => {
          const { month, day, year } = formatDateParts(event.date ?? "")
          const doc = { _id: event._id, _type: event._type }
          return (
            <li key={event._id}>
              <Link
                href={`/events/${event.slug?.current}`}
                className="group grid grid-cols-[4.5rem_1fr] items-start gap-x-5 gap-y-3 rounded-lg py-6 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-4 focus-visible:outline-none sm:grid-cols-[5.5rem_1fr] md:grid-cols-[5.5rem_1fr_12rem] md:items-center md:gap-x-8"
              >
                {/* Date block. The year is kept: with a back catalogue of
                    past events, "Nov 8" alone is ambiguous. Lining figures,
                    because Vollkorn's default old-style "1" reads as "I". */}
                <div className="text-center font-display leading-none text-primary-800 lining-nums tabular-nums dark:text-primary-300">
                  <div className="text-sm font-semibold tracking-wide">{month}</div>
                  <div className="mt-1 text-4xl md:text-5xl">{day}</div>
                  <div className="mt-1 font-body text-sm text-grey-600 dark:text-grey-400">
                    {year}
                  </div>
                </div>

                <div className="min-w-0">
                  <h3
                    data-sanity={sanityAttr(doc, "title")}
                    className="text-balance font-display text-xl leading-snug text-grey-900 underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-accent-500 md:text-2xl dark:text-grey-100"
                  >
                    {event.title}
                  </h3>
                  <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-body text-sm text-grey-700 dark:text-grey-300">
                    {event.time && (
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Time</dt>
                        <dd>{event.time}</dd>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex gap-1.5">
                        <dt className="sr-only">Location</dt>
                        <dd>{event.location}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="mt-3">
                    <EventStatusChip eventDate={event.date ?? ""} />
                  </div>
                </div>

                {/* Photos only from md up: full-width images on every row
                    turned the phone layout back into a stack of cards. */}
                {event.heroImage && (
                  <div className="relative hidden aspect-[16/10] overflow-hidden rounded-xl bg-neutral-200 md:block dark:bg-primary-900">
                    <SanityImage
                      data-sanity={sanityAttr(doc, "heroImage")}
                      image={event.heroImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 192px"
                      maxWidth={768}
                      breakpoints={[192, 384, 576, 768]}
                      quality={70}
                      useHotspotPosition
                    />
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
