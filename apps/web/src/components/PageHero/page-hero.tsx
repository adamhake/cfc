import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image";
import { Image } from "@unpic/react";
import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  sanityImage?: SanityImageObject;
  children?: ReactNode;
  height?: "small" | "medium" | "large" | "event";
  priority?: boolean;
  alignment?: "center" | "bottom-mobile-center-desktop";
  contentSpacing?: string;
  titleSize?: "standard" | "large";
}

export default function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  sanityImage,
  children,
  height = "medium",
  priority = false,
  alignment = "center",
  contentSpacing,
  titleSize = "standard",
}: PageHeroProps) {
  const heightClasses = {
    small: "h-[45vh]",
    medium: "h-[60vh]",
    large: "h-[65vh]",
    event: "min-h-[70vh] lg:min-h-[55vh]",
  };

  const alignmentClasses = {
    center: "items-center",
    "bottom-mobile-center-desktop": "items-end lg:items-center",
  };

  const paddingClasses = contentSpacing || "px-4";

  const titleSizeClasses = {
    standard: "text-5xl md:text-6xl",
    large: "text-4xl md:text-5xl lg:text-6xl",
  };

  return (
    <header
      className={`relative ${heightClasses[height]} w-full overflow-visible`}
      role="banner"
      aria-label="Page header"
    >
      {sanityImage ? (
        <SanityImage
          image={sanityImage}
          alt={imageAlt || sanityImage.alt || ""}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
          priority={priority}
          maxWidth={1920}
        />
      ) : (
        <Image
          src={imageSrc!}
          alt={imageAlt!}
          width={imageWidth!}
          height={imageHeight!}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : undefined}
          breakpoints={[320, 640, 1280, 1920]}
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-800/50 dark:from-primary-950/85 dark:to-primary-900/65"
        aria-hidden="true"
      ></div>
      <div
        className={`absolute inset-0 z-10 flex ${alignmentClasses[alignment]} justify-center ${paddingClasses} pt-20 pb-16 lg:py-8`}
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            {children}
            <h1
              className={`font-display text-primary-50 ${titleSizeClasses[titleSize]} dark:text-grey-50`}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-6 font-body text-lg text-primary-100 md:text-xl dark:text-grey-200">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Organic wave divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* Flowing natural curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-primary-900"
          />
          {/* Accent color stroke following the curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-accent-600 dark:stroke-accent-500"
            strokeWidth="7"
          />
        </svg>
      </div>
    </header>
  );
}
