import NextImage, { type ImageProps as NextImageProps } from "next/image"

export type ImageProps = NextImageProps

/**
 * Wrapper around next/image with sensible defaults for quality and loading.
 */
export function Image({ quality = 80, loading = "lazy", ...props }: ImageProps) {
  return <NextImage quality={quality} loading={loading} {...props} />
}
