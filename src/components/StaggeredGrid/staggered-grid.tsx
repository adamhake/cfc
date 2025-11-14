import { ReactNode } from "react";

/**
 * StaggeredGrid - Organic grid layout with offset items
 * Items are positioned at varying vertical offsets for a more natural, less rigid feel
 */

interface StaggeredGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  stagger?: "subtle" | "medium" | "pronounced";
}

const gapClasses = {
  sm: "gap-6",
  md: "gap-10 md:gap-14",
  lg: "gap-14 md:gap-20",
};

const columnClasses = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

// Stagger patterns - alternating vertical offsets
const staggerPatterns = {
  subtle: ["mt-0", "mt-4", "mt-0", "mt-4"],
  medium: ["mt-0", "mt-8", "mt-4", "mt-12"],
  pronounced: ["mt-0", "mt-12", "mt-6", "mt-16"],
};

export default function StaggeredGrid({
  children,
  columns = 2,
  gap = "md",
  stagger = "medium",
}: StaggeredGridProps) {
  const items = Array.isArray(children) ? children : [children];
  const pattern = staggerPatterns[stagger];

  return (
    <div className={`grid grid-cols-1 ${columnClasses[columns]} ${gapClasses[gap]}`}>
      {items.map((child, index) => (
        <div key={index} className={pattern[index % pattern.length]}>
          {child}
        </div>
      ))}
    </div>
  );
}
