import { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  children?: ReactNode;
  height?: "small" | "medium" | "large";
}

export default function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  children,
  height = "medium",
}: PageHeroProps) {
  const heightClasses = {
    small: "h-[45vh]",
    medium: "h-[60vh]",
    large: "h-[65vh]",
  };

  return (
    <header
      className={`relative ${heightClasses[height]} w-full overflow-visible`}
      role="banner"
      aria-label="Page header"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-900/70 to-primary-800/50"
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="text-center">
            <h1 className="font-display text-5xl text-primary-50 md:text-6xl">{title}</h1>
            {subtitle && (
              <p className="mt-4 font-body text-xl text-primary-100 md:text-2xl">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>

      {/* Organic wave divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-16 w-full lg:h-24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* Flowing natural curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60 L1200,120 L0,120 Z"
            className="fill-grey-50 dark:fill-green-900"
          />
          {/* Accent color stroke following the curve */}
          <path
            d="M0,60 C300,90 500,30 700,60 C900,90 1050,40 1200,60"
            className="fill-none stroke-accent-600 dark:stroke-accent-500"
            strokeWidth="7"
          />
        </svg>
      </div>
    </header>
  );
}
