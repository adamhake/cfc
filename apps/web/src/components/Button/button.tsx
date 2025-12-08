import { cn } from "@/utils/cn";
import type React from "react";

/**
 * Button component props
 */
export interface ButtonProps {
  /**
   * Visual style variant of the button
   * @default "primary"
   */
  variant?: "primary" | "secondary" | "outline" | "accent";

  /**
   * Size of the button
   * @default "standard"
   */
  size?: "standard" | "small" | "large";

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Click handler function
   */
  onClick?: () => void;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * HTML button type attribute
   * @default "button"
   */
  type?: "button" | "submit" | "reset";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Render as button or anchor tag
   * @default "button"
   */
  as?: "button" | "a";

  /**
   * URL when rendered as anchor (requires as="a")
   */
  href?: string;

  /**
   * Target attribute for anchor tags
   */
  target?: string;

  /**
   * Rel attribute for anchor tags
   */
  rel?: string;

  /**
   * Download attribute for anchor tags (triggers download instead of navigation)
   */
  download?: boolean | string;

  /**
   * Aria label for accessibility
   */
  "aria-label"?: string;

  /**
   * Allow custom data attributes for external integrations (e.g., zeffy-form-link)
   * Note: Using specific data attribute typing instead of index signature for better type safety
   */
  "data-zeffy-form-link"?: string;
}

/**
 * A versatile button component that supports multiple variants, sizes, and can render as either a button or anchor tag.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 *
 * <Button variant="accent" as="a" href="/donate">
 *   Donate Now
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "standard",
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  as = "button",
  href,
  target,
  rel,
  download,
  "aria-label": ariaLabel,
  "data-zeffy-form-link": zeffyFormLink,
}) => {
  const baseStyles =
    "cursor-pointer rounded-xl border-2 font-body font-semibold tracking-wider uppercase transition-all duration-150 no-underline";

  const sizeStyles = {
    small: "px-4 py-3 md:py-2 text-sm",
    standard: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary: cn(
      "border-primary-800 bg-primary-700 text-primary-100",
      "hover:brightness-105 active:scale-[0.97]",
      "dark:border-primary-700 dark:bg-primary-600 dark:text-grey-100",
    ),
    secondary: cn(
      "border-primary-300 bg-primary-100 text-primary-800",
      "hover:bg-primary-50 active:scale-[0.97]",
      "dark:border-primary-800 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800",
    ),
    outline: cn(
      "border-primary-800 bg-transparent text-primary-800",
      "hover:bg-primary-50 active:scale-[0.97]",
      "dark:border-primary-500 dark:bg-transparent dark:text-primary-400 dark:hover:bg-primary-900/50",
    ),
    accent: cn(
      "border-accent-700 bg-accent-600 text-white shadow-sm",
      "hover:shadow-md hover:brightness-105 active:scale-[0.97]",
      "dark:border-accent-600 dark:bg-accent-500 dark:text-primary-900",
    ),
  };

  const disabledStyles = cn(
    "disabled:cursor-not-allowed disabled:border-grey-300 disabled:bg-grey-200 disabled:text-grey-600 disabled:opacity-60",
    "dark:disabled:border-grey-700 dark:disabled:bg-grey-800 dark:disabled:text-grey-400",
  );

  const focusStyles =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 dark:focus-visible:ring-primary-400";

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabledStyles,
    focusStyles,
    className,
  );

  // Build optional props object for clean rendering
  const dataProps = zeffyFormLink ? { "data-zeffy-form-link": zeffyFormLink } : {};

  if (as === "a") {
    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        download={download}
        aria-label={ariaLabel}
        className={combinedClassName}
        {...dataProps}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={combinedClassName}
      {...dataProps}
    >
      {children}
    </button>
  );
};
