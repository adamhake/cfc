import { SanityImage, type SanityImageObject } from "@/components/SanityImage";
import { Image } from "@/components/OptimizedImage/optimized-image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { getResponsiveColumnClasses } from "./image-gallery-utils";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  showOnMobile?: boolean;
}

export interface SanityGalleryImage extends SanityImageObject {
  showOnMobile?: boolean;
}

interface ImageGalleryProps {
  images: GalleryImage[] | SanityGalleryImage[];
  variant?: "grid" | "masonry" | "staggered";
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  showCaptions?: boolean;
  captionPosition?: "hover" | "below";
  gap?: "sm" | "md" | "lg";
}

// Type guard to check if image is a Sanity image
function isSanityImage(image: GalleryImage | SanityGalleryImage): image is SanityGalleryImage {
  return "asset" in image && image.asset !== undefined;
}

// Helper to get image properties regardless of type
function getImageProps(image: GalleryImage | SanityGalleryImage) {
  if (isSanityImage(image)) {
    return {
      alt: image.alt || "",
      caption: image.caption,
      width: image.asset.metadata?.dimensions?.width || 0,
      height: image.asset.metadata?.dimensions?.height || 0,
      showOnMobile: image.showOnMobile,
    };
  }
  return {
    alt: image.alt,
    caption: image.caption,
    width: image.width,
    height: image.height,
    showOnMobile: image.showOnMobile,
  };
}

// Helper to generate stable keys for images
function getImageKey(image: GalleryImage | SanityGalleryImage, index: number): string {
  if (isSanityImage(image)) {
    return image.asset._id;
  }
  // For legacy images, combine src with index as fallback
  return `legacy-${index}-${image.src}`;
}

