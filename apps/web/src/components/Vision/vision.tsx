import { BookOpenText, HeartHandshake, LeafyGreen, Trees } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/utils/cn";

interface VisionProps {
  title: string;
  icon: "leafy-green" | "trees" | "heart-handshake" | "book-open-text";
  description: string;
}

function getIcon(icon: string) {
  switch (icon) {
    case "leafy-green":
      return (
        <LeafyGreen className="h-8 w-8 stroke-accent-600 md:h-10 md:w-10 dark:stroke-accent-400" />
      );
    case "trees":
      return <Trees className="h-8 w-8 stroke-accent-600 md:h-10 md:w-10 dark:stroke-accent-400" />;
    case "heart-handshake":
      return (
        <HeartHandshake className="h-8 w-8 stroke-accent-600 md:h-10 md:w-10 dark:stroke-accent-400" />
      );
    case "book-open-text":
      return (
        <BookOpenText className="h-8 w-8 stroke-accent-600 md:h-10 md:w-10 dark:stroke-accent-400" />
      );
    default:
      return null;
  }
}
export default function Vision({ title, icon, description }: VisionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-accent-600/20",
        "bg-gradient-to-br from-grey-100/10 to-grey-100/50 p-8 shadow-sm lg:p-12",
        "dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80",
        !prefersReducedMotion && "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="relative">
        {/* Icon with background circle */}
        <div className="mb-6 inline-flex rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10">
          {getIcon(icon)}
        </div>

        <h3 className="mb-4 font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
          {title}
        </h3>

        <p className="font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
          {description}
        </p>
      </div>
    </div>
  );
}
