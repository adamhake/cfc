import type { SanityProject } from "@/lib/sanity-types";
import { Link } from "@tanstack/react-router";
import { SanityImage } from "../SanityImage/sanity-image";

export interface ProjectCardCondensedProps {
  project: SanityProject;
  onClick?: () => void;
}

export default function ProjectCardCondensed({ project, onClick }: ProjectCardCondensedProps) {
  const { title, slug, description, heroImage } = project;

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: slug.current }}
      onClick={onClick}
      className="group relative block overflow-hidden rounded-xl border border-accent-600/20 transition-all hover:shadow-md dark:border-accent-500/20"
    >
      {/* Image background */}
      <div className="relative h-32 w-full overflow-hidden">
        <SanityImage
          image={heroImage}
          alt={heroImage.alt}
          className="absolute inset-0 h-full w-full object-cover"
          sizes="288px"
          priority={false}
          useHotspotPosition
        />
        <div className="absolute inset-0 bg-primary-900/60"></div>
      </div>

      {/* Content */}
      <div className="bg-gradient-to-br from-grey-50 to-grey-50/80 p-4 dark:from-primary-900 dark:to-primary-900/80">
        <h3 className="line-clamp-2 font-display text-base leading-tight text-grey-900 dark:text-grey-100">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 font-body text-sm text-grey-600 dark:text-grey-400">
          {description}
        </p>
        <span className="mt-2 inline-block font-body text-sm font-medium text-accent-700 transition group-hover:text-accent-600 dark:text-accent-400 dark:group-hover:text-accent-300">
          Learn More →
        </span>
      </div>
    </Link>
  );
}
