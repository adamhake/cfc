import { cn } from "@/utils/cn"

interface WaveDividerProps {
  /**
   * Fill for the area *below* the curve — i.e. the surface the wave is
   * introducing. Everything above the curve stays transparent and shows
   * whatever is behind it.
   */
  fill: string
  /** Mirrors the curve horizontally. Use to vary the shape between dividers. */
  flip?: boolean
  className?: string
}

/**
 * The James River wave — the site's signature divider, taken from the park's
 * view of the river.
 *
 * Note it is never rotated: rotating moves the filled half to the top edge,
 * which puts the incoming surface color *above* the curve and defeats the
 * point. `flip` mirrors on the x-axis instead, which varies the shape while
 * keeping the fill below the line.
 */
export function WaveDivider({ fill, flip = false, className }: WaveDividerProps) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={cn("block h-16 w-full lg:h-24", flip && "-scale-x-100", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
        className={fill}
      />
      <path
        d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
        className="fill-none stroke-soft-blue-600 dark:stroke-soft-blue-400"
        strokeWidth="7"
      />
    </svg>
  )
}
