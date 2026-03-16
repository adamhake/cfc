const DEFAULT_TIME_ZONE = "America/New_York"
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function getDateKey(date: Date, timeZone = DEFAULT_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  return `${year}-${month}-${day}`
}

export function parseCalendarDate(dateStr: string) {
  if (DATE_ONLY_PATTERN.test(dateStr)) {
    const [year, month, day] = dateStr.split("-").map(Number)
    return new Date(Date.UTC(year, month - 1, day, 12))
  }

  return new Date(dateStr)
}

export function formatDateString(dateStr: string, length: "short" | "long" = "long") {
  return parseCalendarDate(dateStr).toLocaleDateString("en-US", {
    timeZone: DEFAULT_TIME_ZONE,
    year: "numeric",
    month: length === "short" ? "short" : "long",
    day: "numeric",
  })
}

export function isPastDate(dateStr: string, now = new Date()) {
  return getDateKey(parseCalendarDate(dateStr)) < getDateKey(now)
}
