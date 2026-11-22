import { cn } from "@/utils/cn"

interface SectionHeaderProps {
  title: string
  level?: "h2" | "h3" | "h4"
  size?: "small" | "medium" | "large"
  /** Lets the enclosing <section> name itself with aria-labelledby */
  id?: string
  /** Extra classes, merged so a colour here overrides the default */
  className?: string
}

export default function SectionHeader({
  title,
  level = "h2",
  size = "medium",
  id,
  className,
}: SectionHeaderProps) {
  const Component = level

  const sizeClasses = {
    small: "text-lg md:text-xl",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl lg:text-4xl",
  }

  return (
    <Component
      id={id}
      className={cn(
        "font-display text-primary-800 dark:text-primary-400",
        sizeClasses[size],
        className,
      )}
    >
      {title}
    </Component>
  )
}
