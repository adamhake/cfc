import { cn } from "@/helpers/cn";

export default function EventStatusChip({ isPast }: { isPast: boolean }) {
  const classes = cn(
    "inline-block rounded-xl border border-green-200 p-2 text-xs font-semibold tracking-wider uppercase",
    isPast ? "text-green-200" : "text-green-800",
    isPast ? "bg-transparent" : "bg-green-200",
  );

  return (
    <div className={classes}>
      <span>{isPast ? "Past" : "Upcoming"}</span>
    </div>
  );
}
