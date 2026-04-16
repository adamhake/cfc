"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { SanityImage, type SanityImageObject } from "@/components/SanityImage"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import dynamic from "next/dynamic"
import { getResponsiveColumnClasses } from "./image-gallery-utils"

const ImageGalleryLightbox = dynamic(() => import("./image-gallery-lightbox"), { ssr: false })

export interface GalleryImage {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
  showOnMobile?: boolean
}

export interface SanityGalleryImage extends SanityImageObject {
  showOnMobile?: boolean | null
}

interface ImageGalleryProps {
  images: GalleryImage[] | SanityGalleryImage[]
  variant?: "grid" | "masonry" | "staggered"
  columns?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
  }
  showCaptions?: boolean
  captionPosition?: "hover" | "below"
  gap?: "sm" | "md" | "lg"
}

// Type guard to check if image is a Sanity image
function isSanityImage(image: GalleryImage | SanityGalleryImage): image is SanityGalleryImage {
  return "asset" in image && image.asset !== undefined
}

// Helper to get image properties regardless of type
function getImageProps(image: GalleryImage | SanityGalleryImage) {
  if (isSanityImage(image)) {
    return {
      alt: image.alt || "",
      caption: image.caption,
      width: image.asset?.metadata?.dimensions?.width || 0,
      height: image.asset?.metadata?.dimensions?.height || 0,
      showOnMobile: image.showOnMobile,
    }
  }
  return {
    alt: image.alt,
    caption: image.caption,
    width: image.width,
    height: image.height,
    showOnMobile: image.showOnMobile,
  }
}

// Helper to generate stable keys for images
function getImageKey(image: GalleryImage | SanityGalleryImage, index: number): string {
  if (isSanityImage(image)) {
    return image.asset?._id ?? `sanity-${index}`
  }
  // For legacy images, combine src with index as fallback
  return `legacy-${index}-${image.src}`
}

export default function ImageGallery({
  images,
  variant = "grid",
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  showCaptions = true,
  captionPosition = "hover",
  gap = "md",
}: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [captionHovered, setCaptionHovered] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const { gridClassNames, masonryClassNames } = getResponsiveColumnClasses(columns)

  const gapClass = gap === "sm" ? "gap-2" : gap === "md" ? "gap-4" : "gap-6"
  const gapSize = gap === "sm" ? "0.5rem" : gap === "md" ? "1rem" : "1.5rem"

  // Prevent body scroll when modal is open, and manage focus
  useEffect(() => {
    if (selectedImage !== null) {
      // Store the element that had focus before the modal opened
      previouslyFocusedRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = "hidden"
      // Focus the close button for accessibility
      closeButtonRef.current?.focus()
    } else {
      document.body.style.overflow = ""
      // Restore focus when modal closes
      previouslyFocusedRef.current?.focus()
      previouslyFocusedRef.current = null
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedImage])

  // Focus trap for modal
  useEffect(() => {
    if (selectedImage === null || !modalRef.current) return

    const modalElement = modalRef.current

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      const focusableElements = modalElement.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    modalElement.addEventListener("keydown", handleTabKey)
    return () => modalElement.removeEventListener("keydown", handleTabKey)
  }, [selectedImage])

  // Keyboard navigation for modal
  useEffect(() => {
    if (selectedImage === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null)
      } else if (e.key === "ArrowLeft" && selectedImage > 0) {
        setCaptionHovered(false)
        setSelectedImage(selectedImage - 1)
      } else if (e.key === "ArrowRight" && selectedImage < images.length - 1) {
        setCaptionHovered(false)
        setSelectedImage(selectedImage + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, images.length])

  // Memoize handlers for performance
  const handleImageClick = useCallback((index: number) => {
    setSelectedImage(index)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null)
  }, [])

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setCaptionHovered(false)
    setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }, [])

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setCaptionHovered(false)
      setSelectedImage((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))
    },
    [images.length],
  )

  // Shared image card renderer
  const renderImageCard = (image: GalleryImage | SanityGalleryImage, index: number) => {
    if (!isSanityImage(image)) return null
    const props = getImageProps(image)
    return (
      <button
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
        onClick={() => handleImageClick(index)}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        aria-label={`View ${props.alt}${props.caption ? `: ${props.caption}` : ""}`}
        type="button"
      >
        <SanityImage
          image={image}
          alt={props.alt}
          className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          breakpoints={[320, 480, 640, 720]}
          maxWidth={720}
          quality={70}
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
    )
  }

  const lightbox = selectedImage !== null ? (
    <ImageGalleryLightbox
      images={images}
      selectedImage={selectedImage}
      captionHovered={captionHovered}
      setCaptionHovered={setCaptionHovered}
      modalRef={modalRef}
      closeButtonRef={closeButtonRef}
      prefersReducedMotion={prefersReducedMotion}
      handlePrevImage={handlePrevImage}
      handleNextImage={handleNextImage}
      handleCloseModal={handleCloseModal}
    />
  ) : null

  if (variant === "grid") {
    // CSS Grid layout
    return (
      <>
        <div className={`grid ${gridClassNames} ${gapClass}`}>
          {images.map((image, index) => {
            const props = getImageProps(image)
            return (
              <div
                key={getImageKey(image, index)}
                className={props.showOnMobile === false ? "hidden sm:block" : ""}
              >
                {renderImageCard(image, index)}
              </div>
            )
          })}
        </div>
        {lightbox}
      </>
    )
  }

  // Masonry and staggered variants both use CSS columns layout
  // "staggered" falls back to the same masonry layout
  return (
    <>
      <div className={masonryClassNames} style={{ columnGap: gapSize }}>
        {images.map((image, index) => {
          const props = getImageProps(image)
          return (
            <div
              key={getImageKey(image, index)}
              className={props.showOnMobile === false ? "hidden sm:block" : ""}
              style={{ breakInside: "avoid", marginBottom: gapSize }}
            >
              {renderImageCard(image, index)}
            </div>
          )
        })}
      </div>
      {lightbox}
    </>
  )
}
