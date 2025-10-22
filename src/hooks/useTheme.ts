import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  type ThemeMode,
  type ResolvedTheme,
  getSystemPreference,
  applyTheme,
  validateTheme,
} from "@/utils/theme";

export interface UseThemeReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
  systemPreference: ResolvedTheme;
}

/**
 * Hook to access and control theme state
 * Integrates with TanStack Router context
 */
export function useTheme(): UseThemeReturn {
  const router = useRouter();
  const context = router.options.context;
  const currentTheme = context.theme;

  const [systemPreference, setSystemPreference] = useState<ResolvedTheme>(
    getSystemPreference()
  );

  // Listen to system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newPreference = e.matches ? 'dark' : 'light';
      setSystemPreference(newPreference);

      // If user has system preference enabled, update resolved theme
      if (currentTheme === 'system') {
        applyTheme(newPreference);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  // Listen to storage events for multi-tab sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const setTheme = context.setTheme;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = validateTheme(e.newValue);
        setTheme(newTheme);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [context.setTheme]);

  return {
    theme: context.theme,
    setTheme: context.setTheme,
    resolvedTheme: context.resolvedTheme,
    systemPreference,
  };
}
