import { cn } from "../../utils/cn";

export type ChipVariant =
  // Project status
  | "planned"
  | "active"
  | "completed"
  // Project category
  | "restoration"
  | "recreation"
  | "connection"
  | "preservation"
  // Event status
  | "upcoming"
  | "past"
  // General
  | "comingSoon";

export interface ChipProps {
  variant: ChipVariant;
  label?: string;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  // Project Status
  planned: "bg-accent-600 text-white dark:bg-accent-500",
  active: "bg-primary-600 text-white dark:bg-primary-500",
  completed: "bg-grey-600 text-white dark:bg-grey-500",

  // Project Category
  restoration: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
  recreation: "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200",
  connection: "bg-heather-100 text-heather-800 dark:bg-heather-900 dark:text-heather-200",
  preservation: "bg-terra-100 text-terra-800 dark:bg-terra-900 dark:text-terra-200",

  // Event Status
  upcoming: "bg-accent-500 text-white dark:bg-accent-500 dark:text-grey-900",
  past: "bg-primary-800 text-primary-50 dark:bg-primary-700 dark:text-primary-100",

  // General
  comingSoon: "bg-grey-200 text-grey-700 dark:bg-grey-700 dark:text-grey-200",
};

const defaultLabels: Record<ChipVariant, string> = {
  // Project Status
  planned: "Planned",
  active: "Active",
  completed: "Completed",

  // Project Category
  restoration: "Restoration",
  recreation: "Recreation",
  connection: "Connection",
  preservation: "Preservation",

  // Event Status
  upcoming: "Upcoming",
  past: "Past",

  // General
  comingSoon: "Coming Soon",
};

export function Chip({ variant, label, className }: ChipProps) {
  const displayLabel = label ?? defaultLabels[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-3 py-1 font-body text-sm font-semibold",
        variantStyles[variant],
        className,
      )}
    >
      {displayLabel}
    </span>
  );
}
