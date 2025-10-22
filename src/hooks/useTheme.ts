import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  type ThemeMode,
  type ResolvedTheme,
  getSystemPreference,
  resolveTheme,
  applyTheme,
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
      if (context.theme === 'system') {
        applyTheme(newPreference);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [context.theme]);

  // Listen to storage events for multi-tab sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme' && e.newValue) {
        const newTheme = e.newValue as ThemeMode;
        const newResolved = resolveTheme(newTheme);
        context.setTheme(newTheme);
        applyTheme(newResolved);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [context]);

  return {
    theme: context.theme,
    setTheme: context.setTheme,
    resolvedTheme: context.resolvedTheme,
    systemPreference,
  };
}
