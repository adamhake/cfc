import Chip from "@/components/Chip/chip"
import { Button } from "../Button/button"

interface SupportOptionProps {
  title: string
  description: string
  icon?: React.ReactNode
  comingSoon?: boolean
  ctaText?: string
  ctaLink?: string
  ctaHash?: string
  variant?: "card" | "wall"
}

export default function SupportOption({
  title,
  description,
  icon,
  comingSoon,
  ctaText,
  ctaLink,
  ctaHash,
  variant = "card",
}: SupportOptionProps) {
  return (
    <div
      className={
        variant === "wall"
          ? "group relative flex min-h-64 flex-col bg-grey-50 p-6 md:p-8 dark:bg-primary-950"
          : "group relative overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 p-6 transition-all duration-300 hover:border-accent-500 dark:border-primary-700 dark:bg-primary-950"
      }
    >
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <Chip variant="comingSoon" />
        </div>
      )}
      {icon && (
        <div
          className="relative mb-4 inline-flex self-start rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10"
          role="img"
          aria-label={`${title} icon`}
        >
          {icon}
        </div>
      )}
      <div className="relative">
        <h3 className="mb-2 font-display text-xl text-grey-900 dark:text-grey-100">{title}</h3>
        <p className="font-body leading-relaxed text-grey-700 dark:text-grey-300">{description}</p>
      </div>

      {ctaText && (ctaHash || ctaLink) && (
        <div className="mt-auto pt-8">
          <Button
            variant="accent"
            size="small"
            as="a"
            hash={ctaHash}
            href={ctaLink}
            trackingLocation="support-option"
          >
            {ctaText}
          </Button>
        </div>
      )}
    </div>
  )
}
