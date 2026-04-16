"use client"

import { Image } from "@/components/OptimizedImage/optimized-image"
import { SanityImage } from "@/components/SanityImage"
import { AnimatePresence, motion } from "framer-motion"
import type { RefObject } from "react"
import type { GalleryImage, SanityGalleryImage } from "./image-gallery"

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
    }
  }
  return {
    alt: image.alt,
    caption: image.caption,
    width: image.width,
    height: image.height,
  }
}

function isPortraitImage(image: GalleryImage | SanityGalleryImage): boolean {
  const { width, height } = getImageProps(image)
  return width > 0 && height > 0 && height > width
}

function getModalImageClassName(image: GalleryImage | SanityGalleryImage): string {
  const { caption } = getImageProps(image)
  const hasCaption = Boolean(caption)

  const mobileMaxHeightClass = hasCaption
    ? "max-h-[calc(100dvh-16rem)]"
    : "max-h-[calc(100dvh-10rem)]"
  const desktopMaxHeightClass = "md:max-h-[calc(100dvh-8rem)]"
  const sharedClasses = `h-auto rounded-lg object-contain ${mobileMaxHeightClass} ${desktopMaxHeightClass}`

  if (isPortraitImage(image)) {
    return `${sharedClasses} w-auto max-w-[88vw] md:max-w-[70vw]`
  }

  return `${sharedClasses} w-auto max-w-[92vw] md:max-w-[88vw]`
}

function getModalImageSizes(image: GalleryImage | SanityGalleryImage): string {
  return isPortraitImage(image) ? "(max-width: 768px) 88vw, 70vw" : "(max-width: 768px) 92vw, 88vw"
}

interface ImageGalleryLightboxProps {
  images: GalleryImage[] | SanityGalleryImage[]
  selectedImage: number | null
  captionHovered: boolean
  setCaptionHovered: (hovered: boolean) => void
  modalRef: RefObject<HTMLDivElement | null>
  closeButtonRef: RefObject<HTMLButtonElement | null>
  prefersReducedMotion: boolean
  handlePrevImage: (e: React.MouseEvent) => void
  handleNextImage: (e: React.MouseEvent) => void
  handleCloseModal: () => void
}

export default function ImageGalleryLightbox({
  images,
  selectedImage,
  captionHovered,
  setCaptionHovered,
  modalRef,
  closeButtonRef,
  prefersReducedMotion,
  handlePrevImage,
  handleNextImage,
  handleCloseModal,
}: ImageGalleryLightboxProps) {
  const activeImage = selectedImage !== null ? images[selectedImage] : null

  return (
    <AnimatePresence>
      {selectedImage !== null && activeImage && (
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
              aria-hidden="true"
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
              onKeyDown={(e) => e.stopPropagation()}
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
                    aria-hidden="true"
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
                  {isSanityImage(activeImage) ? (
                    <SanityImage
                      image={activeImage}
                      alt={getImageProps(activeImage).alt}
                      className={getModalImageClassName(activeImage)}
                      priority={true}
                      showPlaceholder={false}
                      sizes={getModalImageSizes(activeImage)}
                      maxWidth={1920}
                    />
                  ) : (
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt}
                      width={getImageProps(activeImage).width}
                      height={getImageProps(activeImage).height}
                      className={getModalImageClassName(activeImage)}
                      loading="eager"
                      sizes={getModalImageSizes(activeImage)}
                    />
                  )}
                  {/* Desktop: Hotspot indicator and caption overlay */}
                  {getImageProps(activeImage).caption && (
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
                          aria-hidden="true"
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
                            initial={
                              prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
                            }
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
                              {getImageProps(activeImage).caption}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
                {/* Mobile: Caption below image */}
                {getImageProps(activeImage).caption && (
                  <div className="max-h-32 w-full max-w-2xl overflow-y-auto rounded-lg bg-black/40 p-4 backdrop-blur-sm md:hidden">
                    <p className="font-body text-sm leading-relaxed text-white">
                      {getImageProps(activeImage).caption}
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
                    aria-hidden="true"
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
          <nav
            className="fixed inset-x-0 bottom-0 flex justify-center gap-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pb-8 md:hidden"
            aria-label="Image navigation"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
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
                aria-hidden="true"
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
