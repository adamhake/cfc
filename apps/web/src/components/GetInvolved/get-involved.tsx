import Container from "@/components/Container/container";
import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon";
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GetInvolvedProps {
  title?: string;
  description?: string;
  gutter?: "default" | "none";
  id?: string;
}

export default function GetInvolved({
  title = "Get Involved",
  description = "Join our community of volunteers and supporters. Get updates on park projects, upcoming events, and opportunities to make a difference in Chimborazo Park.",
  gutter = "default",
  id = "get-involved",
}: GetInvolvedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: siteSettings } = useSiteSettings();
  const prefersReducedMotion = useReducedMotion();

  // Get images from the gallery in site settings, or use empty array as fallback
  // Type assertion needed until GROQ types are regenerated
  const images =
    (
      siteSettings as unknown as {
        getInvolvedGallery?: {
          images?: Array<{
            image?:
              | SanityImageObject
              | {
                  image?: SanityImageObject;
                };
          }>;
        };
      }
    )?.getInvolvedGallery?.images
      ?.map((item) => {
        if (!item.image) return null;
        if ("asset" in item.image) return item.image;
        return item.image.image || null;
      })
      .filter((img): img is SanityImageObject => img != null) || [];

  useEffect(() => {
    // Only cycle images if user hasn't requested reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [prefersReducedMotion, images.length]);

  return (
    <Container spacing="none" gutter={gutter} id={id}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-md dark:border dark:border-primary-700 dark:bg-primary-950">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image side with cycling images */}
          <div className="relative h-64 lg:h-auto">
            {images.length > 0 ? (
              <>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={currentImageIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <SanityImage
                      image={images[currentImageIndex]}
                      alt={images[currentImageIndex].alt || ""}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="h-full w-full object-cover"
                      priority={currentImageIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 to-accent-800/25 dark:from-accent-900/20 dark:to-accent-950/30"></div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center bg-accent-100 dark:bg-accent-900">
                <p className="text-accent-600 dark:text-accent-400">No images available</p>
              </div>
            )}
          </div>

          {/* Content side */}
          <div className="space-y-8 p-8 lg:p-12">
            <div className="space-y-3 text-grey-900 dark:text-grey-100">
              <h2 className="font-display text-3xl font-semibold md:text-4xl">{title}</h2>
              <p className="font-body text-base leading-relaxed text-grey-800 md:text-lg dark:text-grey-200">
                {description}
              </p>
            </div>

            {/* Email signup form */}
            <NewsletterForm source="homepage-widget" label="Stay updated" />

            {/* Social links */}
            <div className="border-t border-accent-200/50 pt-6 dark:border-accent-700/30">
              <h3 className="mb-3 font-display text-lg font-medium dark:text-grey-100">
                Follow us online
              </h3>
              <div className="flex gap-4">
                <a
                  href={
                    siteSettings?.socialMedia?.facebook ||
                    "https://www.facebook.com/friendsofchimborazopark"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook (opens in new window)"
                  className="rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border dark:border-accent-600/30 dark:bg-transparent"
                >
                  <FacebookIcon className="h-6 w-6 fill-accent-700 dark:fill-accent-400" />
                </a>
                <a
                  href={
                    siteSettings?.socialMedia?.instagram ||
                    "https://www.instagram.com/friendsofchimborazopark/"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram (opens in new window)"
                  className="rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 dark:border dark:border-accent-600/30 dark:bg-transparent"
                >
                  <InstagramIcon className="h-6 w-6 fill-accent-700 dark:fill-accent-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
