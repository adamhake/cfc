import { SanityImage, type SanityImageObject } from "@/components/SanityImage/sanity-image";
import { formatDateString } from "@/utils/time";
import { cn } from "@/utils/cn";
import { Link } from "@tanstack/react-router";
import { Calendar, Tag } from "lucide-react";

export interface UpdateCategory {
  _id: string;
  title: string;
  slug: { current: string };
  color?: string;
}

export interface UpdateHeroImage {
  _id: string;
  title?: string;
  alt?: string;
  image: SanityImageObject;
}

export interface UpdateData {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  heroImage: UpdateHeroImage;
  category?: UpdateCategory;
  featured?: boolean;
  publishedAt: string;
}

interface UpdateCardProps extends UpdateData {
  variant?: "standard" | "featured" | "condensed";
}

const categoryColorMap: Record<string, string> = {
  green: "bg-primary-600 text-white dark:bg-primary-500",
  blue: "bg-accent-600 text-white dark:bg-accent-500",
  orange: "bg-terra-600 text-white dark:bg-terra-500",
  purple: "bg-purple-600 text-white dark:bg-purple-500",
  teal: "bg-teal-600 text-white dark:bg-teal-500",
};

function CategoryChip({ category }: { category?: UpdateCategory }) {
  if (!category) return null;

  const colorClass = category.color
    ? categoryColorMap[category.color] || "bg-grey-600 text-white dark:bg-grey-500"
    : "bg-grey-600 text-white dark:bg-grey-500";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-3 py-1 font-body text-sm font-semibold",
        colorClass,
      )}
    >
      <Tag className="h-3 w-3" />
      {category.title}
    </span>
  );
}

export default function Update({
  title,
  slug,
  description,
  heroImage,
  category,
  featured,
  publishedAt,
  variant = "standard",
}: UpdateCardProps) {
  const fmtDate = formatDateString(publishedAt, "short");

  if (variant === "condensed") {
    return (
      <Link
        to="/updates/$slug"
        params={{ slug: slug.current }}
        className="group flex gap-4 rounded-lg border border-accent-600/20 p-4 transition-all hover:border-accent-600/40 hover:bg-accent-50/50 dark:border-accent-500/20 dark:hover:border-accent-500/40 dark:hover:bg-accent-900/20"
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <SanityImage
            image={heroImage.image}
            alt={heroImage.alt || title}
            className="h-full w-full object-cover"
            sizes="80px"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="font-display text-lg text-grey-900 group-hover:text-primary-700 dark:text-grey-100 dark:group-hover:text-primary-300">
            {title}
          </h4>
          <span className="font-body text-sm text-grey-600 dark:text-grey-400">{fmtDate}</span>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        to="/updates/$slug"
        params={{ slug: slug.current }}
        className="group relative block min-h-[450px] cursor-pointer overflow-hidden rounded-2xl border border-accent-600/20 transition-transform active:scale-98 md:min-h-[500px] dark:border-accent-500/20"
      >
        <SanityImage
          image={heroImage.image}
          alt={heroImage.alt || title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-90"
          sizes="(max-width: 768px) 100vw, 100vw"
          priority
        />
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-transparent dark:from-grey-900/90 dark:via-grey-900/50"></div>
        <div className="relative z-10 flex h-full flex-col justify-end space-y-4 p-8 md:p-10">
          <div className="flex items-center gap-3">
            <CategoryChip category={category} />
            {featured && (
              <span className="inline-flex items-center rounded-lg bg-accent-500 px-3 py-1 font-body text-sm font-semibold text-white">
                Featured
              </span>
            )}
          </div>
          <h3 className="font-display text-3xl text-primary-50 md:text-4xl dark:text-grey-100">
            {title}
          </h3>
          <p className="font-body text-lg text-primary-100 dark:text-grey-200">{description}</p>
          <div className="flex items-center gap-2 pt-2">
            <Calendar className="h-5 w-5 stroke-primary-200 dark:stroke-grey-300" />
            <span className="font-body font-medium text-primary-100 dark:text-grey-300">
              {fmtDate}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Standard variant
  return (
    <Link
      to="/updates/$slug"
      params={{ slug: slug.current }}
      className="group relative block min-h-[400px] cursor-pointer overflow-hidden rounded-2xl border border-accent-600/20 transition-transform active:scale-98 md:min-h-[450px] dark:border-accent-500/20"
    >
      <SanityImage
        image={heroImage.image}
        alt={heroImage.alt || title}
        className="absolute inset-0 h-full w-full object-cover transition-opacity group-hover:opacity-90"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute top-0 left-0 h-full w-full bg-primary-900/55 dark:bg-grey-900/60"></div>
      <div className="relative z-10 space-y-6 p-8 md:space-y-8">
        <CategoryChip category={category} />
        <h3 className="font-display text-3xl text-primary-50 dark:text-grey-100">{title}</h3>
        <p className="font-body text-lg text-primary-50 dark:text-grey-200">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 stroke-primary-200 dark:stroke-grey-300" />
          <span className="font-body font-medium text-primary-100 dark:text-grey-300">
            {fmtDate}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Export for use in related updates sections
export function UpdateCondensed(props: UpdateData) {
  return <Update {...props} variant="condensed" />;
}

export function UpdateFeatured(props: UpdateData) {
  return <Update {...props} variant="featured" />;
}
