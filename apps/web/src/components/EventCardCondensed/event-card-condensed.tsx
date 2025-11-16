import { Event as EventData } from "@/data/events";
import { formatDateString } from "@/utils/time";
import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { Image } from "@unpic/react";

export default function EventCardCondensed({
  title,
  slug,
  date,
  image,
}: Pick<EventData, "title" | "slug" | "date" | "image">) {
  const fmtDate = formatDateString(date, "short");

  return (
    <Link
      to="/events/$slug"
      params={{ slug }}
      className="group relative block overflow-hidden rounded-xl border border-accent-600/20 transition-all hover:shadow-md dark:border-accent-500/20"
    >
      {/* Image background */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
          layout="fullWidth"
        />
        <div className="absolute inset-0 bg-primary-900/60"></div>

        {/* Date badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-primary-900/80 px-3 py-1.5 backdrop-blur">
          <Calendar className="h-4 w-4 stroke-primary-100" />
          <span className="font-body text-sm font-medium text-primary-100">{fmtDate}</span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-grey-50 to-grey-50/80 p-4 dark:from-primary-900 dark:to-primary-900/80">
        <h3 className="line-clamp-2 font-display text-base leading-tight text-grey-900 dark:text-grey-100">
          {title}
        </h3>
        <span className="mt-2 inline-block font-body text-sm font-medium text-accent-700 transition group-hover:text-accent-600 dark:text-accent-400 dark:group-hover:text-accent-300">
          Learn More →
        </span>
      </div>
    </Link>
  );
}
