import { FacebookIcon } from "@/components/FacebookIcon/facebook-icon";
import { InstagramIcon } from "@/components/InstagramIcon/instagram-icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../Button/button";

interface GetInvolvedProps {
  title?: string;
  description?: string;
}

const images = [
  { src: "/get_involved.webp", alt: "Volunteers at Chimborazo Park" },
  { src: "/cleanup_2024.webp", alt: "Community park cleanup event" },
  { src: "/grove_cleanup.webp", alt: "Tree grove restoration" },
  { src: "/volunteers.webp", alt: "Park volunteers gathering" },
];

export default function GetInvolved({
  title = "Get Involved",
  description = "Join our community of volunteers and supporters. Get updates on park projects, upcoming events, and opportunities to make a difference in Chimborazo Park.",
}: GetInvolvedProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: siteSettings } = useSiteSettings();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Only cycle images if user hasn't requested reduced motion
    if (prefersReducedMotion) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="px-4 lg:px-0">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-md dark:border dark:border-accent-600/20 dark:bg-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image side with cycling images */}
            <div className="relative h-64 lg:h-auto">
              <AnimatePresence initial={false}>
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-br from-accent-600/20 to-accent-800/25 dark:from-accent-900/20 dark:to-accent-950/30"></div>
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
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <label
                  htmlFor="email-signup"
                  className="block font-body text-sm font-medium text-grey-800 dark:text-grey-200"
                >
                  Stay updated
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="email-signup"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    aria-required="true"
                    className="flex-1 rounded-xl border border-accent-300 bg-white px-4 py-3 font-body text-grey-900 placeholder-grey-500 shadow-sm transition focus:border-accent-600 focus:ring-2 focus:ring-accent-600/20 focus:outline-none dark:border-accent-600/30 dark:bg-transparent dark:text-grey-100 dark:placeholder-grey-400 dark:focus:border-accent-500 dark:focus:ring-accent-500/20"
                  />
                  <Button type="submit" variant="accent" size="small">
                    Subscribe
                  </Button>
                </div>
              </form>

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
      </div>
    </div>
  );
}
