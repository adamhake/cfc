import { z } from "zod";

/**
 * Valid sources for newsletter signups
 * Used for analytics and tracking signup locations
 */
export const newsletterSourceSchema = z.enum(["get-involved-page", "homepage-widget", "footer"]);

export type NewsletterSource = z.infer<typeof newsletterSourceSchema>;

/**
 * Schema for validating newsletter subscription requests
 */
export const subscribeRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: newsletterSourceSchema,
  turnstileToken: z.string().min(1, "Security token is required"),
});

export type SubscribeRequest = z.infer<typeof subscribeRequestSchema>;

/**
 * Response from the newsletter subscription API
 */
export interface SubscribeResponse {
  success?: boolean;
  error?: string;
  message: string;
}
