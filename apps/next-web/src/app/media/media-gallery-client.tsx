"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/Button/button"
import ImageGallery, { type SanityGalleryImage } from "@/components/ImageGallery/image-gallery"
import type { SanityMediaImage } from "@/lib/sanity-types"

interface MediaGalleryClientProps {
  initialImages: SanityMediaImage[]
  totalCount: number
  pageSize: number
}

function transformImages(images: SanityMediaImage[]): SanityGalleryImage[] {
  return images
    .filter(
      (img) =>
        img?.image?.asset?.url &&
        img?.image?.asset?.metadata?.dimensions?.width &&
        img?.image?.asset?.metadata?.dimensions?.height,
    )
    .map((img) => ({
      ...img.image,
      alt: img.image.alt || img.title || "Park image",
    }))
}

export default function MediaGalleryClient({
  initialImages,
  totalCount,
  pageSize,
}: MediaGalleryClientProps) {
  const [allImages, setAllImages] = useState<SanityMediaImage[]>(initialImages)
  const [isLoading, setIsLoading] = useState(false)
  const [cursor, setCursor] = useState(pageSize)

  const hasMore = cursor < totalCount

  const loadMore = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      // Read cursor from state updater to avoid stale closure
      const currentCursor = cursor
      const res = await fetch(`/api/media?start=${currentCursor}&end=${currentCursor + pageSize}`)
      if (res.ok) {
        const newImages: SanityMediaImage[] = await res.json()
        if (newImages.length > 0) {
          setAllImages((prev) => [...prev, ...newImages])
          setCursor((prev) => prev + pageSize)
        }
      }
    } catch (error) {
      console.error("Failed to load more images:", error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, pageSize, isLoading])

  const galleryImages = transformImages(allImages)

  if (totalCount === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-primary-200 bg-primary-50/30 p-12 text-center dark:border-primary-700/30 dark:bg-primary-900/20">
        <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
          No Images Yet
        </h2>
        <p className="font-body text-lg text-grey-700 dark:text-grey-300">
          Check back soon for photos of our park and community events!
        </p>
      </div>
    )
  }

  if (galleryImages.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-primary-200 bg-primary-50/30 p-12 text-center dark:border-primary-700/30 dark:bg-primary-900/20">
        <h2 className="mb-3 font-display text-2xl font-semibold text-grey-900 dark:text-grey-100">
          No Valid Images
        </h2>
        <p className="font-body text-lg text-grey-700 dark:text-grey-300">
          Some images were found but they're missing required metadata. Check the console for
          details.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <ImageGallery
        images={galleryImages}
        variant="masonry"
        columns={{ default: 1, sm: 2, md: 3, lg: 3 }}
        showCaptions={true}
        captionPosition="hover"
        gap="lg"
      />
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="primary" size="standard" disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More Photos"}
          </Button>
        </div>
      )}
    </div>
  )
}
