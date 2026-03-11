import { getAboutPageQuery } from "@chimborazo/sanity-config/queries"
import type { Metadata } from "next"
import Container from "@/components/Container/container"
import GetInvolved from "@/components/GetInvolved/get-involved"
import PageHeroOptimistic from "@/components/PageHero/page-hero-optimistic"
import { PortableText } from "@/components/PortableText/portable-text"
import type { SanityImageObject } from "@/components/SanityImage/sanity-image"
import { SanityImage } from "@/components/SanityImage/sanity-image"
import SectionHeader from "@/components/SectionHeader/section-header"
import { CACHE_TAGS, sanityFetch } from "@/lib/sanity-fetch"
import type { SanityAboutPage, SanityBoardMember, SanityHighlight } from "@/lib/sanity-types"
import { getSiteSettings } from "@/lib/site-settings"
import { SITE_CONFIG } from "@/utils/seo"

export const metadata: Metadata = {
  title: "About the Chimborazo Park Conservancy",
  description:
    "A 501(c)(3) nonprofit dedicated to restoring and preserving historic Chimborazo Park in Richmond, VA. Learn about our mission, board, and community impact.",
  alternates: { canonical: `${SITE_CONFIG.url}/about` },
  openGraph: {
    title: "About the Chimborazo Park Conservancy",
    description:
      "A 501(c)(3) nonprofit dedicated to restoring and preserving historic Chimborazo Park in Richmond, VA. Learn about our mission, board, and community impact.",
    type: "website",
    url: `${SITE_CONFIG.url}/about`,
  },
}

export default async function AboutPage() {
  const [{ data: pageData }, siteSettings] = await Promise.all([
    sanityFetch({
      query: getAboutPageQuery,
      tags: [CACHE_TAGS.ABOUT],
    }) as Promise<{ data: SanityAboutPage | null }>,
    getSiteSettings(),
  ])

  const getInvolvedGalleryImages =
    (
      siteSettings as unknown as {
        getInvolvedGallery?: {
          images?: Array<{
            image?:
              | SanityImageObject
              | {
                  image?: SanityImageObject
                }
          }>
        }
      }
    )?.getInvolvedGallery?.images
      ?.map((item) => {
        if (!item.image) return null
        if ("asset" in item.image) return item.image
        return item.image.image || null
      })
      .filter((img): img is SanityImageObject => img != null) || []

  return (
    <div>
      <PageHeroOptimistic
        document={pageData}
        fallback={{
          title: "About the Conservancy",
          subtitle:
            "A 501(c)(3) nonprofit dedicated to the restoration, beautification, and preservation of historic Chimborazo Park.",
        }}
        height="small"
        priority={true}
      />

      <Container spacing="xl" className="space-y-16 py-16 pb-24 md:space-y-24">
        {/* Mission & Vision */}
        {(pageData?.mission || pageData?.vision) && (
          <div className="space-y-8 md:space-y-10">
            <p className="max-w-4xl font-body text-xl leading-snug font-medium md:text-2xl dark:text-grey-100">
              {pageData?.mission}
            </p>
            <p className="mt-4 max-w-4xl font-body text-grey-800 md:text-lg dark:text-grey-100">
              {pageData?.vision}
            </p>
          </div>
        )}

        {/* Highlights */}
        {pageData?.highlights && pageData.highlights.length > 0 && (
          <Highlights items={pageData.highlights} />
        )}

        {/* Story Image */}
        {pageData?.storyImage?.asset && (
          <div className="overflow-hidden rounded-2xl shadow-md">
            <SanityImage
              image={pageData.storyImage}
              alt={pageData.storyImage.alt || "About the Chimborazo Park Conservancy"}
              className="h-64 w-full object-cover md:h-80 lg:h-96"
              sizes="(max-width: 1200px) 100vw, 1200px"
              maxWidth={1200}
              fit="crop"
            />
          </div>
        )}

        {/* Body Content */}
        {pageData?.content && pageData.content.length > 0 && (
          <article className="mx-auto max-w-5xl">
            <PortableText value={pageData.content} />
          </article>
        )}

        {/* Callout Image */}
        {pageData?.calloutImage?.asset && (
          <div className="overflow-hidden rounded-2xl shadow-md">
            <SanityImage
              image={pageData.calloutImage}
              alt={pageData.calloutImage.alt || "Chimborazo Park community"}
              className="h-64 w-full object-cover md:h-80 lg:h-96"
              sizes="(max-width: 1200px) 100vw, 1200px"
              maxWidth={1200}
              fit="crop"
            />
          </div>
        )}

        {/* Board Members */}
        {pageData?.boardMembers && pageData.boardMembers.length > 0 && (
          <BoardSection members={pageData.boardMembers} />
        )}
      </Container>

      {/* Get Involved CTA */}
      <Container spacing="xl" className="pb-24">
        <GetInvolved
          title="Join the Effort"
          description="Whether you donate, volunteer, or simply spread the word, every contribution helps us preserve and enhance Chimborazo Park for future generations."
          galleryImages={getInvolvedGalleryImages}
          facebookUrl={siteSettings?.socialMedia?.facebook}
          instagramUrl={siteSettings?.socialMedia?.instagram}
          gutter="none"
        />
      </Container>
    </div>
  )
}

function Highlights({ items }: { items: SanityHighlight[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item._key}
          className="rounded-xl border border-primary-200 bg-primary-100 px-4 py-5 text-center md:px-6 md:py-7 dark:border-primary-800/70 dark:bg-primary-900/50"
        >
          <p className="font-display text-4xl text-primary-800 md:text-5xl dark:text-primary-300">
            {item.value}
          </p>
          <p className="mt-1 font-body text-lg font-medium text-primary-800 dark:text-primary-300">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function BoardSection({ members }: { members: SanityBoardMember[] }) {
  return (
    <div>
      <SectionHeader title="Board of Directors" size="large" />
      <p className="mt-4 mb-12 max-w-5xl font-body text-grey-700 md:text-lg dark:text-grey-300">
        The Conservancy is governed by a volunteer board of directors committed to preserving and
        enhancing Chimborazo Park for the community.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member._key} member={member} />
        ))}
      </div>
    </div>
  )
}

function MemberCard({ member }: { member: SanityBoardMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="rounded-xl border border-primary-200/50 bg-gradient-to-br from-primary-50/60 to-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-primary-700/40 dark:from-primary-900/20 dark:to-primary-950">
      <div className="flex items-center gap-4">
        {member.image?.asset ? (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <SanityImage
              image={member.image}
              alt={member.image.alt || member.name}
              className="h-full w-full object-cover"
              sizes="56px"
              maxWidth={112}
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800">
            <span className="font-display text-base text-primary-100" aria-hidden="true">
              {initials}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-display text-lg text-grey-900 dark:text-grey-100">{member.name}</h3>
          {member.role && (
            <span className="mt-1 inline-block rounded-full bg-accent-100 px-3 py-0.5 font-body text-xs font-medium text-accent-800 dark:bg-primary-800 dark:text-primary-300">
              {member.role}
            </span>
          )}
        </div>
      </div>
      {member.bio && (
        <p className="mt-4 font-body text-sm leading-relaxed text-grey-700 dark:text-grey-300">
          {member.bio}
        </p>
      )}
    </div>
  )
}
