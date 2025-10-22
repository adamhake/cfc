import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type ThemeMode,
  type ResolvedTheme,
  getStoredTheme,
  resolveTheme,
  storeTheme,
  applyTheme,
} from "@/utils/theme";

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
    this.listeners.forEach(listener => listener(this.currentTheme, this.currentResolved));
  }

  subscribe(listener: (theme: ThemeMode, resolved: ResolvedTheme) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Create a singleton instance
const themeManager = new ThemeStateManager();

export function getContext() {
  const queryClient = new QueryClient();

  return {
    queryClient,
    theme: themeManager.getTheme(),
    setTheme: (newTheme: ThemeMode) => themeManager.setTheme(newTheme),
    resolvedTheme: themeManager.getResolvedTheme(),
    _themeManager: themeManager, // Internal reference for hooks
  };
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode;
  queryClient: QueryClient;
}) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
