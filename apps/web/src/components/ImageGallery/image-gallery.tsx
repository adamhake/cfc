import { motion } from "framer-motion";
import { Image } from "@unpic/react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  showOnMobile?: boolean;
}

interface ImageGalleryProps {
  images: GalleryImage[];
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
        setSelectedImage(selectedImage - 1);
      } else if (e.key === "ArrowRight" && selectedImage < images.length - 1) {
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
    setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
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
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className={`mb-${gap === "sm" ? "2" : gap === "md" ? "4" : "6"} break-inside-avoid ${image.showOnMobile === false ? "hidden sm:block" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              role="listitem"
            >
              <button
                className="group relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
                onClick={() => handleImageClick(index)}
                aria-label={`View ${image.alt}${image.caption ? `: ${image.caption}` : ""}`}
                type="button"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {showCaptions && captionPosition === "hover" && image.caption && (
                  <div
                    className={`absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent p-4 transition-opacity duration-300 dark:from-grey-900/90 dark:via-grey-900/50 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <p className="font-body text-sm text-white md:text-base">{image.caption}</p>
                  </div>
                )}
                {showCaptions && captionPosition === "below" && image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-12">
                    <p className="font-body text-sm font-medium text-white drop-shadow-lg md:text-base">
                      {image.caption}
                    </p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <motion.div
            ref={modalRef}
            className="fixed inset-0 z-50 flex h-full min-h-screen w-full min-w-full flex-col overflow-hidden bg-black/95"
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
                    className="hidden rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:outline-none md:block"
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
                <div className="relative max-w-7xl">
                  <Image
                    src={images[selectedImage].src}
                    alt={images[selectedImage].alt}
                    width={images[selectedImage].width}
                    height={images[selectedImage].height}
                    className="max-h-[calc(100vh-180px)] w-auto rounded-lg md:max-h-[90vh]"
                    loading="eager"
                  />
                  {images[selectedImage].caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16">
                      <p className="font-body text-base text-white md:text-lg">
                        {images[selectedImage].caption}
                      </p>
                    </div>
                  )}
                </div>
                {/* Next button - hidden on mobile, shown on desktop */}
                {selectedImage < images.length - 1 && (
                  <button
                    className="hidden rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:outline-none md:block"
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
                className={`rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:outline-none ${selectedImage === 0 ? "cursor-not-allowed opacity-50" : ""}`}
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
                className={`rounded-full bg-white/10 p-4 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:outline-none ${selectedImage === images.length - 1 ? "cursor-not-allowed opacity-50" : ""}`}
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
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`${index % 3 === 1 ? "mt-0 md:mt-8" : ""} ${image.showOnMobile === false ? "hidden sm:block" : ""}`}
            variants={itemVariants}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="group relative overflow-hidden rounded-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {showCaptions && captionPosition === "hover" && image.caption && (
                <div
                  className={`absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent p-4 transition-opacity duration-300 dark:from-grey-900/90 dark:via-grey-900/50 ${
                    hoveredIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="font-body text-sm text-white md:text-base">{image.caption}</p>
                </div>
              )}
            </div>
            {showCaptions && captionPosition === "below" && image.caption && (
              <p className="mt-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
                {image.caption}
              </p>
            )}
          </motion.div>
        ))}
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
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={image.showOnMobile === false ? "hidden sm:block" : ""}
          variants={itemVariants}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="group relative overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {showCaptions && captionPosition === "hover" && image.caption && (
              <div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent p-4 transition-opacity duration-300 dark:from-grey-900/90 dark:via-grey-900/50 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="font-body text-sm text-white md:text-base">{image.caption}</p>
              </div>
            )}
          </div>
          {showCaptions && captionPosition === "below" && image.caption && (
            <p className="mt-2 font-body text-sm text-neutral-700 dark:text-neutral-300">
              {image.caption}
            </p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
