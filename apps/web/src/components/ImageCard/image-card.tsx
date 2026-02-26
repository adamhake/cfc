import { Image } from "@/components/OptimizedImage/optimized-image";
import { Button } from "../Button/button";

interface ImageCardProps {
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title?: string;
  description?: string;
  variant?: "overlay" | "caption-below" | "side-by-side";
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  imagePosition?: "left" | "right";
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
}

export default function ImageCard({
  image,
  title,
  description,
  variant = "overlay",
  ctaText,
  ctaLink,
  onCtaClick,
  imagePosition = "left",
  aspectRatio = "4/3",
}: ImageCardProps) {
  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16/9":
        return "aspect-video";
      case "4/3":
        return "aspect-4/3";
      case "1/1":
        return "aspect-square";
      default:
        return "";
    }
  };

  if (variant === "overlay") {
    return (
      <div className="group relative overflow-hidden rounded-2xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className={`relative ${getAspectClass()}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent dark:from-grey-900/90 dark:via-grey-900/40" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          {title && <h3 className="mb-2 font-display text-2xl text-white md:text-3xl">{title}</h3>}
          {description && (
            <p className="mb-4 font-body text-sm text-white/90 md:text-base">{description}</p>
          )}
          {ctaText && (
            <div>
              <Button
                variant="secondary"
                as={ctaLink ? "a" : "button"}
                href={ctaLink}
                onClick={onCtaClick}
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === "caption-below") {
    return (
      <div className="overflow-hidden rounded-2xl border border-accent-600/20 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-accent-500/20 dark:bg-grey-800">
        <div className={`relative overflow-hidden ${getAspectClass()}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-6 md:p-8">
          {title && (
            <h3 className="mb-3 font-display text-2xl text-primary-900 md:text-3xl dark:text-primary-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mb-6 font-body text-neutral-700 dark:text-neutral-300">{description}</p>
          )}
          {ctaText && (
            <Button
              variant="primary"
              as={ctaLink ? "a" : "button"}
              href={ctaLink}
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Side-by-side variant
  return (
    <div className="overflow-hidden rounded-2xl border border-accent-600/20 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-accent-500/20 dark:bg-grey-800">
      <div
        className={`flex flex-col md:flex-row ${imagePosition === "right" ? "md:flex-row-reverse" : ""}`}
      >
        <div className="relative md:w-1/2">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="h-64 w-full object-cover md:h-full"
          />
        </div>
        <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-8 lg:p-10">
          {title && (
            <h3 className="mb-3 font-display text-2xl text-primary-900 md:text-3xl dark:text-primary-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="mb-6 font-body text-neutral-700 dark:text-neutral-300">{description}</p>
          )}
          {ctaText && (
            <div>
              <Button
                variant="primary"
                as={ctaLink ? "a" : "button"}
                href={ctaLink}
                onClick={onCtaClick}
              >
                {ctaText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
