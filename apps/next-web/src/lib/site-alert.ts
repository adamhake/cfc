export interface SiteAlertMessageBlock {
  _type?: string
  children?: Array<{
    text?: string
  }>
}

export interface SiteAlertSettings {
  enabled?: boolean | null
  label?: string | null
  message?: string | SiteAlertMessageBlock[] | null
  startsAt?: string | null
  expiresAt?: string | null
}

export interface ActiveSiteAlert {
  label: string
  message: string | SiteAlertMessageBlock[]
}

export const CURRENT_SITE_ALERT: SiteAlertSettings = {
  enabled: true,
  label: "Park access notice",
  message:
    "Government Road will be closed to vehicle access Aug. 31–Sept. 4 during construction. Both Lower Chimborazo dog parks will remain open via sidewalk and trail access.",
  expiresAt: "2026-09-05T04:00:00.000Z",
}

function parseBoundary(value: string | null | undefined): number | null {
  if (!value) return null

  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : Number.NaN
}

export function getConfiguredSiteAlert(
  settings: SiteAlertSettings | null | undefined,
): ActiveSiteAlert | null {
  const configuredMessage = settings?.message
  const message =
    typeof configuredMessage === "string" ? configuredMessage.trim() : configuredMessage

  const hasMessage = Array.isArray(message)
    ? message.some((block) =>
        block.children?.some((child) => typeof child.text === "string" && child.text.trim()),
      )
    : Boolean(message)

  if (!settings?.enabled || !message || !hasMessage) return null

  return {
    label: settings.label?.trim() || "Park notice",
    message,
  }
}

export function getActiveSiteAlert(
  settings: SiteAlertSettings | null | undefined,
  now: Date,
): ActiveSiteAlert | null {
  const alert = getConfiguredSiteAlert(settings)
  if (!alert) return null

  const startsAt = parseBoundary(settings?.startsAt)
  const expiresAt = parseBoundary(settings?.expiresAt)
  const nowTimestamp = now.getTime()

  if (Number.isNaN(startsAt) || Number.isNaN(expiresAt)) return null
  if (startsAt !== null && nowTimestamp < startsAt) return null
  if (expiresAt !== null && nowTimestamp >= expiresAt) return null

  return alert
}
