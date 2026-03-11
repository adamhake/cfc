export function formatDateString(dateStr: string, length: "short" | "long" = "long") {
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: length === "short" ? "short" : "long",
    day: "numeric",
  })
}
