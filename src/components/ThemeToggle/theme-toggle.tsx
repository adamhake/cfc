import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";

export interface ThemeToggleProps {
  /**
   * Visual variant of the toggle
   */
  variant?: "button" | "nav-item";
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
 * Theme toggle component that cycles through light, dark, and system modes
 */
export function ThemeToggle({
  variant = "button",
  showLabel = true,
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "system":
        return <Monitor className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
    }
  };

  const getAriaLabel = () => {
    return `Current theme: ${getLabel()}. Click to cycle to next theme.`;
  };

  if (variant === "nav-item") {
    return (
      <button
        onClick={handleToggle}
        type="button"
        className={`flex items-center gap-2 font-body font-medium text-grey-800 transition hover:border-b-2 hover:border-b-primary-700 dark:text-grey-100 dark:hover:border-b-primary-500 ${className}`}
        aria-label={getAriaLabel()}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {getIcon()}
        </motion.span>
        {showLabel && <span>Theme: {getLabel()}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`flex items-center gap-2 rounded-xl border border-grey-200 bg-grey-100/75 px-4 py-2 font-body text-xs font-semibold text-grey-800 uppercase backdrop-blur backdrop-filter transition hover:border-grey-300 hover:bg-grey-200 dark:border-grey-700 dark:bg-primary-800/75 dark:text-grey-100 dark:hover:border-primary-600 dark:hover:bg-primary-800 ${className}`}
      aria-label={getAriaLabel()}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {getIcon()}
      </motion.span>
      {showLabel && <span>{getLabel()}</span>}
    </button>
  );
}
