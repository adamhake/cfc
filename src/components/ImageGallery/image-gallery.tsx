import { motion } from "framer-motion";
import { Image } from "@unpic/react";
import { useState } from "react";

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

  const getColumnClass = () => {
    const classes = [];
    if (columns.default) classes.push(`grid-cols-${columns.default}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    return classes.join(" ");
  };

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
        ease: "easeOut",
      },
    },
  };

  if (variant === "masonry") {
    // Masonry layout using CSS columns
    return (
      <motion.div
        className={`columns-1 sm:columns-2 md:columns-3 lg:columns-4 ${gapClasses[gap]}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className={`mb-${gap === "sm" ? "2" : gap === "md" ? "4" : "6"} break-inside-avoid ${image.showOnMobile === false ? "hidden sm:block" : ""}`}
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

  if (variant === "staggered") {
    // Staggered grid with alternating heights
    return (
      <motion.div
        className={`grid ${getColumnClass()} ${gapClasses[gap]}`}
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
      className={`grid ${getColumnClass()} ${gapClasses[gap]}`}
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
            />
            {showCaptions && captionPosition === "hover" && image.caption && (
              <div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent p-4 transition-opacity duration-300 dark:from-grey-900/90 dark:via-grey-900/50 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-sm text-white md:text-base">{image.caption}</p>
              </div>
            )}
          </div>
          {showCaptions && captionPosition === "below" && image.caption && (
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{image.caption}</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
