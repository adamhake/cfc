import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import EventStatusChip from "@/components/EventStatusChip/event-status-chip"
import type { SanityEvent } from "@/lib/sanity-types"
import { formatDateString } from "@/utils/time"
import Chip from "../Chip/chip"
import { SanityImage } from "../SanityImage/sanity-image"

const DEFAULT_EVENT_IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 576px"
const DEFAULT_EVENT_IMAGE_MAX_WIDTH = 1024
const DEFAULT_EVENT_IMAGE_BREAKPOINTS = [320, 480, 576, 640, 768, 896, 1024]
const DEFAULT_EVENT_IMAGE_QUALITY = 70

interface EventProps extends SanityEvent {
  isPast?: boolean
  layoutFeatured?: boolean
  imageSizes?: string
  imageMaxWidth?: number
  imageBreakpoints?: number[]
  imageQuality?: number
}

export default function Event({
  title,
  slug,
  description,
  date,
  time,
  location,
  heroImage,
  isPast,
  layoutFeatured = false,
  imageSizes = DEFAULT_EVENT_IMAGE_SIZES,
  imageMaxWidth = DEFAULT_EVENT_IMAGE_MAX_WIDTH,
  imageBreakpoints = DEFAULT_EVENT_IMAGE_BREAKPOINTS,
  imageQuality = DEFAULT_EVENT_IMAGE_QUALITY,
}: EventProps) {
  const fmtDate = formatDateString(date ?? "", "short")

  return (
    <Link
      href={`/events/${slug?.current}`}
      className={`group h-full cursor-pointer overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-md active:scale-[0.99] dark:border-primary-700 dark:bg-primary-950 dark:hover:border-accent-500 ${layoutFeatured ? "grid md:grid-cols-[1.15fr_0.85fr]" : "flex flex-col"}`}
    >
      <div
        className={`relative overflow-hidden bg-neutral-200 dark:bg-primary-900 ${layoutFeatured ? "aspect-[16/10] md:aspect-auto md:min-h-80" : "aspect-[16/10]"}`}
      >
        {heroImage && (
          <SanityImage
            image={heroImage}
            alt={heroImage.alt ?? undefined}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={imageSizes}
            maxWidth={imageMaxWidth}
            breakpoints={imageBreakpoints}
            quality={imageQuality}
            useHotspotPosition
          />
        )}
        <div className="absolute top-4 left-4">
          {/* Whether an event is past depends on the current date, which can't be
            read during prerendering — it would freeze into the static shell.
            When the caller hasn't already decided, defer to the client chip so
            the badge is correct on every render rather than as of build time. */}
          {isPast === undefined ? (
            <EventStatusChip eventDate={date ?? ""} />
          ) : (
            <Chip variant={isPast ? "past" : "upcoming"} />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="text-balance font-display text-2xl leading-tight text-primary-900 dark:text-grey-100">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 font-body text-base leading-relaxed text-grey-700 dark:text-grey-300">
          {description}
        </p>
        <div className="mt-6 flex flex-col gap-2 border-t border-primary-200 pt-4 dark:border-primary-700">
          <div className="flex gap-2">
            <Calendar className="h-5 w-5 shrink-0 stroke-accent-700 dark:stroke-accent-400" />
            <span className="font-body text-sm font-medium text-grey-700 dark:text-grey-300">
              {fmtDate}
            </span>
          </div>
          <div className="flex gap-2">
            <Clock className="h-5 w-5 shrink-0 stroke-accent-700 dark:stroke-accent-400" />
            <span className="font-body text-sm font-medium text-grey-700 dark:text-grey-300">
              {time}
            </span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 shrink-0 stroke-accent-700 dark:stroke-accent-400" />
            <span className="font-body text-sm font-medium text-grey-700 dark:text-grey-300">
              {location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
