import { urlForImage } from "@/lib/sanity";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import type { CSSProperties } from "react";

export interface SanityImageMetadata {
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  lqip?: string;
  blurhash?: string;
  palette?: {
    dominant?: {
      background: string;
      foreground: string;
    };
  };
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: SanityImageMetadata;
}

export interface SanityImageObject {
  asset: SanityImageAsset;
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
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
   * @default [640, 1024, 1536, 1920]
   */
  breakpoints?: number[];
  /**
   * Image quality (1-100)
   * @default 80
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
}

const DEFAULT_BREAKPOINTS = [640, 1024, 1536, 1920];
const DEFAULT_QUALITY = 80;

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
}: SanityImageProps) {
  // Extract image data - handle both full SanityImageObject and simple SanityImageSource
  const imageObject = image as SanityImageObject;
  const hasAsset = imageObject?.asset;

  const altText = alt || imageObject?.alt || "";
  const metadata = hasAsset ? imageObject.asset.metadata : undefined;
  const lqip = metadata?.lqip;
  const dimensions = metadata?.dimensions;

  // Generate srcset with multiple widths
  const srcset = breakpoints
    .map((width) => {
      const url = urlForImage(image).width(width).fit(fit).quality(quality).auto("format").url();
      return `${url} ${width}w`;
    })
    .join(", ");

  // Generate the default src (use largest breakpoint or maxWidth)
  const defaultWidth = maxWidth || breakpoints[breakpoints.length - 1];
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

  // Combined styles
  const combinedStyle: CSSProperties = {
    ...placeholderStyle,
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
      // Add aspect ratio to prevent layout shift even if dimensions aren't available
      {...(aspectRatio &&
        !dimensions?.width && { style: { ...combinedStyle, aspectRatio: aspectRatio.toString() } })}
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
}: {
  image: SanityImageObject | SanityImageSource;
  className?: string;
  quality?: number;
  maxWidth?: number;
  fit?: SanityImageProps["fit"];
  children?: React.ReactNode;
  style?: CSSProperties;
}) {
  const url = urlForImage(image).width(maxWidth).fit(fit).quality(quality).auto("format").url();

  const imageObject = image as SanityImageObject;
  const lqip = imageObject?.asset?.metadata?.lqip;

  const backgroundStyle: CSSProperties = {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    ...style,
  };

  // Add LQIP as initial background
  if (lqip) {
    backgroundStyle.backgroundImage = `url(${lqip}), ${backgroundStyle.backgroundImage}`;
  }

  return (
    <div className={className} style={backgroundStyle}>
      {children}
    </div>
  );
}
