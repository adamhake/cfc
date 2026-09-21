import type { ReactNode } from "react"
import { Image } from "@/components/OptimizedImage/optimized-image"
import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image"
import { WaveDivider } from "@/components/WaveDivider/wave-divider"
import { cn } from "@/utils/cn"

interface PageHeroProps {
  title: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  sanityImage?: SanityImageObject
  children?: ReactNode
  variant?: "section" | "detail"
  priority?: boolean
  alignment?: "center" | "bottom-mobile-center-desktop"
  contentSpacing?: string
  titleSize?: "standard" | "compact"
  /**
   * `data-sanity` attribute for the hero image, so it is click-to-edit in the
   * Presentation tool. Images carry no stega markers of their own.
   */
  imageDataAttr?: string
}

export default function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  sanityImage,
  imageDataAttr,
  children,
  variant = "section",
  priority = false,
  alignment = "center",
  contentSpacing,
  titleSize = "standard",
}: PageHeroProps) {
  const alignmentClasses = {
    center: "items-center",
    "bottom-mobile-center-desktop": "items-end lg:items-center",
  }

  const paddingClasses = contentSpacing || ""

  const useCompactTitle = titleSize === "compact" || title.length > 32
  const staticImageWidth = imageWidth ?? 1920
  const staticImageHeight = imageHeight ?? 1080

  const classes = cn("relative flex w-full flex-col overflow-visible", {
    "min-h-[clamp(24rem,46svh,30rem)]": variant === "section" && !subtitle && !children,
    "min-h-[clamp(26rem,50svh,34rem)]": variant === "section" && Boolean(subtitle || children),
    "min-h-[clamp(30rem,58svh,40rem)]": variant === "detail",
  })

  return (
    <header className={classes}>
      {sanityImage ? (
        <SanityImage
          data-sanity={imageDataAttr}
          image={sanityImage}
          alt={imageAlt || sanityImage.alt || ""}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="(max-width: 1600px) 100vw, 1600px"
          priority={priority}
          maxWidth={1600}
          breakpoints={[640, 768, 960, 1200, 1440, 1600]}
          quality={70}
          useHotspotPosition
        />
      ) : imageSrc ? (
        <Image
          src={imageSrc}
          alt={imageAlt || ""}
          width={staticImageWidth}
          height={staticImageHeight}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-primary-800 dark:bg-primary-900" />
      )}
      <div
        className="absolute inset-0 bg-primary-950/55 dark:bg-grey-950/65"
        aria-hidden="true"
      ></div>
      <div
        className={cn(
          "relative z-10 flex flex-1 justify-center px-4 pt-32 pb-20 sm:px-6 md:pt-36 md:pb-24 lg:px-8",
          alignmentClasses[alignment],
          paddingClasses,
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <div className="text-center">
            {children}
            <h1
              className={cn(
                "mx-auto max-w-5xl text-balance font-display leading-[1.02] text-primary-50 dark:text-grey-50",
                useCompactTitle
                  ? "text-3xl sm:text-4xl lg:text-5xl"
                  : "text-4xl sm:text-5xl lg:text-6xl",
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-4 max-w-3xl text-balance font-body text-base leading-relaxed text-primary-100 md:mt-5 md:text-lg lg:text-xl dark:text-grey-200">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* James River wave divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <WaveDivider fill="fill-grey-50 dark:fill-primary-900" />
      </div>
    </header>
  )
}
