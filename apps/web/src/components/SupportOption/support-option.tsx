import Chip from "@/components/Chip/chip";
import { Button } from "../Button/button";

interface SupportOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaHash?: string;
}

export default function SupportOption({
  title,
  description,
  icon,
  comingSoon,
  ctaText,
  ctaLink,
  ctaHash,
}: SupportOptionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-accent-600/20 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-transparent dark:bg-gradient-to-br dark:from-primary-950/90 dark:to-primary-950/10">
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <Chip variant="comingSoon" />
        </div>
      )}
      {/* Icon with circular background */}
      <div
        className="relative mb-4 inline-flex rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10"
        role="img"
        aria-label={`${title} icon`}
      >
        {icon}
      </div>
      <div className="relative">
        <h3 className="mb-2 font-display text-xl text-grey-900 dark:text-grey-100">{title}</h3>
        <p className="font-body leading-relaxed text-grey-700 dark:text-grey-300">{description}</p>
      </div>

      {ctaText && (ctaHash || ctaLink) && (
        <div className="mt-8">
          <Button variant="accent" size="small" as="a" hash={ctaHash} href={ctaLink}>
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  );
}
