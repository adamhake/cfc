import Link from "next/link"
import { SanityImage } from "@/components/SanityImage/sanity-image"
import { UpdateEndDate } from "@/components/UpdateEndDate/update-end-date"
import { sanityAttr } from "@/lib/sanity-data-attribute"
import type { MaybeStega, SanityUpdate } from "@/lib/sanity-types"
import { cn } from "@/utils/cn"
import { formatDateString } from "@/utils/time"

export function UpdateCard({
  update,
  compact = false,
}: {
  update: MaybeStega<SanityUpdate>
  compact?: boolean
}) {
  if (!update.slug?.current) return null
  const hasImage = Boolean(update.heroImage?.asset?.url)
  const Heading = compact ? "h3" : "h2"

  return (
    <Link
      data-sanity={sanityAttr(update, "title")}
      href={`/updates/${update.slug.current}`}
      className="group block h-full overflow-hidden rounded-2xl border border-primary-200/70 bg-grey-50/70 transition-all hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600 dark:border-primary-700/30 dark:bg-primary-900/20"
    >
      <div className={cn("grid", !compact && hasImage && "md:grid-cols-[320px_minmax(0,1fr)]")}>
        {hasImage && update.heroImage && (
          <div className="relative min-h-[220px] overflow-hidden bg-neutral-200 dark:bg-primary-800/40">
            <SanityImage
              data-sanity={sanityAttr(update, "heroImageV2")}
              image={update.heroImage}
              alt={update.heroImage.alt || update.title || ""}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 400px"
              maxWidth={960}
              quality={72}
              useHotspotPosition
            />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {update.publishedAt && (
              <time
                dateTime={update.publishedAt}
                className="font-body text-grey-700 dark:text-grey-300"
              >
                {formatDateString(update.publishedAt, "short")}
              </time>
            )}
            {update.category?.title && (
              <span className="rounded-full bg-accent-100 px-3 py-1 font-body font-medium text-accent-800 dark:bg-accent-900/40 dark:text-accent-200">
                {update.category.title}
              </span>
            )}
            {update.featured && (
              <span className="rounded-full bg-heather-100 px-3 py-1 font-body font-medium text-heather-800 dark:bg-heather-900/40 dark:text-heather-200">
                Featured
              </span>
            )}
            {update.endDate && <UpdateEndDate endDate={update.endDate} />}
          </div>
          <Heading className="mt-5 font-display text-2xl leading-tight text-grey-900 dark:text-grey-100">
            {update.title}
          </Heading>
          <p className="mt-4 max-w-3xl font-body text-base leading-relaxed text-grey-700 dark:text-grey-300">
            {update.description}
          </p>
          <span className="mt-6 inline-flex font-body text-sm font-semibold text-accent-700 group-hover:text-accent-600 dark:text-accent-300">
            Read update
          </span>
        </div>
      </div>
    </Link>
  )
}
