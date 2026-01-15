import type { SanityEvent } from "@/lib/sanity-types";
import { formatDateString } from "@/utils/time";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin } from "lucide-react";
import Chip from "../Chip/chip";
import { SanityImage } from "../SanityImage/sanity-image";

export default function Event({
  title,
  slug,
  description,
  date,
  time,
  location,
  heroImage,
}: SanityEvent) {
  const isPast = new Date(date) < new Date();
  const fmtDate = formatDateString(date, "short");

  return (
    <Link
      to="/events/$slug"
      params={{ slug: slug.current }}
      className="group relative block min-h-[400px] cursor-pointer overflow-hidden rounded-2xl border border-accent-600/20 transition-transform active:scale-98 md:min-h-[450px] dark:border-accent-500/20"
    >
      <SanityImage
        image={heroImage}
        alt={heroImage.alt}
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-0"
        sizes="(max-width: 768px) 100vw, 50vw"
        useHotspotPosition
      />
      <div className="absolute top-0 left-0 h-full w-full bg-primary-900/55 dark:bg-primary-950/60"></div>
      <div className="relative z-10 space-y-6 p-8 md:space-y-8">
        <Chip variant={isPast ? "past" : "upcoming"} />
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
