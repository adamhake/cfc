import { ExternalLink } from "lucide-react"
import { Button } from "@/components/Button/button"
import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image"

interface AmenitySectionProps {
  title: string
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
  description,
  details,
  link,
  images,
  imagePosition = "left",
  priority = false,
}: AmenitySectionProps) {
  // A still group of up to three photos instead of a timed slideshow: the
  // pictures are there to show what the place looks like, so they should all
  // be visible at once, with no timer to pause and no 8px dots to hit. The
  // first photo leads at full width; the next two share a row beneath it.
  const shownImages = images.slice(0, 3)
  const imageContent = (
    <div
      className={`order-1 grid w-full grid-cols-2 gap-3 lg:w-3/5 ${imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}
    >
      {shownImages.map((image, index) => {
        const isLead = index === 0
        // With exactly two photos, the second takes the full width too rather
        // than leaving an empty half-row.
        const isFullWidth = isLead || shownImages.length === 2
        return (
          <div
            key={image.asset?._id ?? `amenity-image-${index}`}
            className={`relative aspect-[3/2] overflow-hidden rounded-2xl bg-grey-200 dark:bg-primary-700 ${isFullWidth ? "col-span-2" : ""}`}
          >
            <SanityImage
              image={image}
              alt={image.alt || ""}
              className="absolute inset-0 h-full w-full object-cover"
              sizes={
                isFullWidth ? "(max-width: 1024px) 100vw, 720px" : "(max-width: 1024px) 50vw, 360px"
              }
              priority={priority && isLead}
              useHotspotPosition
            />
          </div>
        )
      })}
    </div>
  )

  const contentSection = (
    <div
      className={`order-2 flex w-full flex-col justify-center lg:w-2/5 ${imagePosition === "right" ? "lg:order-1" : "lg:order-2"}`}
    >
      <div className="space-y-4">
        <h3 className="font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>

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
