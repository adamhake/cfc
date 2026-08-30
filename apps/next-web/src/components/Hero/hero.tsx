import { Image } from "@/components/OptimizedImage/optimized-image"
import { Button } from "../Button/button"
import { SanityImage, type SanityImageObject } from "../SanityImage/sanity-image"

interface HeroProps {
  heading?: string
  subheading?: string
  heroImage?: SanityImageObject
  // Legacy support for static images
  imageSrc?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  ctaText?: string
  ctaLink?: string
}

/**
 * Landing hero with a consistent solid image scrim and wave divider.
 */
export default function HeroSoftGradientDivider({
  heading = "Restoring Chimborazo Park for Our Community",
  subheading = "We're dedicated to preserving and beautifying this historic East End treasure—creating a safe, inclusive greenspace that honors the past and serves future generations.",
  heroImage,
  imageSrc = "/bike_sunset.webp",
  imageAlt = "Chimborazo Park landscape with historic views of Richmond's Church Hill neighborhood",
  imageWidth = 2000,
  imageHeight = 1262,
  ctaText = "Get Involved",
  ctaLink = "/get-involved",
}: HeroProps) {
  return (
    <div className="relative min-h-[440px] w-full overflow-visible sm:min-h-[520px] lg:min-h-[650px]">
      {/* Hero Image */}
      {heroImage ? (
        <SanityImage
          image={heroImage}
          alt={heroImage.alt || imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          priority={true}
          sizes="100vw"
          maxWidth={1920}
          breakpoints={[640, 768, 960, 1200, 1536, 1920]}
          quality={70}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="absolute inset-0 h-full w-full object-cover"
          priority
          sizes="100vw"
        />
      )}

      {/* Solid scrim keeps contrast consistent across changing photography. */}
      <div className="absolute inset-0 bg-primary-950/55 dark:bg-grey-950/65"></div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:items-end sm:px-6 lg:px-8">
        <div className="relative mb-8 w-full max-w-6xl space-y-6 sm:mb-12 lg:mb-24">
          <h1 className="font-display text-4xl text-primary-50 md:text-6xl dark:text-grey-50">
            {heading}
          </h1>
          <p className="font-body text-base font-medium text-primary-100 md:max-w-2xl md:text-lg dark:text-grey-100">
            {subheading}
          </p>
          <div className="pb-4">
            <Button
              variant="secondary"
              size="small"
              as="a"
              href={ctaLink}
              trackingLocation="hero"
              className="border-soft-blue-600 bg-grey-50 text-primary-900 hover:bg-soft-blue-50 dark:border-soft-blue-400 dark:bg-grey-50 dark:text-primary-900 dark:hover:bg-soft-blue-100"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>

      {/* James River wave divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
          aria-hidden="true"
        >
          {/* The flowing curve and blue line reference the James River overlook. */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-primary-900"
          />
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-soft-blue-600 dark:stroke-soft-blue-400"
            strokeWidth="7"
          />
        </svg>
      </div>
    </div>
  )
}
