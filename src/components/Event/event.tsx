import { Event as EventData } from "@/data/events";
import { formatDateString } from "@/utils/time";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Calendar, Clock, MapPin } from "lucide-react";
import EventStatusChip from "../EventStatusChip/event-status-chip";

export default function Event({
  title,
  slug,
  description,
  date,
  time,
  location,
  image,
}: EventData) {
  const isPast = new Date(date) < new Date();
  const fmtDate = formatDateString(date, "short");

  return (
    <Link
      to="/events/$slug"
      params={{ slug }}
      className="group relative block min-h-[400px] cursor-pointer overflow-hidden rounded-2xl border border-accent-600/20 bg-primary-600 transition-transform active:scale-98 md:min-h-[450px] dark:border-accent-500/20 dark:bg-primary-700"
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-0"
      />
      <div className="absolute top-0 left-0 h-full w-full bg-primary-900/60 dark:bg-grey-900/70"></div>
      <div className="relative z-10 space-y-6 p-8 md:space-y-8">
        <EventStatusChip isPast={isPast} />
        <h3 className="font-display text-3xl text-primary-50 dark:text-grey-100">{title}</h3>
        <p className="font-body text-lg text-primary-50 dark:text-grey-200">{description}</p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <Calendar className="h-5 w-5 stroke-primary-200 dark:stroke-grey-300" />
            <span className="font-body font-medium text-primary-100 dark:text-grey-300">
              {fmtDate}
            </span>
          </div>
          <div className="flex gap-2">
            <Clock className="h-5 w-5 stroke-primary-200 dark:stroke-grey-300" />
            <span className="font-body font-medium text-primary-100 dark:text-grey-300">
              {time}
            </span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 stroke-primary-200 dark:stroke-grey-300" />
            <span className="font-body font-medium text-primary-100 dark:text-grey-300">
              {location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
