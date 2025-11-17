import { usePalette } from "@/hooks/usePalette";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PALETTE_METADATA, type PaletteMode } from "@/utils/palette";
import { useClickAway } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Palette } from "lucide-react";
import { useState } from "react";

export interface PaletteSwitcherProps {
  /**
   * Visual variant of the switcher
   */
  variant?: "button" | "compact";
  /**
   * Whether to show text label alongside icon
   */
  showLabel?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Palette switcher component that allows selecting from 6 color palettes
 */
export function PaletteSwitcher({
  variant = "button",
  showLabel = true,
  className = "",
}: PaletteSwitcherProps) {
  const { palette, setPalette } = usePalette();
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const ref = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const currentPaletteName = PALETTE_METADATA[palette].name;

  const palettes: PaletteMode[] = ["green", "olive", "green-terra", "green-navy"];

  const handleSelect = (newPalette: PaletteMode) => {
    setPalette(newPalette);
    setIsOpen(false);
  };

  if (variant === "compact") {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className={`flex items-center gap-2 rounded-xl border border-grey-200 bg-grey-100/75 px-3 py-2 font-body text-xs font-semibold text-grey-800 uppercase backdrop-blur backdrop-filter transition hover:border-grey-300 hover:bg-grey-200 dark:border-grey-700 dark:bg-primary-800/75 dark:text-grey-100 dark:hover:border-primary-600 dark:hover:bg-primary-800 ${className}`}
          aria-label={`Current palette: ${currentPaletteName}. Click to change.`}
          aria-expanded={isOpen}
        >
          <Palette className="h-4 w-4" />
          {showLabel && <span className="hidden sm:inline">{currentPaletteName}</span>}
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={
                prefersReducedMotion
                  ? {}
                  : { opacity: 0, scale: 0.95, transformOrigin: "top right" }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: [0, 0, 0.2, 1] }}
              className="absolute top-full right-0 z-50 mt-2 w-72 rounded-xl border border-grey-200 bg-white p-3 shadow-lg dark:border-grey-700 dark:bg-grey-800"
            >
              <div className="mb-2 px-2 font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
                Color Palette
              </div>
              <div className="space-y-1">
                {palettes.map((paletteOption) => {
                  const meta = PALETTE_METADATA[paletteOption];
                  const isActive = palette === paletteOption;

                  return (
                    <button
                      key={paletteOption}
                      onClick={() => handleSelect(paletteOption)}
                      className={`w-full rounded-lg px-3 py-2 text-left transition ${
                        isActive
                          ? "bg-primary-100 dark:bg-primary-900"
                          : "hover:bg-grey-100 dark:hover:bg-grey-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className={`font-body text-sm font-semibold ${
                              isActive
                                ? "text-primary-800 dark:text-primary-300"
                                : "text-grey-800 dark:text-grey-100"
                            }`}
                          >
                            {meta.name}
                          </div>
                          <div className="font-body text-xs text-grey-600 dark:text-grey-400">
                            {meta.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 dark:bg-primary-600">
                            <svg
                              className="h-3 w-3 text-primary-50"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={`flex items-center gap-2 rounded-xl border border-grey-200 bg-grey-100/75 px-4 py-2 font-body text-sm font-semibold text-grey-800 uppercase backdrop-blur backdrop-filter transition hover:border-grey-300 hover:bg-grey-200 dark:border-grey-700 dark:bg-primary-800/75 dark:text-grey-100 dark:hover:border-primary-600 dark:hover:bg-primary-800 ${className}`}
        aria-label={`Current palette: ${currentPaletteName}. Click to change.`}
        aria-expanded={isOpen}
      >
        <Palette className="h-5 w-5" />
        {showLabel && <span>{currentPaletteName}</span>}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              prefersReducedMotion ? {} : { opacity: 0, scale: 0.95, transformOrigin: "top right" }
            }
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-grey-200 bg-white p-4 shadow-lg dark:border-grey-700 dark:bg-grey-800"
          >
            <div className="mb-3 px-2 font-body text-xs font-semibold text-grey-600 uppercase dark:text-grey-400">
              Choose Color Palette
            </div>
            <div className="space-y-2">
              {palettes.map((paletteOption) => {
                const meta = PALETTE_METADATA[paletteOption];
                const isActive = palette === paletteOption;

                return (
                  <button
                    key={paletteOption}
                    onClick={() => handleSelect(paletteOption)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900"
                        : "hover:bg-grey-100 dark:hover:bg-grey-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className={`font-body text-sm font-semibold ${
                            isActive
                              ? "text-primary-800 dark:text-primary-300"
                              : "text-grey-800 dark:text-grey-100"
                          }`}
                        >
                          {meta.name}
                        </div>
                        <div className="font-body text-xs text-grey-600 dark:text-grey-400">
                          {meta.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-700 dark:bg-primary-600">
                          <svg
                            className="h-4 w-4 text-primary-50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
