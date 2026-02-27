/**
 * Structured logging via OpenTelemetry OTLP → PostHog
 *
 * Uses SimpleLogRecordProcessor (not batched) so each log record is exported
 * immediately — critical for Netlify serverless where the function may freeze
 * before a batch flushes.
 *
 * Gracefully no-ops when POSTHOG_API_KEY is not set (local dev without PostHog).
 */

import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  LoggerProvider,
  SimpleLogRecordProcessor,
} from "@opentelemetry/sdk-logs";

const POSTHOG_OTLP_LOGS_URL = "https://us.i.posthog.com/i/v1/logs";
const SERVICE_NAME = "chimborazo-web";

let provider: LoggerProvider | null = null;

function getProvider(): LoggerProvider | null {
  if (provider) return provider;

  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return null;

  const resource = resourceFromAttributes({
    "service.name": SERVICE_NAME,
  });

  const exporter = new OTLPLogExporter({
    url: POSTHOG_OTLP_LOGS_URL,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  provider = new LoggerProvider({
    resource,
    processors: [new SimpleLogRecordProcessor(exporter)],
  });

  return provider;
}

type LogAttributes = Record<string, string | number | boolean | undefined>;

interface Logger {
  info(message: string, attributes?: LogAttributes): void;
  warn(message: string, attributes?: LogAttributes): void;
  error(message: string, attributes?: LogAttributes): void;
  debug(message: string, attributes?: LogAttributes): void;
}

function cleanAttributes(
  attrs?: LogAttributes,
): Record<string, string | number | boolean> | undefined {
  if (!attrs) return undefined;
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

export function getLogger(name: string): Logger {
  const p = getProvider();

  if (!p) {
    // No-op logger for local dev without PostHog
    return {
      info() {},
      warn() {},
      error() {},
      debug() {},
    };
  }

  const otelLogger = p.getLogger(name);

  return {
    info(message: string, attributes?: LogAttributes) {
      otelLogger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: "INFO",
        body: message,
        attributes: cleanAttributes(attributes),
      });
    },
    warn(message: string, attributes?: LogAttributes) {
      otelLogger.emit({
        severityNumber: SeverityNumber.WARN,
        severityText: "WARN",
        body: message,
        attributes: cleanAttributes(attributes),
      });
    },
    error(message: string, attributes?: LogAttributes) {
      otelLogger.emit({
        severityNumber: SeverityNumber.ERROR,
        severityText: "ERROR",
        body: message,
        attributes: cleanAttributes(attributes),
      });
    },
    debug(message: string, attributes?: LogAttributes) {
      otelLogger.emit({
        severityNumber: SeverityNumber.DEBUG,
        severityText: "DEBUG",
        body: message,
        attributes: cleanAttributes(attributes),
      });
    },
  };
}
