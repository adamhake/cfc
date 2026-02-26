import { Image as UnpicImage, type ImageProps } from "@unpic/react";

export type { ImageProps };

/**
 * Wrapper around @unpic/react that enables Netlify Image CDN as fallback for
 * non-CDN/local image URLs (e.g. /foo.webp in public/).
 */
export function Image({ fallback = "netlify", ...props }: ImageProps) {
  return <UnpicImage fallback={fallback} {...props} />;
}
