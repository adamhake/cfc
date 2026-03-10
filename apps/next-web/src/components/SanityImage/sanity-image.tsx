import { urlForImage } from "@/lib/sanity";
import type { SanityImage as SanityImageType } from "@/lib/sanity-types";
import type { SanityImageSource } from "@sanity/image-url";
import type { CSSProperties } from "react";
import { DEFAULT_BREAKPOINTS, getResponsiveWidths } from "./sanity-image-utils";

// Re-export types for external use
// These are derived from the centralized SanityImage type in sanity-types.ts
export type SanityImageMetadata = NonNullable<SanityImageType["asset"]["metadata"]>;
export type SanityImageAsset = SanityImageType["asset"];

// Using SanityImage from sanity-types.ts with optional alt for component flexibility
export interface SanityImageObject extends Omit<SanityImageType, "alt"> {
  alt?: string; // Make alt optional since it may come from props instead
}

export interface SanityImageProps {
  /**
   * Sanity image object with asset, alt, hotspot, and crop data
   */
  image: SanityImageObject | SanityImageSource;
  /**
   * Alt text for the image (falls back to image.alt if available)
   */
  alt?: string;
  /**
   * CSS classes to apply to the image element
   */
  className?: string;
  /**
   * Sizes attribute for responsive images
   * Examples:
   * - "(max-width: 768px) 100vw, 50vw"
   * - "100vw"
   * - "(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px"
   */
  sizes?: string;
  /**
   * Loading priority - set to true for above-the-fold images
   */
  priority?: boolean;
  /**
   * Image width breakpoints for srcset generation
   * @default [320, 480, 640, 768, 896, 1024, 1280, 1536]
   */
  breakpoints?: number[];
  /**
   * Image quality (1-100)
   * @default 72
   */
  quality?: number;
  /**
   * Max width for the image (for optimization)
   */
  maxWidth?: number;
  /**
   * Max height for the image (for optimization)
   */
  maxHeight?: number;
  /**
   * Fit mode for the image
   * @default "max"
   */
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  /**
   * Whether to show the blur placeholder
   * @default true
   */
  showPlaceholder?: boolean;
  /**
   * Additional styles to apply to the image container
   */
  style?: CSSProperties;
  /**
   * Callback when image loads
   */
  onLoad?: () => void;
  /**
   * Apply hotspot data as CSS object-position
   * Useful for images using object-fit: cover where you want the hotspot
   * to determine the focal point of the crop
   * @default false
   */
  useHotspotPosition?: boolean;
}

const DEFAULT_QUALITY = 72;

/**
 * Optimized image component for Sanity CMS images
 *
 * Features:
 * - Responsive srcset generation using Sanity's image CDN
 * - Automatic WebP/AVIF format conversion
 * - Blur placeholder (LQIP) support
 * - Hotspot and crop support
 * - Prevents layout shift with aspect ratio
 * - Loading priority control for LCP optimization
 *
 * @example
 * ```tsx
 * <SanityImage
 *   image={event.image}
 *   alt="Event poster"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   priority={true}
 * />
 * ```
 */
export function SanityImage({
  image,
  alt,
  className = "",
  sizes,
  priority = false,
  breakpoints = DEFAULT_BREAKPOINTS,
  quality = DEFAULT_QUALITY,
  maxWidth,
  maxHeight,
  fit = "max",
  showPlaceholder = true,
  style,
  onLoad,
  useHotspotPosition = false,
}: SanityImageProps) {
  // Extract image data - handle both full SanityImageObject and simple SanityImageSource
  const imageObject = image as SanityImageObject;
  const hasAsset = imageObject?.asset;

  const altText = alt || imageObject?.alt || "";
  const metadata = hasAsset ? imageObject.asset.metadata : undefined;
  const lqip = metadata?.lqip;
  const dimensions = metadata?.dimensions;
  const hotspot = imageObject?.hotspot;
  const responsiveWidths = getResponsiveWidths(breakpoints, maxWidth);

  // Generate srcset with multiple widths
  const srcset = responsiveWidths
    .map((width) => {
      const url = urlForImage(image).width(width).fit(fit).quality(quality).auto("format").url();
      return `${url} ${width}w`;
    })
    .join(", ");

  // Generate the default src (use largest breakpoint or maxWidth)
  const defaultWidth =
    typeof maxWidth === "number" && maxWidth > 0
      ? Math.round(maxWidth)
      : responsiveWidths[responsiveWidths.length - 1];
  let srcBuilder = urlForImage(image).width(defaultWidth).fit(fit).quality(quality).auto("format");

  // Apply maxHeight if provided
  if (maxHeight) {
    srcBuilder = srcBuilder.height(maxHeight);
  }

  const src = srcBuilder.url();

  // Calculate aspect ratio for layout
  const aspectRatio =
    dimensions?.aspectRatio ||
    (dimensions?.width && dimensions?.height ? dimensions.width / dimensions.height : undefined);

  // Blur placeholder styles
  const placeholderStyle: CSSProperties =
    showPlaceholder && lqip
      ? {
          backgroundImage: `url(${lqip})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {};

  // Calculate object-position from hotspot data
  // Hotspot x/y are values 0-1 representing the focal point (0,0 = top-left, 1,1 = bottom-right)
  const hotspotStyle: CSSProperties =
    useHotspotPosition && hotspot
      ? {
          objectPosition: `${hotspot.x * 100}% ${hotspot.y * 100}%`,
        }
      : {};

  // Combined styles - include aspectRatio when dimensions aren't available to prevent CLS
  const combinedStyle: CSSProperties = {
    ...placeholderStyle,
    ...hotspotStyle,
    ...(aspectRatio && !dimensions?.width && { aspectRatio: aspectRatio.toString() }),
    ...style,
  };

  return (
    <img
      src={src}
      srcSet={srcset}
      sizes={sizes}
      alt={altText}
      width={dimensions?.width}
      height={dimensions?.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={combinedStyle}
      onLoad={onLoad}
    />
  );
}

/**
 * Variant for background images using Sanity images
 */
export function SanityBackgroundImage({
  image,
  className = "",
  quality = DEFAULT_QUALITY,
  maxWidth = 1920,
  fit = "crop",
  children,
  style,
  useHotspotPosition = false,
}: {
  image: SanityImageObject | SanityImageSource;
  className?: string;
  quality?: number;
  maxWidth?: number;
  fit?: SanityImageProps["fit"];
  children?: React.ReactNode;
  style?: CSSProperties;
  /** Apply hotspot data as CSS background-position */
  useHotspotPosition?: boolean;
}) {
  const url = urlForImage(image).width(maxWidth).fit(fit).quality(quality).auto("format").url();

  const imageObject = image as SanityImageObject;
  const lqip = imageObject?.asset?.metadata?.lqip;
  const hotspot = imageObject?.hotspot;

  // Calculate background-position from hotspot data
  const backgroundPosition =
    useHotspotPosition && hotspot ? `${hotspot.x * 100}% ${hotspot.y * 100}%` : "center";

  const backgroundStyle: CSSProperties = {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition,
    ...style,
  };

  // Add LQIP as fallback background (appears behind the main image)
  if (lqip) {
    backgroundStyle.backgroundImage = `url(${url}), url(${lqip})`;
  }

  return (
    <div className={className} style={backgroundStyle}>
      {children}
    </div>
  );
}
