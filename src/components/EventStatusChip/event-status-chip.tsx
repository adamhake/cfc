import { cn } from "@/utils/cn";

export default function EventStatusChip({ isPast }: { isPast: boolean }) {
  const classes = cn(
    "inline-block rounded-xl border border-primary-200 p-2 text-xs font-semibold tracking-wider uppercase dark:border-primary-600",
    isPast ? "text-primary-200 dark:text-primary-300" : "text-primary-800 dark:text-primary-900",
    isPast ? "bg-transparent dark:bg-transparent" : "bg-primary-200 dark:bg-primary-400",
  );

  return (
    <div className={classes}>
      <span>{isPast ? "Past" : "Upcoming"}</span>
    </div>
  );
}
