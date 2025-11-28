import { useMutation } from "@tanstack/react-query"

export type NewsletterSource = "get-involved-page" | "homepage-widget" | "footer"

interface SubscribeRequest {
  email: string
  source: NewsletterSource
  turnstileToken: string
}

interface SubscribeResponse {
  success?: boolean
  error?: string
  message: string
  alreadySubscribed?: boolean
  reactivated?: boolean
}

async function subscribeToNewsletter(
  data: SubscribeRequest
): Promise<SubscribeResponse> {
  const response = await fetch("/api/newsletter-subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = (await response.json()) as SubscribeResponse

  if (!response.ok) {
    throw new Error(result.message || "Failed to subscribe")
  }

  return result
}

export function useNewsletterSignup() {
  return useMutation({
    mutationFn: subscribeToNewsletter,
    mutationKey: ["newsletter", "subscribe"],
  })
}
