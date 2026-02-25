/**
 * Design token types and metadata constants
 */

// Re-export palette types and utilities
export {
  type PaletteMode,
  PALETTE_KEY,
  PALETTE_METADATA,
  PaletteManager,
  getStoredPalette,
  storePalette,
  validatePalette,
  applyPalette,
  getCurrentPalette,
} from "./palettes";

// Re-export theme types and utilities
export {
  type ThemeMode,
  type ResolvedTheme,
  validateTheme,
  getSystemPreference,
  resolveTheme,
  getStoredTheme,
  storeTheme,
  applyTheme,
} from "./theme";

/**
 * Color scale step type (50-950)
 */
export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/**
 * Semantic color channels available in the design system
 */
export type SemanticColor = "primary" | "accent" | "neutral" | "grey";

/**
 * Typography scale reference constants for documentation
 */
export const TYPOGRAPHY_SCALE = {
  "hero-h1": {
    classes: "text-4xl md:text-5xl lg:text-6xl",
    sizes: "36px -> 48px -> 60px",
  },
  "page-h1": {
    classes: "text-3xl md:text-4xl lg:text-5xl",
    sizes: "30px -> 36px -> 48px",
  },
  "section-h2": {
    classes: "text-2xl md:text-3xl lg:text-4xl",
    sizes: "24px -> 30px -> 36px",
  },
  "subsection-h3": {
    classes: "text-xl md:text-2xl lg:text-3xl",
    sizes: "20px -> 24px -> 30px",
  },
  "body-large": {
    classes: "text-lg md:text-xl",
    sizes: "18px -> 20px",
  },
  body: {
    classes: "text-base md:text-lg",
    sizes: "16px -> 18px",
  },
  small: {
    classes: "text-sm",
    sizes: "14px",
  },
} as const;

/**
 * Spacing scale reference constants for documentation
 */
export const SPACING_SCALE = {
  tight: {
    padding: "p-4",
    gap: "gap-4",
    value: "16px",
  },
  standard: {
    padding: "p-6 md:p-8",
    gap: "gap-8",
    value: "24px -> 32px",
  },
  spacious: {
    padding: "p-8 lg:p-12",
    gap: "gap-12",
    value: "32px -> 48px",
  },
  section: {
    padding: "space-y-16 md:space-y-24",
    gap: "space-y-16 md:space-y-24",
    value: "64px -> 96px",
  },
} as const;

/**
 * Border radius scale reference constants for documentation
 */
export const RADIUS_SCALE = {
  small: {
    classes: "rounded-lg",
    usage: "Tags, badges",
    value: "8px",
  },
  medium: {
    classes: "rounded-xl",
    usage: "Cards, buttons, inputs",
    value: "12px",
  },
  large: {
    classes: "rounded-2xl",
    usage: "Hero sections, modals, images",
    value: "16px",
  },
  "extra-large": {
    classes: "rounded-3xl",
    usage: "Large feature sections",
    value: "24px",
  },
  full: {
    classes: "rounded-full",
    usage: "Circular elements (icons, avatars)",
    value: "50%",
  },
} as const;
