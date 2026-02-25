import { cn } from "../../utils/cn";
import type React from "react";

/**
 * Polymorphic component type helpers
 */
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = object,
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/**
 * Button-specific props (independent of the rendered element)
 */
interface ButtonOwnProps {
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
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}

export type ButtonProps<C extends React.ElementType = "button"> = PolymorphicComponentProp<
  C,
  ButtonOwnProps
>;

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

/**
 * A versatile button component supporting multiple variants, sizes, and polymorphic rendering.
 *
 * Use the `as` prop to render as any element or component (e.g., a router Link).
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 *
 * <Button as={Link} to="/donate" variant="accent">
 *   Donate Now
 * </Button>
 *
 * <Button as="a" href="https://example.com" target="_blank">
 *   External Link
 * </Button>
 * ```
 */
export function Button<C extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "standard",
  className,
  disabled = false,
  children,
  ...rest
}: ButtonProps<C>) {
  const Component = as || "button";

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    disabledStyles,
    focusStyles,
    className,
  );

  return (
    <Component
      className={combinedClassName}
      disabled={Component === "button" ? disabled : undefined}
      aria-disabled={Component !== "button" && disabled ? true : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}
