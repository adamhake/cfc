import { Image } from "@/components/OptimizedImage/optimized-image";
import { SanityImage, type SanityImageObject } from "../SanityImage/sanity-image";
import { Button } from "../Button/button";

interface HeroProps {
  heading?: string;
  subheading?: string;
  heroImage?: SanityImageObject;
  // Legacy support for static images
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Hero component with soft gradient overlay and wave divider
 * Combines the soft gradient layers with a very subtle, gentle wave transition
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
          maxWidth={2000}
          breakpoints={[640, 1024, 1536, 2000]}
          quality={85}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="absolute inset-0 h-full w-full object-cover"
          layout="constrained"
          priority
          sizes="100vw"
          breakpoints={[640, 1024, 1536, 2000]}
        />
      )}

      {/* Soft flowing gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/60 via-primary-800/40 to-primary-700/20 dark:from-grey-900/70 dark:via-grey-900/50 dark:to-grey-800/30"></div>

      {/* Radial glow for depth */}
      <div className="bg-gradient-radial absolute inset-0 from-transparent via-transparent to-primary-900/40 dark:to-grey-900/50"></div>

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
            <Button variant="secondary" size="small" as="a" href={ctaLink} trackingLocation="hero">
              {ctaText}
            </Button>
          </div>
        </div>
      </div>

      {/* Organic wave divider - more pronounced */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* Flowing natural curve - like rolling hills */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-primary-900"
          />
          {/* Accent color stroke following the curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-accent-500 dark:stroke-accent-500"
            strokeWidth="7"
          />
        </svg>
      </div>
    </div>
  );
}
