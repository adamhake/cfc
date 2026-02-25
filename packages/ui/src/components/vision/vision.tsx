import type { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/use-reduced-motion";
import { cn } from "../../utils/cn";
import { BookOpenText, HeartHandshake, LeafyGreen, Trees } from "lucide-react";

export type VisionPillar = "restoration" | "preservation" | "connection" | "recreation";

export interface VisionProps {
  title: string;
  /** Simple description text or array of bullet points */
  description?: string | string[];
  /** Rich content render prop -- pass PortableText or any ReactNode */
  contentSlot?: ReactNode;
  pillar: VisionPillar;
}

function getIcon(pillar: VisionPillar) {
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

export function Vision({ title, description, contentSlot, pillar }: VisionProps) {
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
        {getIcon(pillar)}

        <h3 className="mb-4 font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>

        {contentSlot ? (
          contentSlot
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
