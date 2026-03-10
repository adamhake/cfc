"use client";

import Chip from "@/components/Chip/chip";

interface EventStatusChipProps {
  /** ISO date string for the event */
  eventDate: string;
  className?: string;
}

/**
 * Client component that renders a past/upcoming chip based on the current date.
 * Used in server-rendered pages to avoid forcing dynamic rendering with connection().
 */
export default function EventStatusChip({ eventDate, className }: EventStatusChipProps) {
  const eventDay = new Date(eventDate);
  const today = new Date();
  const isPast =
    new Date(eventDay.getFullYear(), eventDay.getMonth(), eventDay.getDate()) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return <Chip label={isPast ? "Past" : "Upcoming"} variant={isPast ? "past" : "upcoming"} className={className} />;
}
