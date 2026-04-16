import { SeverityNumber } from "@opentelemetry/api-logs"
import { getLoggerProvider } from "../../../instrumentation"

/** Lazy logger accessor — avoids eager OTel SDK init at module import. */
const getLogger = () => getLoggerProvider().getLogger("chimbo-park-next-web")

export function logInfo(message: string, attributes?: Record<string, string>) {
  getLogger().emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
    attributes,
  })
}

export function logWarn(message: string, attributes?: Record<string, string>) {
  getLogger().emit({
    body: message,
    severityNumber: SeverityNumber.WARN,
    attributes,
  })
}

export function logError(message: string, attributes?: Record<string, string>) {
  getLogger().emit({
    body: message,
    severityNumber: SeverityNumber.ERROR,
    attributes,
  })
}

export { getLoggerProvider }
