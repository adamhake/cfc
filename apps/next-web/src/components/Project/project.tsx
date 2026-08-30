import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import type { SanityProject } from "@/lib/sanity-types"
import { formatDateString } from "@/utils/time"
import Chip from "../Chip/chip"
import { SanityImage } from "../SanityImage/sanity-image"

const PROJECT_IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 576px"

export interface ProjectProps {
  project: SanityProject
}

export default function Project({ project }: ProjectProps) {
  const {
    title,
    slug,
    description,
    heroImage,
    status,
    startDate,
    startDateOverride,
    category,
    location,
  } = project

  // Skip rendering if project has no slug
  if (!slug?.current) return null

  // Use override text if provided, otherwise format the date
  const fmtDate = startDateOverride || formatDateString(startDate ?? "", "short")

  return (
    <Link
      href={`/projects/${slug.current}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-md active:scale-[0.99] dark:border-primary-700 dark:bg-primary-950 dark:hover:border-accent-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-primary-900">
        {heroImage && (
          <SanityImage
            image={heroImage}
            alt={heroImage.alt ?? title ?? ""}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={PROJECT_IMAGE_SIZES}
            maxWidth={1024}
            breakpoints={[320, 480, 576, 640, 768, 896, 1024]}
            quality={70}
            useHotspotPosition
          />
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {status && <Chip variant={status} />}
          {category && <Chip variant={category} />}
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
              Started {fmtDate}
            </span>
          </div>
          {location && (
            <div className="flex gap-2">
              <MapPin className="h-5 w-5 shrink-0 stroke-accent-700 dark:stroke-accent-400" />
              <span className="font-body text-sm font-medium text-grey-700 dark:text-grey-300">
                {location}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
