import { Image } from "@unpic/react";
import { QuoteIcon } from "lucide-react";

export default function Quote() {
  return (
    <div className="px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-green-800 px-8 py-16 dark:bg-green-900 lg:py-24">
        <Image
          src="/rock_sunset.webp"
          width={1600}
          height={1200}
          alt="Overlooking the city from Chimborazo Park"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-green-800/60 dark:bg-green-900/70"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-green-50">
          <QuoteIcon className="text-green-200 dark:text-green-300" />
          <p className="max-w-3xl font-body text-xl font-normal text-green-50 dark:text-green-100 lg:text-3xl">
            Nature is not a luxury, but a necessity. We need the calming influences of green spaces
            to cleanse our souls and rejuvenate our spirits.
          </p>
          <p className="font-display lg:text-xl">&mdash; Frederick Law Olmstead</p>
        </div>
      </div>
    </div>
  );
}
