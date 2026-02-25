import type { ReactNode } from "react";

export interface FlowingSectionProps {
  children: ReactNode;
  topWave?: boolean;
  bottomWave?: boolean;
  waveColor?: string;
  backgroundColor?: string;
  className?: string;
}

export function FlowingSection({
  children,
  topWave = false,
  bottomWave = false,
  waveColor = "fill-grey-50 dark:fill-green-900",
  backgroundColor = "bg-white dark:bg-grey-800",
  className = "",
}: FlowingSectionProps) {
  return (
    <div className={`relative ${className}`}>
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

      <div className={`${backgroundColor} ${topWave ? "pt-16" : ""} ${bottomWave ? "pb-16" : ""}`}>
        {children}
      </div>

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
