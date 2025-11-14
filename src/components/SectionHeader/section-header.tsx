interface SectionHeaderProps {
  title: string;
  level?: "h2" | "h3" | "h4";
  size?: "small" | "medium" | "large";
}

export default function SectionHeader({
  title,
  level = "h2",
  size = "medium",
}: SectionHeaderProps) {
  const Component = level;

  const sizeClasses = {
    small: "text-lg md:text-xl",
    medium: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl lg:text-4xl",
  };

  return (
    <Component className={`font-display text-accent-700 dark:text-accent-400 ${sizeClasses[size]}`}>
      {title}
    </Component>
  );
}
