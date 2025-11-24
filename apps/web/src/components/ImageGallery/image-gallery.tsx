import { SanityImage, type SanityImageObject } from "@/components/SanityImage";
import { Image } from "@unpic/react";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const gapClasses = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage !== null) {
      document.body.style.overflow = "hidden";
      // Focus the close button for accessibility
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
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

  // Memoize column classes for performance
  const columnClass = useMemo(() => {
    const classes = [];

    // Map column numbers to Tailwind classes
    if (columns.default === 1) classes.push("grid-cols-1");
    else if (columns.default === 2) classes.push("grid-cols-2");
    else if (columns.default === 3) classes.push("grid-cols-3");
    else if (columns.default === 4) classes.push("grid-cols-4");

    if (columns.sm === 1) classes.push("sm:grid-cols-1");
    else if (columns.sm === 2) classes.push("sm:grid-cols-2");
    else if (columns.sm === 3) classes.push("sm:grid-cols-3");
    else if (columns.sm === 4) classes.push("sm:grid-cols-4");

    if (columns.md === 1) classes.push("md:grid-cols-1");
    else if (columns.md === 2) classes.push("md:grid-cols-2");
    else if (columns.md === 3) classes.push("md:grid-cols-3");
    else if (columns.md === 4) classes.push("md:grid-cols-4");

    if (columns.lg === 1) classes.push("lg:grid-cols-1");
    else if (columns.lg === 2) classes.push("lg:grid-cols-2");
    else if (columns.lg === 3) classes.push("lg:grid-cols-3");
    else if (columns.lg === 4) classes.push("lg:grid-cols-4");

    return classes.join(" ");
  }, [columns]);

  const masonryColumnClass = useMemo(() => {
    const classes = [];

    // Map column numbers to Tailwind classes
    if (columns.default === 1) classes.push("columns-1");
    else if (columns.default === 2) classes.push("columns-2");
    else if (columns.default === 3) classes.push("columns-3");
    else if (columns.default === 4) classes.push("columns-4");

    if (columns.sm === 1) classes.push("sm:columns-1");
    else if (columns.sm === 2) classes.push("sm:columns-2");
    else if (columns.sm === 3) classes.push("sm:columns-3");
    else if (columns.sm === 4) classes.push("sm:columns-4");

    if (columns.md === 1) classes.push("md:columns-1");
    else if (columns.md === 2) classes.push("md:columns-2");
    else if (columns.md === 3) classes.push("md:columns-3");
    else if (columns.md === 4) classes.push("md:columns-4");

    if (columns.lg === 1) classes.push("lg:columns-1");
    else if (columns.lg === 2) classes.push("lg:columns-2");
    else if (columns.lg === 3) classes.push("lg:columns-3");
    else if (columns.lg === 4) classes.push("lg:columns-4");

    return classes.join(" ");
  }, [columns]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0, 0, 0.2, 1] as const,
      },
    },
  };

  if (variant === "masonry") {
    // Masonry layout using CSS columns
    return (
      <>
        <div
          className={`${masonryColumnClass} ${gapClasses[gap]}`}
          role="list"
          aria-label="Photo gallery"
        >
          {images.map((image, index) => {
            const props = getImageProps(image);
            return (
              <div
                key={`${index}`}
                className={`mb-${gap === "sm" ? "2" : gap === "md" ? "4" : "6"} break-inside-avoid ${props.showOnMobile === false ? "hidden sm:block" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                role="listitem"
              >
                <button
                  className="group relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
                  onClick={() => handleImageClick(index)}
                  aria-label={`View ${props.alt}${props.caption ? `: ${props.caption}` : ""}`}
                  type="button"
                >
                  {isSanityImage(image) ? (
                    <SanityImage
                      image={image}
                      alt={props.alt}
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      maxWidth={800}
                    />
                  ) : (
                    <Image
                      src={image.src}
                      alt={props.alt}
                      width={props.width}
                      height={props.height}
                      className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
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
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <motion.div
            ref={modalRef}
            className="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full min-h-[100dvh] w-full flex-col overflow-hidden bg-black/95"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
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
                      <img
                        src={images[selectedImage].src}
                        alt={images[selectedImage].alt}
                        className="h-auto max-h-[calc(100vh-24rem)] w-auto max-w-[85vw] rounded-lg md:max-h-[calc(90vh-16rem)] md:max-w-5xl"
                        loading="eager"
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
                              className="absolute inset-0 hidden rounded-lg bg-black/85 p-6 backdrop-blur-sm md:flex md:items-end"
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
      </>
    );
  }

  if (variant === "staggered") {
    // Staggered grid with alternating heights
    return (
      <motion.div
        className={`grid ${columnClass} ${gapClasses[gap]}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((image, index) => {
          const props = getImageProps(image);
          return (
            <motion.div
              key={index}
              className={`${index % 3 === 1 ? "mt-0 md:mt-8" : ""} ${props.showOnMobile === false ? "hidden sm:block" : ""}`}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="group relative overflow-hidden rounded-2xl">
                {isSanityImage(image) ? (
                  <SanityImage
                    image={image}
                    alt={props.alt}
                    className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    maxWidth={800}
                  />
                ) : (
                  <Image
                    src={image.src}
                    alt={props.alt}
                    width={props.width}
                    height={props.height}
                    className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
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
              </div>
              {showCaptions && captionPosition === "below" && props.caption && (
                <p className="mt-2 line-clamp-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
                  {props.caption}
                </p>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  // Default grid layout
  return (
    <motion.div
      className={`grid ${columnClass} ${gapClasses[gap]}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => {
        const props = getImageProps(image);
        return (
          <motion.div
            key={index}
            className={props.showOnMobile === false ? "hidden sm:block" : ""}
            variants={itemVariants}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="group relative overflow-hidden rounded-2xl">
              {isSanityImage(image) ? (
                <SanityImage
                  image={image}
                  alt={props.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  maxWidth={800}
                />
              ) : (
                <Image
                  src={image.src}
                  alt={props.alt}
                  width={props.width}
                  height={props.height}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}
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
            </div>
            {showCaptions && captionPosition === "below" && props.caption && (
              <p className="mt-2 line-clamp-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
                {props.caption}
              </p>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
