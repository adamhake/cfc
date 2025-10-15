import { cn } from "@/helpers/cn";
import type React from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "standard" | "small";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "standard",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer rounded-xl px-8 py-3 font-body font-semibold tracking-wider uppercase transition-colors dark:bg-green-800",
        "disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-600 dark:disabled:border-stone-700 dark:disabled:bg-stone-300 dark:disabled:text-stone-700",
        {
          "border border-green-800 bg-green-700 text-green-100 hover:bg-green-800 hover:text-green-200 dark:border-green-200":
            variant === "primary",
          "border border-green-200 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 dark:bg-green-200":
            variant === "secondary",
          "border border-green-800 bg-transparent text-green-800 hover:bg-green-800 hover:text-green-200 dark:border-green-200 dark:text-green-200 dark:hover:bg-green-400 dark:hover:text-green-800":
            variant === "outline",
        },
        size === "small" && "px-4 py-3 text-xs",
        ...className,
      )}
    >
      {children}
    </button>
  );
};
