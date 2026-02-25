import { createContext, useContext, useEffect, useState } from "react";
import type { ResolvedTheme, ThemeMode } from "../tokens/theme";
import {
  applyTheme,
  getSystemPreference,
  resolveTheme,
  validateTheme,
} from "../tokens/theme";

export interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
  systemPreference: ResolvedTheme;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  defaultTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode, resolved: ResolvedTheme) => void;
  children: React.ReactNode;
}

/**
 * Context-based theme provider with no router dependency.
 * Any app can wrap this with its own state management.
 */
export function ThemeProvider({
  defaultTheme = "system",
  onThemeChange,
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(resolveTheme(defaultTheme));
  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(getSystemPreference());

  const setTheme = (newTheme: ThemeMode) => {
    const validated = validateTheme(newTheme);
    const resolved = resolveTheme(validated);
    setThemeState(validated);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    onThemeChange?.(validated, resolved);
  };

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newPreference: ResolvedTheme = e.matches ? "dark" : "light";
      setSystemPreference(newPreference);

      if (theme === "system") {
        setResolvedTheme(newPreference);
        applyTheme(newPreference);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext value={{ theme, setTheme, resolvedTheme, systemPreference }}>
      {children}
    </ThemeContext>
  );
}

/**
 * Hook to access and control theme state.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
