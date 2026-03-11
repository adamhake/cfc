export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e")

  // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires dangerouslySetInnerHTML
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson }} />
}
