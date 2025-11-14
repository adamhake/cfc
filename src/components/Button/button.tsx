import { cn } from "@/utils/cn";
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
  const baseStyles =
    "cursor-pointer rounded-xl border font-body font-semibold tracking-wider uppercase transition-all duration-150";

  const sizeStyles = {
    standard: "px-6 py-3 text-base",
    small: "px-4 py-2 text-sm",
  };

  const variantStyles = {
    primary: cn(
      "border-primary-800 bg-primary-700 text-primary-100",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-600 dark:bg-primary-600 dark:text-grey-100",
    ),
    secondary: cn(
      "border-primary-200 bg-primary-100 text-primary-800",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-700 dark:bg-primary-900 dark:text-primary-300",
    ),
    outline: cn(
      "border-primary-800 bg-transparent text-primary-800",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-500 dark:bg-transparent dark:text-primary-400",
    ),
  };

  const disabledStyles = cn(
    "disabled:cursor-not-allowed disabled:border-grey-300 disabled:bg-grey-200 disabled:text-grey-600 disabled:opacity-60",
    "dark:disabled:border-grey-700 dark:disabled:bg-grey-800 dark:disabled:text-grey-400",
  );

  const focusStyles =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        disabledStyles,
        focusStyles,
        className,
      )}
    >
      {children}
    </button>
  );
};
