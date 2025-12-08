import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export interface SanityCarouselImage {
  image: SanityImageObject;
  alt?: string;
  caption?: string;
}

interface SanityImageCarouselProps {
  images: SanityCarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  showCaptions?: boolean;
  captionPosition?: "overlay" | "below";
  loop?: boolean;
  aspectRatio?: "16/9" | "4/3" | "3/2" | "1/1" | "auto";
  sizes?: string;
  priority?: boolean;
}

export default function SanityImageCarousel({
  images,
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  showCaptions = false,
  captionPosition = "overlay",
  loop = true,
  aspectRatio = "4/3",
  sizes = "(max-width: 768px) 100vw, 60vw",
  priority = false,
}: SanityImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, duration: 50 }, [Fade()]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  // Key to reset CSS animation when slide changes
  const [animationKey, setAnimationKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    // Reset animation when slide changes
    setAnimationKey((prev) => prev + 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Initialize state from carousel API
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play functionality with play/pause support
  useEffect(() => {
    if (!emblaApi || !autoPlay || !isPlaying || prefersReducedMotion) {
      return;
    }

    // Auto-advance timer
    const autoAdvanceTimer = setTimeout(() => {
      emblaApi.scrollNext();
    }, autoPlayInterval);

    return () => {
      clearTimeout(autoAdvanceTimer);
    };
  }, [emblaApi, autoPlay, autoPlayInterval, isPlaying, selectedIndex, prefersReducedMotion]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!emblaApi) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      scrollTo(images.length - 1);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-4/3";
      case "3/2":
        return "aspect-3/2";
      case "1/1":
        return "aspect-square";
      default:
        return "";
    }
  };

  if (images.length === 0) return null;

  return (
    <div
      className="relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Image carousel with ${images.length} images`}
      aria-roledescription="carousel"
    >
      <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {images.map((item, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%]"
              style={{
                transform: "translate3d(0, 0, 0)",
              }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${images.length}`}
            >
              <div className={`relative ${getAspectClass()} bg-grey-200 dark:bg-primary-700`}>
                <SanityImage
                  image={item.image}
                  alt={item.alt || item.image.alt || ""}
                  sizes={sizes}
                  className="h-full w-full object-cover"
                  priority={priority && index === 0}
                />
                {showCaptions && captionPosition === "overlay" && item.caption && (
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-transparent p-4 md:p-6 dark:from-grey-900/80 dark:via-grey-900/40">
                    <p className="font-body text-sm text-white/90 md:text-base">{item.caption}</p>
                  </div>
                )}
              </div>
              {showCaptions && captionPosition === "below" && item.caption && (
                <div className="bg-white p-3 dark:bg-grey-800">
                  <p className="font-body text-sm text-grey-700 dark:text-grey-300">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Image {selectedIndex + 1} of {images.length}
          {images[selectedIndex]?.alt && `: ${images[selectedIndex].alt}`}
        </div>
      </div>

      {/* Controls row - dots on left, buttons on right */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {/* Pagination dots */}
          {showDots && (
            <div className="flex gap-2" role="group" aria-label="Carousel pagination">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`relative h-2.5 overflow-hidden rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none ${
                    index === selectedIndex
                      ? "w-8 bg-accent-600 dark:bg-accent-400"
                      : "w-2.5 bg-grey-300 hover:bg-grey-400 dark:bg-grey-600 dark:hover:bg-grey-500"
                  }`}
                  aria-label={`Go to image ${index + 1} of ${images.length}`}
                  aria-current={index === selectedIndex ? "true" : undefined}
                  type="button"
                >
                  {/* Progress overlay for active dot during autoplay - uses CSS animation for smooth 60fps */}
                  {index === selectedIndex && autoPlay && isPlaying && !prefersReducedMotion && (
                    <span
                      key={animationKey}
                      className="absolute inset-y-0 right-0 bg-grey-300 dark:bg-grey-600"
                      style={{
                        animation: `carousel-progress ${autoPlayInterval}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Navigation and play/pause buttons */}
          <div className="flex items-center gap-1">
            {/* Previous button */}
            {showNavigation && (
              <button
                onClick={scrollPrev}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-accent-700 bg-accent-600 text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-accent-600 dark:bg-accent-500"
                aria-label="Previous image"
                type="button"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            )}

            {/* Next button */}
            {showNavigation && (
              <button
                onClick={scrollNext}
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-accent-700 bg-accent-600 text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-accent-600 dark:bg-accent-500"
                aria-label="Next image"
                type="button"
              >
                <ChevronRight className="h-5 w-5 stroke-2" aria-hidden="true" />
              </button>
            )}

            {/* Play/Pause button */}
            {autoPlay && (
              <>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-accent-700 bg-accent-600 text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-accent-600 dark:bg-accent-500"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                  aria-pressed={isPlaying}
                  type="button"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Play className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>

                {/* Screen reader status */}
                <div className="sr-only" role="status" aria-live="polite">
                  {isPlaying ? `Playing. Slide ${selectedIndex + 1} of ${images.length}` : "Paused"}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
