import { SeverityNumber } from "@opentelemetry/api-logs"
import { loggerProvider } from "../../../instrumentation"

const logger = loggerProvider.getLogger("chimbo-park-next-web")

export function logInfo(message: string, attributes?: Record<string, string>) {
  logger.emit({
    body: message,
    severityNumber: SeverityNumber.INFO,
    attributes,
  })
}

export function logWarn(message: string, attributes?: Record<string, string>) {
  logger.emit({
    body: message,
    severityNumber: SeverityNumber.WARN,
    attributes,
  })
}

export function logError(message: string, attributes?: Record<string, string>) {
  logger.emit({
    body: message,
    severityNumber: SeverityNumber.ERROR,
    attributes,
  })
}

export { loggerProvider }
