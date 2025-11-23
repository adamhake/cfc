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
  size?: "standard" | "small";

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
   * Allow additional props like zeffy-form-link
   */
  [key: string]: unknown;
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
  ...rest
}) => {
  const baseStyles =
    "cursor-pointer rounded-xl border-2 font-body font-semibold tracking-wider uppercase transition-all duration-150";

  const sizeStyles = {
    standard: "px-6 py-3 text-base",
    small: "px-4 py-2 text-sm",
  };

  const variantStyles = {
    primary: cn(
      "border-primary-800 bg-primary-700 text-primary-100",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-700 dark:bg-primary-600 dark:text-grey-100",
    ),
    secondary: cn(
      "border-primary-300 bg-primary-100 text-primary-800",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-800 dark:bg-primary-900 dark:text-primary-300",
    ),
    outline: cn(
      "border-primary-800 bg-transparent text-primary-800",
      "hover:opacity-90 active:scale-95",
      "dark:border-primary-500 dark:bg-transparent dark:text-primary-400",
    ),
    accent: cn(
      "border-accent-700 bg-accent-600 text-white shadow-sm",
      "hover:opacity-90 hover:shadow-md active:scale-95",
      "dark:border-accent-600 dark:bg-accent-500 dark:text-primary-900",
    ),
  };

  const disabledStyles = cn(
    "disabled:cursor-not-allowed disabled:border-grey-300 disabled:bg-grey-200 disabled:text-grey-600 disabled:opacity-60",
    "dark:disabled:border-grey-700 dark:disabled:bg-grey-800 dark:disabled:text-grey-400",
  );

  const focusStyles =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2";

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabledStyles,
    focusStyles,
    className,
  );

  if (as === "a") {
    return (
      <a
        href={href}
        onClick={onClick}
        target={target}
        rel={rel}
        className={combinedClassName}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Filter out non-DOM props before spreading to button element
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { asChild, ...domProps } = rest;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...domProps}
    >
      {children}
    </button>
  );
};
