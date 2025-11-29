import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { subscribeToNewsletter } from "@/server-functions/newsletter";
import type { SubscribeRequest } from "@/types/newsletter";

// Re-export NewsletterSource for backwards compatibility
export type { NewsletterSource } from "@/types/newsletter";

export function useNewsletterSignup() {
  const serverFn = useServerFn(subscribeToNewsletter);

  return useMutation({
    mutationFn: (input: SubscribeRequest) => serverFn({ data: input }),
    mutationKey: ["newsletter", "subscribe"],
  });
}
