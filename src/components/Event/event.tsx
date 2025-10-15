import { Calendar, Clock, MapPin } from "lucide-react";

interface EventProps {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: {
    src: string;
    alt: string;
  };
}

export default function Event({ title, description, date, time, location, image }: EventProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-3xl bg-green-600">
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-0"
      />
      <div className="absolute top-0 left-0 h-full w-full bg-green-900/60"></div>
      <div className="relative z-[2] space-y-8 p-8">
        <span className="rounded-xl border border-green-200 p-2 text-xs font-semibold tracking-wider text-green-200 uppercase">
          Upcoming
        </span>
        <h3 className="mt-6 font-display text-3xl text-green-50">{title}</h3>
        <p className="text-green-100">{description}</p>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex gap-2">
            <Calendar className="h-5 w-5 stroke-green-200" />
            <span className="font-body text-sm font-medium text-green-100">{date}</span>
          </div>
          <div className="flex gap-2">
            <Clock className="h-5 w-5 stroke-green-200" />
            <span className="font-body text-sm font-medium text-green-100">{time}</span>
          </div>
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 stroke-green-200" />
            <span className="font-body text-sm font-medium text-green-100">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
