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

// Create singleton instances for client-side only
// For SSR, these will be recreated per request via getContext()
let clientThemeManager: ThemeStateManager | null = null;
let clientPaletteManager: PaletteStateManager | null = null;
let clientQueryClient: QueryClient | null = null;

export function getContext() {
  // On the client, reuse the same managers and QueryClient to maintain state
  // On the server, create new instances per request
  const isClient = typeof window !== "undefined";

  const queryClient = isClient
    ? (clientQueryClient ??= new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      }))
    : new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent refetch immediately after SSR hydration
            // This eliminates duplicate API calls on page load
            staleTime: 60 * 1000, // 1 minute

            // Keep data in cache longer than staleTime
            // Allows serving stale data while refetching in background
            gcTime: 5 * 60 * 1000, // 5 minutes

            // Reduce aggressive refetching behavior
            // Routes can override these defaults as needed
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,

            // Retry failed queries once with exponential backoff
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      });

  let themeManager: ThemeStateManager;
  let paletteManager: PaletteStateManager;

  if (isClient) {
    if (!clientThemeManager) {
      clientThemeManager = new ThemeStateManager();
    }
    if (!clientPaletteManager) {
      clientPaletteManager = new PaletteStateManager();
    }
    themeManager = clientThemeManager;
    paletteManager = clientPaletteManager;
  } else {
    // Server: always create fresh instances to avoid state leaking between requests
    themeManager = new ThemeStateManager();
    paletteManager = new PaletteStateManager();
  }

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
