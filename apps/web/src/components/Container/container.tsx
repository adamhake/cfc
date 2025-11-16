import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  as?: "div" | "section" | "article" | "main";
  className?: string;
}

export default function Container({
  children,
  maxWidth = "6xl",
  spacing = "md",
  as: Component = "div",
  className = "",
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "6xl": "max-w-6xl",
  };

  const spacingClasses = {
    none: "",
    sm: "space-y-4",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  return (
    <Component
      className={`mx-auto ${maxWidthClasses[maxWidth]} ${spacingClasses[spacing]} ${className}`}
    >
      {children}
    </Component>
  );
}
