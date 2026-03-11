"use client"

import type { PortableTextBlock } from "@portabletext/react"
import { useState } from "react"
import { Button } from "@/components/Button/button"
import ImageGallery, { type SanityGalleryImage } from "@/components/ImageGallery/image-gallery"
import { PortableText } from "@/components/PortableText/portable-text"

interface EventDetailClientProps {
  recap: PortableTextBlock[]
  body?: PortableTextBlock[]
  recapGalleryImages: SanityGalleryImage[]
}

export default function EventDetailClient({
  recap,
  body,
  recapGalleryImages,
}: EventDetailClientProps) {
  const [showOriginalDetails, setShowOriginalDetails] = useState(false)

  if (!showOriginalDetails) {
    return (
      <>
        <div className="mb-10 space-y-8 rounded-2xl border border-primary-700 p-8">
          <p className="font-body text-lg text-grey-900 dark:text-grey-100">
            This event has passed, but read below for a recap. You can also view the original event
            details here:{" "}
          </p>
          <Button variant="outline" size="small" onClick={() => setShowOriginalDetails(true)}>
            View original event details
          </Button>
        </div>
        <PortableText value={recap} />
        {recapGalleryImages.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 font-display text-2xl font-semibold text-primary-700 dark:text-primary-500">
              Event Photos
            </h2>
            <ImageGallery
              images={recapGalleryImages}
              variant="masonry"
              columns={{ default: 1, sm: 2, md: 2, lg: 3 }}
              gap="md"
              showCaptions={true}
              captionPosition="hover"
            />
          </div>
        )}
        <div className="mt-8">
          <Button variant="outline" size="small" onClick={() => setShowOriginalDetails(true)}>
            View original event details
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      {body ? (
        <PortableText value={body} />
      ) : (
        <div className="rounded-2xl border border-primary-200 bg-primary-50/30 p-8 md:p-12 dark:border-primary-700/30 dark:bg-primary-900/20">
          <p className="font-body text-lg leading-relaxed text-grey-700 dark:text-grey-300">
            No original event details available.
          </p>
        </div>
      )}
      <div className="mt-8">
        <Button variant="outline" size="small" onClick={() => setShowOriginalDetails(false)}>
          View event recap
        </Button>
      </div>
    </>
  )
}
