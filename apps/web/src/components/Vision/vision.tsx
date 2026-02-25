import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { BookOpenText, HeartHandshake, LeafyGreen, Trees } from "lucide-react";

type Pillar = "restoration" | "preservation" | "connection" | "recreation";

interface VisionProps {
  title: string;
  description?: string | string[];
  content?: PortableTextBlock[];
  pillar: Pillar;
}

const descriptionComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

function getIcon(pillar: Pillar) {
  switch (pillar) {
    case "restoration":
      return (
        <div className="mb-6 inline-flex rounded-full bg-primary-100 p-3 dark:bg-primary-800">
          <LeafyGreen className="h-8 w-8 stroke-primary-800 md:h-10 md:w-10 dark:stroke-primary-200" />
        </div>
      );
    case "recreation":
      return (
        <div className="mb-6 inline-flex rounded-full bg-accent-100 p-3 dark:bg-accent-800">
          <Trees className="h-8 w-8 stroke-accent-800 md:h-10 md:w-10 dark:stroke-accent-200" />
        </div>
      );
    case "connection":
      return (
        <div className="mb-6 inline-flex rounded-full bg-heather-100 p-3 dark:bg-heather-800">
          <HeartHandshake className="h-8 w-8 stroke-heather-900 md:h-10 md:w-10 dark:stroke-heather-200" />
        </div>
      );
    case "preservation":
      return (
        <div className="mb-6 inline-flex rounded-full bg-terra-100 p-3 dark:bg-terra-800">
          <BookOpenText className="h-8 w-8 stroke-terra-800 md:h-10 md:w-10 dark:stroke-terra-200" />
        </div>
      );
    default:
      return null;
  }
}
export default function Vision({ title, description, content, pillar }: VisionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-accent-600/20",
        "bg-gradient-to-br from-grey-50 to-grey-100/90 p-8 shadow-sm lg:p-12",
        "dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80",
        !prefersReducedMotion &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="relative">
        {/* Icon with background circle */}
        {getIcon(pillar)}

        <h3 className="mb-4 font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>

        {content ? (
          <PortableText value={content} components={descriptionComponents} />
        ) : Array.isArray(description) ? (
          <ul className="list-disc space-y-2 pl-5 font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
