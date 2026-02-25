import { ReactNode } from "react";

/**
 * FlowingSection - Content with organic curved dividers between sections
 * Creates natural transitions like flowing water or rolling hills
 */

interface FlowingSectionProps {
  children: ReactNode;
  topWave?: boolean;
  bottomWave?: boolean;
  waveColor?: string;
  backgroundColor?: string;
  className?: string;
}

export default function FlowingSection({
  children,
  topWave = false,
  bottomWave = false,
  // NOTE: Callers that pass custom waveColor values using bg-* classes will need
  // to be updated to use fill-* classes instead, since SVG <path> uses fill, not background-color.
  waveColor = "fill-grey-50 dark:fill-green-900",
  backgroundColor = "bg-white dark:bg-grey-800",
  className = "",
}: FlowingSectionProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Top wave divider */}
      {topWave && (
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            className="relative block h-12 w-full lg:h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,50 Q300,80 600,50 T1200,50 L1200,0 L0,0 Z" className={waveColor} />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className={`${backgroundColor} ${topWave ? "pt-16" : ""} ${bottomWave ? "pb-16" : ""}`}>
        {children}
      </div>

      {/* Bottom wave divider */}
      {bottomWave && (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            className="relative block h-12 w-full lg:h-16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,50 Q300,20 600,50 T1200,50 L1200,100 L0,100 Z" className={waveColor} />
          </svg>
        </div>
      )}
    </div>
  );
}
