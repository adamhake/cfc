import { Event as EventData } from "@/data/events";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Calendar, Clock, MapPin } from "lucide-react";
import EventStatusChip from "../EventStatusChip/event-status-chip";
import { formatDateString } from "@/utils/time";

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
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-green-600"
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-0"
      />
      <div className="absolute top-0 left-0 h-full w-full bg-green-900/60"></div>
      <div className="relative z-[2] space-y-8 p-8">
        <EventStatusChip isPast={isPast} />
        <h3 className="font-display text-3xl text-green-50">{title}</h3>
        <p className="text-lg text-green-50">{description}</p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <Calendar className="h-5 w-5 stroke-green-200" />
            <span className="font-body font-medium text-green-100">{fmtDate}</span>
          </div>
          <div className="flex gap-2">
            <Clock className="h-5 w-5 stroke-green-200" />
            <span className="font-body font-medium text-green-100">{time}</span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 stroke-green-200" />
            <span className="font-body font-medium text-green-100">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
