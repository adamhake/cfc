/**
 * WCAG contrast ratio calculation utilities
 * Based on WCAG 2.1 specifications
 */

/**
 * Calculate relative luminance of an RGB color
 * Based on WCAG 2.1 formula
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  // Normalize RGB values to 0-1
  const [rs, gs, bs] = [r / 255, g / 255, b / 255];

  // Apply gamma correction
  const [rLin, gLin, bLin] = [rs, gs, bs].map((val) => {
    if (val <= 0.03928) {
      return val / 12.92;
    }
    return Math.pow((val + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance using WCAG formula
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio between 1:1 (no contrast) and 21:1 (maximum contrast)
 */
export function getContrastRatio(
  color1: [number, number, number],
  color2: [number, number, number],
): number {
  const lum1 = getRelativeLuminance(...color1);
  const lum2 = getRelativeLuminance(...color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export interface ContrastCheck {
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
  passesAAA: boolean;
  passesAAALarge: boolean;
  rating: "fail" | "aa-large" | "aa" | "aaa-large" | "aaa";
}

export function checkContrast(ratio: number): ContrastCheck {
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAALarge: ratio >= 3,
    passesAAA: ratio >= 7,
    passesAAALarge: ratio >= 4.5,
    rating:
      ratio >= 7
        ? "aaa"
        : ratio >= 4.5
          ? "aaa-large"
          : ratio >= 4.5
            ? "aa"
            : ratio >= 3
              ? "aa-large"
              : "fail",
  };
}

/**
 * Common color combinations for testing
 */
export const COMMON_COMBINATIONS = {
  // Light mode
  lightBodyText: {
    background: [250, 250, 250] as [number, number, number], // grey-50
    foreground: [86, 86, 86] as [number, number, number], // grey-800
  },
  lightBrandText: {
    background: [250, 250, 250] as [number, number, number], // grey-50
    foreground: [34, 101, 52] as [number, number, number], // green-800
  },
  lightButton: {
    background: [21, 128, 61] as [number, number, number], // green-700
    foreground: [240, 253, 244] as [number, number, number], // green-100
  },
  // Dark mode
  darkBodyText: {
    background: [35, 35, 35] as [number, number, number], // green-900 approximation
    foreground: [237, 237, 237] as [number, number, number], // grey-100
  },
  darkBrandText: {
    background: [35, 35, 35] as [number, number, number], // green-900
    foreground: [134, 239, 172] as [number, number, number], // green-400
  },
  darkButton: {
    background: [22, 163, 74] as [number, number, number], // green-600
    foreground: [237, 237, 237] as [number, number, number], // grey-100
  },
};

/**
 * Format contrast ratio for display
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}

/**
 * Get WCAG level description
 */
export function getWCAGLevel(check: ContrastCheck): string {
  if (check.passesAAA) return "AAA (Enhanced)";
  if (check.passesAAALarge) return "AAA Large Text";
  if (check.passesAA) return "AA (Minimum)";
  if (check.passesAALarge) return "AA Large Text";
  return "Fail";
}
