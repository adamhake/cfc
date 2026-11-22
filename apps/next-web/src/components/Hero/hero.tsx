import { Image } from "@/components/OptimizedImage/optimized-image"
import { WaveDivider } from "@/components/WaveDivider/wave-divider"
import { Button } from "../Button/button"
import { SanityImage, type SanityImageObject } from "../SanityImage/sanity-image"

/**
 * The photo is object-cover in a box whose height, not width, drives the crop.
 * On a portrait phone a 375px-wide hero ~585px tall shows a slice of an image
 * that must be ~925px wide to fill it, so `100vw` fetched a file about half
 * the size needed and the browser upscaled it. These figures assume the
 * landscape (~1.6:1) photography the hero is chosen for.
 */
const HERO_IMAGE_SIZES = "(max-width: 640px) 250vw, (max-width: 1024px) 130vw, 100vw"

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
    // Most of the first screen belongs to the photograph: the hero used to stop
    // at 650px on a 900px screen and let the next section's alert box poke up
    // into it. The px floors keep short or landscape phones from squashing it.
    <div className="relative min-h-[max(440px,72svh)] w-full overflow-visible sm:min-h-[max(520px,75svh)] lg:min-h-[max(650px,85svh)]">
      {/* Hero Image */}
      {heroImage ? (
        <SanityImage
          image={heroImage}
          alt={heroImage.alt || imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          priority={true}
          sizes={HERO_IMAGE_SIZES}
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
          loading="eager"
          sizes={HERO_IMAGE_SIZES}
        />
      )}

      {/* Solid scrim keeps contrast consistent across changing photography. */}
      <div className="absolute inset-0 bg-primary-950/55 dark:bg-grey-950/65"></div>

      {/* Content sits at the bottom at every width. Centering it on mobile
          pushed the h1 up behind the floating logo and hamburger. */}
      <div className="absolute inset-0 z-10 flex items-end justify-center px-4 pt-24 sm:px-6 lg:px-8">
        <div className="relative mb-10 w-full max-w-6xl space-y-5 sm:mb-12 sm:space-y-6 lg:mb-24">
          <h1 className="font-display text-4xl text-primary-50 md:text-6xl dark:text-grey-50">
            {heading}
          </h1>
          <p className="font-body text-base font-medium text-primary-100 md:max-w-2xl md:text-lg dark:text-grey-100">
            {subheading}
          </p>
          {/* Donate is the one filled button on the page; the editor-set CTA
              is the outline secondary, drawn light so it holds on the photo. */}
          <div className="flex flex-wrap gap-3 pb-4">
            <Button variant="accent" size="small" as="a" href="/donate" trackingLocation="hero">
              Donate
            </Button>
            <Button
              variant="outline"
              size="small"
              as="a"
              href={ctaLink}
              trackingLocation="hero"
              className="border-grey-50 text-grey-50 hover:bg-grey-50/15 dark:border-grey-50 dark:text-grey-50 dark:hover:bg-grey-50/15"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>

      {/* James River wave divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <WaveDivider fill="fill-grey-50 dark:fill-primary-900" />
      </div>
    </div>
  )
}
