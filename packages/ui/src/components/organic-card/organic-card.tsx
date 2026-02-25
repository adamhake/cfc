import type { ReactNode } from "react";

export interface OrganicCardProps {
  children: ReactNode;
  variant?: "subtle" | "medium" | "bold";
  tilt?: "none" | "slight" | "medium";
  className?: string;
}

const borderRadiusVariants = {
  subtle: "2rem 3rem 2rem 3rem / 2.5rem 2rem 2.5rem 2rem",
  medium: "2rem 4rem 2rem 4rem / 3rem 2rem 3rem 2rem",
  bold: "2rem 5rem 2rem 5rem / 4rem 2rem 4rem 2rem",
};

const tiltClasses = {
  none: "",
  slight: "rotate-[0.5deg]",
  medium: "rotate-[1deg]",
};

export function OrganicCard({
  children,
  variant = "medium",
  tilt = "none",
  className = "",
}: OrganicCardProps) {
  return (
    <div
      className={`transition-transform ${tiltClasses[tilt]} ${className}`}
      style={{
        borderRadius: borderRadiusVariants[variant],
      }}
    >
      {children}
    </div>
  );
}
