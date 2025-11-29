/**
 * Format a date string for display
 *
 * @param dateStr - ISO date string to format
 * @param length - "short" for abbreviated month, "long" for full month name
 * @returns Formatted date string (e.g., "November 28, 2025" or "Nov 28, 2025")
 */
export function formatDateString(dateStr: string, length: "short" | "long" = "long") {
  return new Date(dateStr).toLocaleDateString("en-US", {
    // Use Richmond, VA timezone to ensure consistent date display for events
    timeZone: "America/New_York",
    year: "numeric",
    month: length === "short" ? "short" : "long",
    day: "numeric",
  });
}
