import type { PaletteMode } from "@/utils/palette";
import {
  type ResolvedTheme,
  type ThemeMode,
  applyTheme,
  getStoredTheme,
  resolveTheme,
  storeTheme,
} from "@/utils/theme";
import { QueryClient } from "@tanstack/react-query";

// Create a shared theme state manager
class ThemeStateManager {
  private listeners: Set<(theme: ThemeMode, resolved: ResolvedTheme) => void> = new Set();
  private currentTheme: ThemeMode;
  private currentResolved: ResolvedTheme;

  constructor() {
    this.currentTheme = getStoredTheme();
    this.currentResolved = resolveTheme(this.currentTheme);
  }

  getTheme(): ThemeMode {
    return this.currentTheme;
  }

  getResolvedTheme(): ResolvedTheme {
    return this.currentResolved;
  }

  setTheme(newTheme: ThemeMode) {
    this.currentTheme = newTheme;
    this.currentResolved = resolveTheme(newTheme);
    storeTheme(newTheme);
    applyTheme(this.currentResolved);

    // Notify all listeners
    this.listeners.forEach((listener) => listener(this.currentTheme, this.currentResolved));
  }

  subscribe(listener: (theme: ThemeMode, resolved: ResolvedTheme) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Create a shared palette state manager
class PaletteStateManager {
  private listeners: Set<(palette: PaletteMode) => void> = new Set();
  private currentPalette: PaletteMode;

  constructor() {
    // Default to "olive" (Warm Olive + Blue-Grey) - will be updated on client
    this.currentPalette = "olive";

    // Only access localStorage on the client after construction
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("palette-preference");
        if (stored) {
          const validPalettes: PaletteMode[] = ["green", "olive", "green-terra", "green-navy"];
          if (validPalettes.includes(stored as PaletteMode)) {
            this.currentPalette = stored as PaletteMode;
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  getPalette(): PaletteMode {
    return this.currentPalette;
  }

  setPalette(newPalette: PaletteMode) {
    this.currentPalette = newPalette;

    // Only access localStorage and DOM on client
    if (typeof window !== "undefined") {
      // Store preference
      try {
        localStorage.setItem("palette-preference", newPalette);
      } catch (error) {
        console.error("Failed to store palette preference:", error);
      }

      // Apply to DOM
      const html = document.documentElement;
      if (newPalette === "green") {
        html.removeAttribute("data-palette");
      } else {
        html.setAttribute("data-palette", newPalette);
      }
    }

    // Notify all listeners
    this.listeners.forEach((listener) => listener(this.currentPalette));
  }

  subscribe(listener: (palette: PaletteMode) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Create singleton instances
const themeManager = new ThemeStateManager();
const paletteManager = new PaletteStateManager();

export function getContext() {
  const queryClient = new QueryClient();

  return {
    queryClient,
    theme: themeManager.getTheme(),
    setTheme: (newTheme: ThemeMode) => themeManager.setTheme(newTheme),
    resolvedTheme: themeManager.getResolvedTheme(),
    _themeManager: themeManager, // Internal reference for hooks
    palette: paletteManager.getPalette(),
    setPalette: (newPalette: PaletteMode) => paletteManager.setPalette(newPalette),
    _paletteManager: paletteManager, // Internal reference for hooks
  };
}
