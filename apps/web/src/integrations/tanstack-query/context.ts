import {
  APPEARANCE_COOKIES,
  buildAppearanceCookie,
  DEFAULT_APPEARANCE,
} from "@/lib/appearance-shared";
import { PALETTE_KEY, type PaletteMode, validatePalette } from "@/utils/palette";
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
    if (typeof document !== "undefined" && this.currentTheme === "system") {
      this.currentResolved = document.documentElement.classList.contains("dark") ? "dark" : "light";
    } else {
      this.currentResolved = resolveTheme(this.currentTheme);
    }
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

    if (typeof document !== "undefined") {
      document.documentElement.style.colorScheme = this.currentResolved;
      document.cookie = buildAppearanceCookie(APPEARANCE_COOKIES.THEME, newTheme);
      document.cookie = buildAppearanceCookie(
        APPEARANCE_COOKIES.RESOLVED_THEME,
        this.currentResolved,
      );
    }

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
    this.currentPalette = DEFAULT_APPEARANCE.palette;

    if (typeof window !== "undefined") {
      const domPalette = document.documentElement.getAttribute("data-palette");
      if (domPalette) {
        this.currentPalette = validatePalette(domPalette);
      }

      try {
        const stored = localStorage.getItem(PALETTE_KEY);
        if (stored) {
          this.currentPalette = validatePalette(stored);
        }
      } catch {
        // Ignore storage errors
      }

      this.applyPaletteToDom(this.currentPalette);
    }
  }

  getPalette(): PaletteMode {
    return this.currentPalette;
  }

  setPalette(newPalette: PaletteMode) {
    this.currentPalette = validatePalette(newPalette);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(PALETTE_KEY, this.currentPalette);
      } catch (error) {
        console.error("Failed to store palette preference:", error);
      }

      this.applyPaletteToDom(this.currentPalette);
      document.cookie = buildAppearanceCookie(APPEARANCE_COOKIES.PALETTE, this.currentPalette);
    }

    // Notify all listeners
    this.listeners.forEach((listener) => listener(this.currentPalette));
  }

  subscribe(listener: (palette: PaletteMode) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private applyPaletteToDom(palette: PaletteMode) {
    if (typeof document === "undefined") {
      return;
    }

    if (palette === DEFAULT_APPEARANCE.palette) {
      document.documentElement.removeAttribute("data-palette");
      return;
    }

    document.documentElement.setAttribute("data-palette", palette);
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
