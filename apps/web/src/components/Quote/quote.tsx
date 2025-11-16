import { Image } from "@unpic/react";
import { QuoteIcon } from "lucide-react";

export default function Quote() {
  return (
    <div className="px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl bg-primary-800 p-8 lg:p-16 dark:bg-primary-900">
        <Image
          src="/rock_sunset.webp"
          width={1600}
          height={1200}
          alt="Overlooking the city from Chimborazo Park"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-primary-800/60 dark:bg-primary-900/70"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-primary-50">
          <QuoteIcon className="text-primary-200 dark:text-primary-300" />
          <p className="max-w-3xl font-body text-xl font-normal text-primary-50 lg:text-3xl dark:text-primary-100">
            Nature is not a luxury, but a necessity. We need the calming influences of green spaces
            to cleanse our souls and rejuvenate our spirits.
          </p>
          <p className="font-display lg:text-xl">&mdash; Frederick Law Olmstead</p>
        </div>
      </div>
    </div>
  );
}
