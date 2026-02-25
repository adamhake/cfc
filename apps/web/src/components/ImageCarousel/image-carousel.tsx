import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Image } from "@unpic/react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

export interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  width: number;
  height: number;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  showCaptions?: boolean;
  captionPosition?: "overlay" | "below";
  loop?: boolean;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
}

export default function ImageCarousel({
  images,
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  showCaptions = true,
  captionPosition = "overlay",
  loop = true,
  aspectRatio = "16/9",
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
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
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Initialize state from carousel API - this is a legitimate synchronization with external library
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());

    // Set up event listeners
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Auto-play functionality - stops when reduced motion is preferred
  useEffect(() => {
    if (!emblaApi || !autoPlay || !isPlaying || prefersReducedMotion) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [emblaApi, autoPlay, autoPlayInterval, isPlaying, prefersReducedMotion]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!emblaApi) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollNext();
    }
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlay) setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) setIsPlaying(true);
  };

  // Pause auto-play on focus within
  const handleFocusIn = () => {
    if (autoPlay) setIsPlaying(false);
  };

  const handleFocusOut = (e: React.FocusEvent) => {
    // Only resume if focus has left the carousel entirely
    if (autoPlay && !e.currentTarget.contains(e.relatedTarget)) {
      setIsPlaying(true);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-4/3";
      case "1/1":
        return "aspect-square";
      default:
        return "";
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={`Image carousel with ${images.length} slides`}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
      tabIndex={0}
    >
      <div className="relative overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${images.length}`}
            >
              <div className={`relative ${getAspectClass()}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-full w-full object-cover"
                  priority={index === 0}
                />
                {showCaptions &&
                  captionPosition === "overlay" &&
                  (image.caption || image.title) && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent p-6 md:p-8 dark:from-grey-900/90 dark:via-grey-900/50">
                      <div>
                        {image.title && (
                          <h3 className="mb-1 font-display text-xl text-white md:text-2xl">
                            {image.title}
                          </h3>
                        )}
                        {image.caption && (
                          <p className="font-body text-sm text-white/90 md:text-base">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
              {showCaptions && captionPosition === "below" && (image.caption || image.title) && (
                <div className="bg-white p-4 dark:bg-grey-800">
                  {image.title && (
                    <h3 className="mb-1 font-display text-lg text-primary-900 md:text-xl dark:text-primary-100">
                      {image.title}
                    </h3>
                  )}
                  {image.caption && (
                    <p className="font-body text-sm text-neutral-700 dark:text-neutral-300">
                      {image.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Slide {selectedIndex + 1} of {images.length}
          {images[selectedIndex]?.alt && `: ${images[selectedIndex].alt}`}
        </div>

        {/* Navigation arrows */}
        {showNavigation && images.length > 1 && (
          <div className="absolute right-6 bottom-6 z-10 flex gap-2 md:right-8 md:bottom-8">
            <button
              onClick={scrollPrev}
              className="rounded-full bg-white/90 p-2 text-primary-900 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:outline-none dark:bg-grey-800/90 dark:text-primary-100 dark:hover:bg-grey-800"
              aria-label="Previous slide"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="rounded-full bg-white/90 p-2 text-primary-900 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:outline-none dark:bg-grey-800/90 dark:text-primary-100 dark:hover:bg-grey-800"
              aria-label="Next slide"
              type="button"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Pagination dots */}
      {showDots && images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`h-2.5 rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:outline-none ${
                index === selectedIndex
                  ? "w-8 bg-accent-600 dark:bg-accent-400"
                  : "w-2.5 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
              }`}
              aria-label={`Go to slide ${index + 1} of ${images.length}`}
              aria-current={index === selectedIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
