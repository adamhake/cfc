import { ExternalLink } from "lucide-react"
import { cloneElement, isValidElement } from "react"
import { Button } from "@/components/Button/button"
import SanityImageCarousel, {
  type SanityImageObject,
} from "@/components/SanityImageCarousel/sanity-image-carousel"

interface AmenitySectionProps {
  title: string
  icon: React.ReactElement
  description: string
  details?: string[]
  link?: {
    text: string
    url: string
  }
  images: SanityImageObject[]
  /**
   * Whether to show the image on the left (default) or right side
   */
  imagePosition?: "left" | "right"
  /**
   * Whether this is the first section (for priority image loading)
   */
  priority?: boolean
}

export default function AmenitySection({
  title,
  icon,
  description,
  details,
  link,
  images,
  imagePosition = "left",
  priority = false,
}: AmenitySectionProps) {
  // Apply consistent icon styling
  const styledIcon = isValidElement(icon)
    ? cloneElement(icon, {
        className: "h-7 w-7 stroke-accent-600 dark:stroke-accent-400",
      } as React.HTMLAttributes<HTMLElement>)
    : icon

  const imageContent = (
    <div
      className={`order-1 w-full lg:w-3/5 ${imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}
    >
      <SanityImageCarousel
        images={images}
        aspectRatio="3/2"
        showNavigation={true}
        showDots={true}
        showCaptions={false}
        loop={true}
        autoPlay
        autoPlayInterval={5000}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 720px"
        priority={priority}
      />
    </div>
  )

  const contentSection = (
    <div
      className={`order-2 flex w-full flex-col justify-center lg:w-2/5 ${imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}
    >
      <div className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-center gap-3">
          <div
            className="inline-flex shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/15"
            role="img"
            aria-label={`${title} icon`}
          >
            {styledIcon}
          </div>
          <h3 className="font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
          {description}
        </p>

        {/* Details */}
        {details && details.length > 0 && (
          <ul className="space-y-2 font-body text-grey-700 dark:text-grey-300">
            {details.map((detail) => (
              <li key={detail} className="flex items-start gap-2">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600 dark:bg-accent-400"
                  aria-hidden="true"
                ></span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Link */}
        {link && (
          <div className="pt-2">
            <Button
              as="a"
              href={link.url}
              variant="outline"
              size="small"
              endIcon={<ExternalLink className="h-4 w-4" />}
              trackingLocation="amenity"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      {imageContent}
      {contentSection}
    </div>
  )
}
