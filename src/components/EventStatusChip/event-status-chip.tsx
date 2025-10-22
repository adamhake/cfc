import { cn } from "@/utils/cn";

export default function EventStatusChip({ isPast }: { isPast: boolean }) {
  const classes = cn(
    "inline-block rounded-xl border border-green-200 p-2 text-xs font-semibold tracking-wider uppercase dark:border-green-600",
    isPast ? "text-green-200 dark:text-green-300" : "text-green-800 dark:text-green-900",
    isPast ? "bg-transparent dark:bg-transparent" : "bg-green-200 dark:bg-green-400",
  );

  return (
    <div className={classes}>
      <span>{isPast ? "Past" : "Upcoming"}</span>
    </div>
  );
}
