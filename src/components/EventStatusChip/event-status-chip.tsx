import { cn } from "@/utils/cn";

export default function EventStatusChip({ isPast }: { isPast: boolean }) {
  const classes = cn(
    "inline-block rounded-xl border px-3 py-2 text-xs font-semibold tracking-wider uppercase shadow-sm",
    isPast
      ? "border-grey-400/50 bg-grey-800/70 text-grey-100 dark:border-grey-500/50 dark:bg-grey-700/80 dark:text-grey-50"
      : "border-accent-400/60 bg-accent-500 text-white dark:border-accent-400/70 dark:bg-accent-500 dark:text-grey-900",
  );

  return (
    <div className={classes}>
      <span>{isPast ? "Past" : "Upcoming"}</span>
    </div>
  );
}
