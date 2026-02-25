/**
 * Palette management utilities
 * Handles palette selection, persistence, and application
 */

export type PaletteMode =
  | "green" // Default: Current cool-toned green
  | "olive" // Warm olive + blue-grey accents
  | "green-terra" // Green + Terracotta accents
  | "green-navy"; // Green + Navy accents

export const PALETTE_KEY = "palette-preference";

export const PALETTE_METADATA: Record<
  PaletteMode,
  {
    name: string;
    description: string;
    primary: string;
    accent: string | null;
  }
> = {
  green: {
    name: "Classic Green",
    description: "Current cool-toned forest green (baseline)",
    primary: "Cool Green",
    accent: null,
  },
  olive: {
    name: "Warm Olive + Blue-Grey",
    description: "Warm olive with sophisticated blue-grey accents",
    primary: "Olive Green",
    accent: "Blue-Grey",
  },
  "green-terra": {
    name: "Green + Terracotta",
    description: "Forest green with warm clay accents",
    primary: "Forest Green",
    accent: "Terracotta",
  },
  "green-navy": {
    name: "Green + Navy",
    description: "Forest green with deep navy accents",
    primary: "Forest Green",
    accent: "Navy Blue",
  },
};

/**
 * Get stored palette preference from localStorage
 */
export function getStoredPalette(): PaletteMode | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(PALETTE_KEY);
    return stored ? validatePalette(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Store palette preference in localStorage
 */
export function storePalette(palette: PaletteMode): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(PALETTE_KEY, palette);
  } catch (error) {
    console.error("Failed to store palette preference:", error);
  }
}

/**
 * Validate palette string and return valid PaletteMode or default
 */
export function validatePalette(palette: string): PaletteMode {
  const validPalettes: PaletteMode[] = ["green", "olive", "green-terra", "green-navy"];

  return validPalettes.includes(palette as PaletteMode) ? (palette as PaletteMode) : "olive";
}

/**
 * Apply palette to document by setting data-palette attribute
 */
export function applyPalette(palette: PaletteMode): void {
  if (typeof window === "undefined") return;

  const html = document.documentElement;

  if (palette === "olive") {
    // Default palette - remove attribute
    html.removeAttribute("data-palette");
  } else {
    html.setAttribute("data-palette", palette);
  }
}

/**
 * Get current palette from DOM
 */
export function getCurrentPalette(): PaletteMode {
  if (typeof window === "undefined") return "olive";

  const html = document.documentElement;
  const palette = html.getAttribute("data-palette");

  return palette ? validatePalette(palette) : "olive";
}

/**
 * Palette manager for reactive updates
 */
export class PaletteManager {
  private listeners: Set<(palette: PaletteMode) => void> = new Set();
  private currentPalette: PaletteMode;

  constructor(initialPalette: PaletteMode = "green") {
    this.currentPalette = initialPalette;
  }

  subscribe(callback: (palette: PaletteMode) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  setPalette(palette: PaletteMode): void {
    const validPalette = validatePalette(palette);
    this.currentPalette = validPalette;

    // Apply to DOM
    applyPalette(validPalette);

    // Store preference
    storePalette(validPalette);

    // Notify listeners
    this.listeners.forEach((callback) => callback(validPalette));
  }

  getPalette(): PaletteMode {
    return this.currentPalette;
  }
}
