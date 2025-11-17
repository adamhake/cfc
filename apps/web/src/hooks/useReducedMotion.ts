import { useSyncExternalStore } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 */
export function useReducedMotion(): boolean {
  const getSnapshot = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
