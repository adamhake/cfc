import { cn } from "../../utils/cn";

export interface EventStatusChipProps {
  isPast: boolean;
}

export function EventStatusChip({ isPast }: EventStatusChipProps) {
  const classes = cn(
    "inline-block rounded-xl border px-3 py-2 text-xs font-semibold tracking-wider uppercase shadow-sm",
    isPast
      ? "border-primary-300/50 bg-primary-800/60 text-primary-50 dark:border-primary-600/50 dark:bg-primary-700/50 dark:text-primary-100"
      : "border-accent-400/60 bg-accent-500 text-white dark:border-accent-400/70 dark:bg-accent-500 dark:text-grey-900",
  );

  return (
    <div className={classes}>
      <span>{isPast ? "Past" : "Upcoming"}</span>
    </div>
  );
}