export default function ImageGallery({
  images,
  variant = "grid",
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  showCaptions = true,
  captionPosition = "hover",
  gap = "md",
}: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [captionHovered, setCaptionHovered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { gridClassNames, masonryClassNames } = getResponsiveColumnClasses(columns);

  const gapClass = gap === "sm" ? "gap-2" : gap === "md" ? "gap-4" : "gap-6";
  const gapSize = gap === "sm" ? "0.5rem" : gap === "md" ? "1rem" : "1.5rem";

  // Prevent body scroll when modal is open, and manage focus
  useEffect(() => {
    if (selectedImage !== null) {
      // Store the element that had focus before the modal opened
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      // Focus the close button for accessibility
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      // Restore focus when modal closes
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // Focus trap for modal
  useEffect(() => {
    if (selectedImage === null || !modalRef.current) return;

    const modalElement = modalRef.current;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener("keydown", handleTabKey);
    return () => modalElement.removeEventListener("keydown", handleTabKey);
  }, [selectedImage]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft" && selectedImage > 0) {
        setCaptionHovered(false);
        setSelectedImage(selectedImage - 1);
      } else if (e.key === "ArrowRight" && selectedImage < images.length - 1) {
        setCaptionHovered(false);
        setSelectedImage(selectedImage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length]);

  // Memoize handlers for performance
  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCaptionHovered(false);
    setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCaptionHovered(false);
      setSelectedImage((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
    },
    [images.length],
  );

  // Shared image card renderer
  const renderImageCard = (image: GalleryImage | SanityGalleryImage, index: number) => {
    if (!isSanityImage(image)) return null;
    const props = getImageProps(image);
    return (
      <button
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
        onClick={() => handleImageClick(index)}
        aria-label={`View ${props.alt}${props.caption ? `: ${props.caption}` : ""}`}
        type="button"
      >
        <SanityImage
          image={image}
          alt={props.alt}
          className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          breakpoints={[320, 480, 640, 800]}
          maxWidth={800}
        />
        {showCaptions && captionPosition === "hover" && props.caption && (
          <div
            className={`absolute inset-0 flex items-end bg-black/85 p-4 backdrop-blur-sm transition-opacity duration-300 ${
              hoveredIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="line-clamp-3 font-body text-sm text-white md:text-base">
              {props.caption}
            </p>
          </div>
        )}
        {showCaptions && captionPosition === "below" && props.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-black/85 p-4 backdrop-blur-sm">
            <p className="line-clamp-2 font-body text-sm font-medium text-white drop-shadow-lg md:text-base">
              {props.caption}
            </p>
          </div>
        )}
      </button>
    );
  };

  // Render the lightbox modal
  const renderModal = () => (
    <AnimatePresence>
      {selectedImage !== null && (
        <motion.div
          ref={modalRef}
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full min-h-[100dvh] w-full flex-col overflow-hidden bg-black/95"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : undefined}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-modal-title"
        >
          {/* Screen reader heading for modal context */}
          <h2 id="gallery-modal-title" className="sr-only">
            Image Viewer
          </h2>
          <button
            ref={closeButtonRef}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:outline-none"
            onClick={handleCloseModal}
            aria-label="Close image viewer"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex h-full flex-1 items-center justify-center p-4 pb-20 md:pb-4">
            <div
              className="relative flex flex-col items-center gap-4 md:max-h-[90vh] md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous button - hidden on mobile, shown on desktop */}
              {selectedImage > 0 && (
                <button
                  className="hidden rounded-full bg-primary-700/80 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none md:block"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {/* Image container */}
              <div className="flex max-w-7xl flex-col items-center gap-4 md:gap-0">
                <div className="relative inline-block">
                  {isSanityImage(images[selectedImage]) ? (
                    <SanityImage
                      image={images[selectedImage]}
                      alt={getImageProps(images[selectedImage]).alt}
                      className="h-auto max-h-[calc(100vh-24rem)] w-auto max-w-[85vw] rounded-lg md:max-h-[calc(90vh-16rem)] md:max-w-5xl"
                      priority={true}
                      sizes="(max-width: 768px) 85vw, (max-width: 1280px) 80vw, 1280px"
                      maxWidth={1920}
                    />
                  ) : (
                    <Image
                      src={images[selectedImage].src}
                      alt={images[selectedImage].alt}
                      width={getImageProps(images[selectedImage]).width}
                      height={getImageProps(images[selectedImage]).height}
                      className="h-auto max-h-[calc(100vh-24rem)] w-auto max-w-[85vw] rounded-lg md:max-h-[calc(90vh-16rem)] md:max-w-5xl"
                      layout="constrained"
                      loading="eager"
                      breakpoints={[640, 1024, 1536]}
                      sizes="(max-width: 768px) 85vw, (max-width: 1280px) 80vw, 1280px"
                    />
                  )}
                  {/* Desktop: Hotspot indicator and caption overlay */}
                  {getImageProps(images[selectedImage]).caption && (
                    <>
                      {/* Hotspot circle with info icon */}
                      <motion.div
                        className="absolute bottom-4 left-4 hidden h-10 w-10 cursor-help items-center justify-center rounded-full bg-primary-700/80 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary-700 md:flex"
                        onMouseEnter={() => setCaptionHovered(true)}
                        onMouseLeave={() => setCaptionHovered(false)}
                        aria-label="Show caption"
                        animate={
                          prefersReducedMotion
                            ? {}
                            : {
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8],
                              }
                        }
                        transition={
                          prefersReducedMotion
                            ? {}
                            : {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                        }
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
                            className="absolute inset-0 hidden rounded-lg bg-black/85 p-6 backdrop-blur-sm md:flex md:items-end"
                            onMouseEnter={() => setCaptionHovered(true)}
                            onMouseLeave={() => setCaptionHovered(false)}
                            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                            transition={
                              prefersReducedMotion
                                ? { duration: 0 }
                                : {
                                    duration: 0.3,
                                    ease: "easeOut",
                                  }
                            }
                          >
                            <p className="max-h-full overflow-y-auto pb-6 font-body text-base leading-relaxed text-white drop-shadow-lg md:text-lg">
                              {getImageProps(images[selectedImage]).caption}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
                {/* Mobile: Caption below image */}
                {getImageProps(images[selectedImage]).caption && (
                  <div className="max-h-32 w-full max-w-2xl overflow-y-auto rounded-lg bg-black/40 p-4 backdrop-blur-sm md:hidden">
                    <p className="font-body text-sm leading-relaxed text-white">
                      {getImageProps(images[selectedImage]).caption}
                    </p>
                  </div>
                )}
              </div>
              {/* Next button - hidden on mobile, shown on desktop */}
              {selectedImage < images.length - 1 && (
                <button
                  className="hidden rounded-full bg-primary-700/80 p-3 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none md:block"
                  onClick={handleNextImage}
                  aria-label="Next image"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Mobile navigation buttons - positioned at bottom */}
          <div
            className="fixed inset-x-0 bottom-0 flex justify-center gap-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pb-8 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`rounded-full bg-primary-700/80 p-4 text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none ${selectedImage === 0 ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handlePrevImage}
              aria-label="Previous image"
              type="button"
              disabled={selectedImage === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className={`rounded-full bg-primary-700/80 p-4 text-white backdrop-blur-sm transition-all duration-300 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none ${selectedImage === images.length - 1 ? "cursor-not-allowed opacity-50" : ""}`}
              onClick={handleNextImage}
              aria-label="Next image"
              type="button"
              disabled={selectedImage === images.length - 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (variant === "grid") {
    // CSS Grid layout
    return (
      <>
        <div className={`grid ${gridClassNames} ${gapClass}`}>
          {images.map((image, index) => {
            const props = getImageProps(image);
            return (
              <div
                key={getImageKey(image, index)}
                className={props.showOnMobile === false ? "hidden sm:block" : ""}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {renderImageCard(image, index)}
              </div>
            );
          })}
        </div>
        {renderModal()}
      </>
    );
  }

  // Masonry and staggered variants both use CSS columns layout
  // "staggered" falls back to the same masonry layout
  return (
    <>
      <div className={masonryClassNames} style={{ columnGap: gapSize }}>
        {images.map((image, index) => {
          const props = getImageProps(image);
          return (
            <div
              key={getImageKey(image, index)}
              className={props.showOnMobile === false ? "hidden sm:block" : ""}
              style={{ breakInside: "avoid", marginBottom: gapSize }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {renderImageCard(image, index)}
            </div>
          );
        })}
      </div>
      {renderModal()}
    </>
  );
}
