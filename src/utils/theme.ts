/**
 * Theme utilities for dark mode support
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

/**
 * Validates a theme value from storage
 */
export function validateTheme(value: string | null): ThemeMode {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

/**
 * Gets the current system preference
 */
export function getSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Resolves theme mode to actual theme
 */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return getSystemPreference();
  }
  return mode;
}

/**
 * Safely gets theme from localStorage
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return validateTheme(stored);
  } catch (e) {
    console.warn('Failed to read theme from localStorage', e);
    return 'system';
  }
}

/**
 * Safely stores theme to localStorage
 */
export function storeTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {
    console.warn('Failed to store theme to localStorage', e);
  }
}

/**
 * Applies theme to document
 */
export function applyTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
