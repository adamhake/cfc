import NextImage, { type ImageProps as NextImageProps } from "next/image";

export type ImageProps = NextImageProps;

/**
 * Wrapper around next/image that provides a consistent API.
 * Replaces @unpic/react Image for the Next.js app.
 */
export function Image(props: ImageProps) {
  return <NextImage {...props} />;
}
