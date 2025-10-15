import { QuoteIcon } from "lucide-react";

export default function Quote() {
  return (
    <div className="px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-green-800 px-4 py-16 lg:py-24">
        <img
          src="/chimbo_arial.webp"
          alt="Quote Icon"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-green-800/60"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-green-50">
          <QuoteIcon className="text-green-200" />
          <p className="max-w-3xl font-body text-2xl font-normal text-green-50 lg:text-3xl">
            Nature is not a luxury, but a necessity. We need the calming influences of green spaces
            to cleanse our souls and rejuvenate our spirits.
          </p>
          <p className="font-display text-lg lg:text-xl">&mdash; Frederick Law Olmstead</p>
        </div>
      </div>
    </div>
  );
}
