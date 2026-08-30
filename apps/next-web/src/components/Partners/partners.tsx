import { ExternalLink } from "lucide-react"
import Container from "@/components/Container/container"
import { Image } from "@/components/OptimizedImage/optimized-image"
import { SanityImage } from "@/components/SanityImage"

interface PartnerLogo {
  src: string
  alt: string
  width: number
  height: number
}

/**
 * Minimal Sanity-backed logo shape. Partner logos don't need hotspot/crop/caption,
 * so accept any object with an `asset` (mirrors SanityImage's structural contract).
 */
interface PartnerSanityLogo {
  asset?: unknown
  alt?: string | null
  [key: string]: unknown
}

interface Partner {
  name: string
  url?: string
  logo: PartnerLogo | PartnerSanityLogo
  description?: string
}

// Type guard to check if logo is a Sanity image
function isSanityLogo(logo: PartnerLogo | PartnerSanityLogo): logo is PartnerSanityLogo {
  return "asset" in logo && logo.asset !== undefined && logo.asset !== null
}

interface PartnersProps {
  partners?: Partner[]
  variant?: "full" | "compact"
}

export default function Partners({ partners, variant = "full" }: PartnersProps) {
  if (!partners || partners.length === 0) {
    return null
  }

  if (variant === "compact") {
    return (
      <Container spacing="none">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 md:grid-cols-4 dark:border-neutral-300 dark:bg-neutral-300">
          {partners.map((partner) => {
            const logo = isSanityLogo(partner.logo) ? (
              <SanityImage
                image={partner.logo as Parameters<typeof SanityImage>[0]["image"]}
                alt={partner.logo.alt || partner.name}
                className="mx-auto max-h-12 w-auto max-w-40 object-contain"
                sizes="(max-width: 768px) 160px, 200px"
                maxWidth={240}
                showPlaceholder={false}
                quality={90}
              />
            ) : (
              <Image
                width={partner.logo.width}
                height={partner.logo.height}
                src={partner.logo.src}
                alt={partner.logo.alt}
                className="mx-auto max-h-12 w-auto max-w-40 object-contain"
              />
            )
            const className =
              "group flex min-h-36 flex-col items-center justify-center gap-4 bg-grey-50 p-6 text-center transition-colors hover:bg-neutral-100 dark:bg-neutral-200 dark:hover:bg-neutral-100"
            const content = (
              <>
                {logo}
                <span className="flex items-center justify-center gap-1.5 font-display text-sm leading-tight text-grey-700 transition-colors group-hover:text-accent-800 dark:text-grey-800 dark:group-hover:text-accent-800">
                  {partner.name}
                  {partner.url && (
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                </span>
              </>
            )

            return partner.url ? (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={`${partner.name} (opens in a new window)`}
              >
                {content}
              </a>
            ) : (
              <div key={partner.name} className={className}>
                {content}
              </div>
            )
          })}
        </div>
      </Container>
    )
  }

  return (
    <Container spacing="none">
      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
        {partners.map((partner) => {
          const cardContent = (
            // biome-ignore lint/correctness/useJsxKeyInIterable: key is on the parent a/div wrapper, not this intermediate variable
            <div className="relative space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-center rounded-xl bg-white p-6 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border dark:border-primary-500/50 dark:bg-grey-200">
                {isSanityLogo(partner.logo) ? (
                  <SanityImage
                    image={partner.logo as Parameters<typeof SanityImage>[0]["image"]}
                    alt={partner.logo.alt || partner.name}
                    className="mx-auto h-auto max-w-48"
                    sizes="(max-width: 768px) 200px, 275px"
                    maxWidth={275}
                    showPlaceholder={false}
                    quality={90}
                  />
                ) : (
                  <Image
                    width={partner.logo.width}
                    height={partner.logo.height}
                    src={partner.logo.src}
                    alt={partner.logo.alt}
                    className="mx-auto max-w-48"
                  />
                )}
              </div>

              {/* Partner Name with External Link Icon */}
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-display text-xl text-grey-900 transition-colors group-hover:text-accent-700 md:text-2xl dark:text-grey-100 dark:group-hover:text-accent-400">
                  {partner.name}
                </h3>
                {partner.url && (
                  <ExternalLink className="h-5 w-5 stroke-accent-600 opacity-0 transition-opacity group-hover:opacity-100 dark:stroke-accent-400" />
                )}
              </div>

              {/* Description */}
              <p className="text-center font-body text-sm leading-relaxed text-grey-700 md:text-base dark:text-grey-300">
                {partner.description}
              </p>
            </div>
          )

          const sharedClassName =
            "group relative overflow-hidden rounded-2xl border border-primary-200 bg-grey-50 p-8 transition-all duration-300 hover:border-accent-500 lg:p-10 dark:border-primary-700 dark:bg-primary-950"

          return partner.url ? (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={sharedClassName}
            >
              {cardContent}
            </a>
          ) : (
            <div key={partner.name} className={sharedClassName}>
              {cardContent}
            </div>
          )
        })}
      </div>
    </Container>
  )
}
