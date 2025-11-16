import { Button } from "../Button/button";
import { Image } from "@unpic/react";

/**
 * Hero Variation 6: Soft Gradient with Gentle Divider
 * Combines the soft gradient layers with a very subtle, gentle wave transition
 */
export default function HeroSoftGradientDivider() {
  return (
    <div className="relative h-[75vh] w-full overflow-visible lg:h-[80vh]">
      {/* Hero Image */}
      <Image
        src="/bike_sunset.webp"
        alt="Chimborazo Park landscape with historic views of Richmond's Church Hill neighborhood"
        width={2000}
        height={1262}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchpriority="high"
        layout="fullWidth"
        breakpoints={[320, 640, 1280, 1920, 2000]}
      />

      {/* Soft flowing gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/75 via-primary-800/50 to-primary-700/30 dark:from-grey-900/80 dark:via-grey-900/60 dark:to-grey-800/40"></div>

      {/* Radial glow for depth */}
      <div className="bg-gradient-radial absolute inset-0 from-transparent via-transparent to-primary-900/40 dark:to-grey-900/50"></div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:items-end sm:px-6 lg:px-8">
        <div className="relative mb-8 w-full max-w-6xl space-y-6 sm:mb-12 lg:mb-24">
          <h1 className="font-display text-3xl text-primary-50 lg:text-5xl dark:text-grey-50">
            Restoring Chimborazo Park <br />
            for Our Community
          </h1>
          <p className="font-body text-base font-medium text-primary-100 md:text-lg lg:max-w-2xl dark:text-grey-100">
            We're dedicated to preserving and beautifying this historic East End treasure—creating a
            safe, inclusive greenspace that honors the past and serves future generations.
          </p>
          <div className="pb-4">
            <Button variant="secondary" size="small">
              Get Involved
            </Button>
          </div>
        </div>
      </div>

      {/* Organic wave divider - more pronounced */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* Flowing natural curve - like rolling hills */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-green-900"
          />
          {/* Accent color stroke following the curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-accent-500 dark:stroke-accent-500"
            strokeWidth="7"
          />
        </svg>
      </div>
    </div>
  );
}
