import Container from "@/components/Container/container";
import { Image } from "@/components/OptimizedImage/optimized-image";
import type { SanityImageObject } from "@/components/SanityImage/sanity-image";
import { SanityImage } from "@/components/SanityImage/sanity-image";
import { QuoteIcon } from "lucide-react";

interface QuoteProps {
  quoteText?: string;
  attribution?: string;
  backgroundImage?:
    | SanityImageObject
    | {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
}

export default function Quote({
  quoteText = "Nature is not a luxury, but a necessity. We need the calming influences of green spaces to cleanse our souls and rejuvenate our spirits.",
  attribution = "Frederick Law Olmstead",
  backgroundImage,
}: QuoteProps) {
  // Check if backgroundImage is a SanityImageObject (has 'asset' property)
  const isSanityImage = backgroundImage && "asset" in backgroundImage;

  return (
    <Container spacing="none">
      <div className="relative w-full overflow-hidden rounded-2xl bg-primary-800 p-8 lg:p-16 dark:bg-primary-900">
        {isSanityImage ? (
          <SanityImage
            image={backgroundImage as SanityImageObject}
            alt={(backgroundImage as SanityImageObject).alt || "Background image"}
            className="absolute inset-0 h-full w-full"
            sizes="(max-width: 1280px) 100vw, 1152px"
            maxWidth={1152}
            breakpoints={[640, 768, 896, 1024, 1152]}
            quality={70}
            useHotspotPosition
          />
        ) : backgroundImage && "src" in backgroundImage ? (
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            width={backgroundImage.width}
            height={backgroundImage.height}
            className="absolute inset-0 h-full w-full object-cover"
            layout="constrained"
            loading="lazy"
            sizes="(max-width: 1280px) 100vw, 1152px"
            breakpoints={[640, 768, 896, 1024, 1152]}
          />
        ) : null}
        <div className="absolute top-0 left-0 h-full w-full bg-primary-800/55 dark:bg-primary-900/60"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-primary-50">
          <QuoteIcon className="text-primary-200 dark:text-primary-300" />
          <p className="max-w-3xl font-display text-xl font-normal text-primary-50 lg:text-3xl dark:text-primary-100">
            {quoteText}
          </p>
          <p className="font-body lg:text-xl">&mdash; {attribution}</p>
        </div>
      </div>
    </Container>
  );
}
