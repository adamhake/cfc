import { useMutation } from "@tanstack/react-query";
import type { SubscribeRequest, SubscribeResponse } from "@/types/newsletter";

// Re-export NewsletterSource for backwards compatibility
export type { NewsletterSource } from "@/types/newsletter";

async function subscribeToNewsletter(data: SubscribeRequest): Promise<SubscribeResponse> {
  const response = await fetch("/api/newsletter-subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as SubscribeResponse;

  if (!response.ok) {
    throw new Error(result.message || "Failed to subscribe");
  }

  return result;
}

export function useNewsletterSignup() {
  return useMutation({
    mutationFn: subscribeToNewsletter,
    mutationKey: ["newsletter", "subscribe"],
  });
}
