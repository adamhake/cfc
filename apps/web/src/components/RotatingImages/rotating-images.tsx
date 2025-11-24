import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface RotatingImagesProps {
  /**
   * Array of Sanity images to cycle through
   */
  images: SanityImageObject[];
  /**
   * Interval between image changes in milliseconds
   * @default 5000
   */
  interval?: number;
  /**
   * CSS classes to apply to the container
   */
  className?: string;
  /**
   * CSS classes to apply to each image
   */
  imageClassName?: string;
  /**
   * Sizes attribute for responsive images
   * @default "(max-width: 768px) 100vw, 50vw"
   */
  sizes?: string;
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
   * Transition duration in seconds
   * @default 0.8
   */
  transitionDuration?: number;
  /**
   * Whether to show image captions
   * @default false
   */
  showCaptions?: boolean;
  /**
   * Caption display style
   * @default "overlay"
   */
  captionStyle?: "overlay" | "below" | "hotspot";
  /**
   * Number of lines to clamp caption text to
   * @default 2
   */
  captionLineClamp?: 1 | 2 | 3;
  /**
   * Make captions scrollable instead of truncating
   * Useful for long captions with limited space
   * For overlay and hotspot styles, captions use full image height
   * For below style, uses maxCaptionHeight prop
   * @default false
   */
  scrollableCaptions?: boolean;
  /**
   * Max height for scrollable captions in pixels
   * Only applies to "below" caption style when scrollableCaptions is true
   * overlay and hotspot styles use full image height
   * @default 120
   */
  maxCaptionHeight?: number;
}

/**
 * Component that cycles through an array of Sanity images with smooth fade transitions
 *
 * Features:
 * - Automatic image rotation at specified interval
 * - Pauses on hover so users can read captions
 * - Respects user's reduced motion preference
 * - Smooth fade transitions using Framer Motion
 * - Optimized Sanity images with responsive srcsets
 * - Multiple caption styles: overlay, below, or hotspot indicator
 *
 * @example
 * ```tsx
 * <RotatingImages
 *   images={parkImages}
 *   interval={5000}
 *   className="rounded-2xl overflow-hidden"
 *   imageClassName="object-cover"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   showCaptions={true}
 *   captionStyle="overlay"
 *   captionLineClamp={2}
 * />
 * ```
 */
export default function RotatingImages({
  images,
  interval = 5000,
  className = "",
  imageClassName = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  quality = 80,
  maxWidth,
  transitionDuration = 0.8,
  showCaptions = false,
  captionStyle = "overlay",
  captionLineClamp = 2,
  scrollableCaptions = false,
  maxCaptionHeight = 120,
}: RotatingImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [captionHovered, setCaptionHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Get line clamp class based on prop (only used when not scrollable)
  const lineClampClass = `line-clamp-${captionLineClamp}` as const;

  useEffect(() => {
    // Only cycle images if user hasn't requested reduced motion and we have multiple images
    if (prefersReducedMotion || images.length <= 1 || isPaused) {
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [prefersReducedMotion, images.length, interval, isPaused]);

  // If no images, return null
  if (!images || images.length === 0) {
    return null;
  }

  // Render caption based on style
  const renderCaption = (image: SanityImageObject, index?: number) => {
    if (!showCaptions || !image.caption) return null;

    const key = index !== undefined ? index : "static";

    if (captionStyle === "overlay") {
      return (
        <div
          key={`caption-overlay-${key}`}
          className="absolute inset-0 flex items-end bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            className={`font-body text-sm font-medium text-white md:text-base ${
              scrollableCaptions
                ? "scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50 max-h-full overflow-y-auto pb-4"
                : lineClampClass
            }`}
          >
            {image.caption}
          </div>
        </div>
      );
    }

    if (captionStyle === "hotspot") {
      return (
        <>
          {/* Hotspot circle with info icon */}
          <motion.div
            key={`caption-hotspot-${key}`}
            className="absolute bottom-4 left-4 flex h-10 w-10 cursor-help items-center justify-center rounded-full bg-primary-700/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary-700"
            onMouseEnter={() => setCaptionHovered(true)}
            onMouseLeave={() => setCaptionHovered(false)}
            aria-label="Show caption"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
          {/* Caption overlay - shown on hotspot hover */}
          <AnimatePresence>
            {captionHovered && (
              <motion.div
                key={`caption-hover-${key}`}
                className="absolute inset-0 flex items-end rounded-2xl bg-black/85 p-6 backdrop-blur-sm"
                onMouseEnter={() => setCaptionHovered(true)}
                onMouseLeave={() => setCaptionHovered(false)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                <div
                  className={`font-body text-base leading-relaxed text-white md:text-lg ${
                    scrollableCaptions
                      ? "scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50 max-h-full overflow-y-auto pb-6"
                      : ""
                  }`}
                >
                  {image.caption}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    }

    return null;
  };

  // If only one image or reduced motion, just render static image
  if (images.length === 1 || prefersReducedMotion) {
    const image = images[0];
    return (
      <div className="flex flex-col gap-2">
        <div className={`relative ${className}`}>
          <SanityImage
            image={image}
            alt={image.alt || ""}
            className={imageClassName}
            sizes={sizes}
            quality={quality}
            maxWidth={maxWidth}
          />
          {renderCaption(image)}
        </div>
        {showCaptions && captionStyle === "below" && image.caption && (
          <div
            className={`font-body text-sm text-grey-700 dark:text-grey-300 ${
              scrollableCaptions
                ? "scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400 dark:scrollbar-thumb-grey-600 dark:hover:scrollbar-thumb-grey-500 overflow-y-auto pb-2"
                : lineClampClass
            }`}
            style={scrollableCaptions ? { maxHeight: `${maxCaptionHeight}px` } : undefined}
          >
            {image.caption}
          </div>
        )}
      </div>
    );
  }

  // Multiple images - cycle through them
  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative ${className}`}>
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: transitionDuration, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SanityImage
              image={images[currentImageIndex]}
              alt={images[currentImageIndex].alt || ""}
              className={imageClassName}
              sizes={sizes}
              quality={quality}
              maxWidth={maxWidth}
            />
            {renderCaption(images[currentImageIndex], currentImageIndex)}
          </motion.div>
        </AnimatePresence>
      </div>
      {showCaptions && captionStyle === "below" && images[currentImageIndex].caption && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`caption-below-${currentImageIndex}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`font-body text-sm text-grey-700 dark:text-grey-300 ${
              scrollableCaptions
                ? "scrollbar-thin scrollbar-thumb-grey-300 scrollbar-track-transparent hover:scrollbar-thumb-grey-400 dark:scrollbar-thumb-grey-600 dark:hover:scrollbar-thumb-grey-500 overflow-y-auto pb-2"
                : lineClampClass
            }`}
            style={scrollableCaptions ? { maxHeight: `${maxCaptionHeight}px` } : undefined}
          >
            {images[currentImageIndex].caption}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
