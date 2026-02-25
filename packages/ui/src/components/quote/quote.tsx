import type { ReactNode } from "react";
import { Container } from "../container/container";
import { QuoteIcon } from "lucide-react";

export interface QuoteProps {
  quoteText?: string;
  attribution?: string;
  /** Optional background image slot -- render any image component here */
  backgroundSlot?: ReactNode;
}

export function Quote({
  quoteText = "Nature is not a luxury, but a necessity. We need the calming influences of green spaces to cleanse our souls and rejuvenate our spirits.",
  attribution = "Frederick Law Olmstead",
  backgroundSlot,
}: QuoteProps) {
  return (
    <Container spacing="none">
      <div className="relative w-full overflow-hidden rounded-2xl bg-primary-800 p-8 lg:p-16 dark:bg-primary-900">
        {backgroundSlot}
        <div className="absolute top-0 left-0 h-full w-full bg-primary-800/55 dark:bg-primary-900/60"></div>
        <div className="relative z-10 mx-auto max-w-3xl space-y-8 text-primary-50">
          <QuoteIcon className="text-primary-200 dark:text-primary-300" />
          <p className="max-w-3xl font-display text-xl font-normal text-primary-50 lg:text-3xl dark:text-primary-100">
            {quoteText}
          </p>
          <p className="font-body lg:text-xl">&mdash; {attribution}</p>
        </div>
      </div>
    </Container>
  );
}
