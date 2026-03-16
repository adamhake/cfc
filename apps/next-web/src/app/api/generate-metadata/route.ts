import { z } from "zod"

export const runtime = "nodejs"

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514"

const requestSchema = z.object({
  imageUrl: z
    .string()
    .url()
    .refine((value) => {
      const url = new URL(value)
      return url.protocol === "https:" && url.hostname === "cdn.sanity.io"
    }, "imageUrl must be a Sanity CDN URL"),
})

const metadataSchema = z.object({
  title: z.string().min(1).max(80),
  alt: z.string().min(1).max(200),
  caption: z.string().min(1).max(200),
  category: z.enum(["park-views", "events", "nature", "community", "history"]),
})

function isAllowedOrigin(origin: string | null) {
  const allowedOrigins = new Set(["http://localhost:3333"])
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL

  if (studioUrl) {
    try {
      allowedOrigins.add(new URL(studioUrl).origin)
    } catch {
      console.warn("[AI Metadata] Invalid NEXT_PUBLIC_SANITY_STUDIO_URL:", studioUrl)
    }
  }

  if (!origin) {
    return process.env.NODE_ENV !== "production"
  }

  return allowedOrigins.has(origin)
}

function extractMetadataJson(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Anthropic response did not contain a JSON object")
  }

  return JSON.parse(jsonMatch[0]) as unknown
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"))) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const json = await request.json().catch(() => null)
  const parsedRequest = requestSchema.safeParse(json)

  if (!parsedRequest.success) {
    return Response.json(
      { error: parsedRequest.error.issues[0]?.message || "Invalid request body" },
      { status: 400 },
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error("[AI Metadata] ANTHROPIC_API_KEY not configured")
    return Response.json({ error: "AI metadata generation is not configured" }, { status: 500 })
  }

  const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 300,
      temperature: 0.2,
      system:
        "You generate concise metadata for a public park conservancy website. Return JSON only with keys title, alt, caption, and category. title should be 3-8 words, alt should accurately describe the image for accessibility, caption should be 1 sentence, and category must be one of park-views, events, nature, community, or history.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "url",
                url: parsedRequest.data.imageUrl,
              },
            },
            {
              type: "text",
              text: "Analyze this image and return strict JSON only.",
            },
          ],
        },
      ],
    }),
  })

  if (!anthropicResponse.ok) {
    const errorBody = await anthropicResponse.text()
    console.error("[AI Metadata] Anthropic request failed:", anthropicResponse.status, errorBody)
    return Response.json({ error: "Failed to generate metadata" }, { status: 502 })
  }

  const responseBody = (await anthropicResponse.json()) as {
    content?: Array<{ type: string; text?: string }>
  }

  const textContent = responseBody.content
    ?.filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim()

  if (!textContent) {
    console.error("[AI Metadata] Anthropic response did not contain text content")
    return Response.json({ error: "Failed to generate metadata" }, { status: 502 })
  }

  try {
    const metadata = metadataSchema.parse(extractMetadataJson(textContent))
    return Response.json(metadata)
  } catch (error) {
    console.error("[AI Metadata] Failed to parse metadata:", error)
    return Response.json({ error: "Failed to generate metadata" }, { status: 502 })
  }
}
