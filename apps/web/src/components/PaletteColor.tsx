import React from "react";

interface PaletteColorProps {
  children: React.ReactNode;
  /** CSS property to apply the color to (e.g., 'backgroundColor', 'color', 'borderColor') */
  property: "backgroundColor" | "color" | "borderColor" | "stroke";
  /** Shade of primary color (50-950) */
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
  /** Whether this is for dark mode */
  dark?: boolean;
  /** Additional CSS properties */
  style?: React.CSSProperties;
  /** HTML element to render */
  as?: keyof React.JSX.IntrinsicElements;
  /** Class name */
  className?: string;
}

/**
 * Component that applies palette colors via inline styles
 * This ensures colors update when palette changes
 */
export const PaletteColor: React.FC<PaletteColorProps> = ({
  children,
  property,
  shade,
  dark = false,
  style = {},
  as = "div",
  className = "",
}) => {
  const Component = as as React.ElementType;
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Use useEffect to avoid hydration mismatch
  React.useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  // Only apply if dark mode matches
  if (dark && !isDarkMode) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }
  if (!dark && isDarkMode) {
    return (
      <Component className={className} style={style}>
        {children}
      </Component>
    );
  }

  const colorValue = `var(--color-primary-${shade})`;
  const appliedStyle = {
    ...style,
    [property]: colorValue,
  };

  return (
    <Component className={className} style={appliedStyle}>
      {children}
    </Component>
  );
};
