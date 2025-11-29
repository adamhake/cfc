import { describe, expect, it } from "vitest";
import {
  newsletterSourceSchema,
  subscribeRequestSchema,
  type SubscribeResponse,
} from "./newsletter";

describe("newsletterSourceSchema", () => {
  it("accepts valid sources", () => {
    expect(newsletterSourceSchema.parse("get-involved-page")).toBe("get-involved-page");
    expect(newsletterSourceSchema.parse("homepage-widget")).toBe("homepage-widget");
    expect(newsletterSourceSchema.parse("footer")).toBe("footer");
  });

  it("rejects invalid sources", () => {
    expect(() => newsletterSourceSchema.parse("invalid-source")).toThrow();
    expect(() => newsletterSourceSchema.parse("")).toThrow();
  });
});

describe("subscribeRequestSchema", () => {
  it("validates a complete valid request", () => {
    const validRequest = {
      email: "test@example.com",
      source: "footer",
      turnstileToken: "valid-token",
    };

    const result = subscribeRequestSchema.parse(validRequest);
    expect(result.email).toBe("test@example.com");
    expect(result.source).toBe("footer");
    expect(result.turnstileToken).toBe("valid-token");
  });

  it("rejects invalid email formats", () => {
    const invalidEmails = ["not-an-email", "missing@", "@nodomain.com", "spaces in@email.com"];

    for (const email of invalidEmails) {
      expect(() =>
        subscribeRequestSchema.parse({
          email,
          source: "footer",
          turnstileToken: "token",
        }),
      ).toThrow();
    }
  });

  it("rejects empty turnstile token", () => {
    expect(() =>
      subscribeRequestSchema.parse({
        email: "test@example.com",
        source: "footer",
        turnstileToken: "",
      }),
    ).toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() => subscribeRequestSchema.parse({})).toThrow();
    expect(() =>
      subscribeRequestSchema.parse({
        email: "test@example.com",
      }),
    ).toThrow();
  });
});

describe("SubscribeResponse type", () => {
  it("supports success response type", () => {
    const successResponse: SubscribeResponse = {
      success: true,
      message: "Subscribed successfully",
    };
    expect(successResponse.success).toBe(true);
    expect(successResponse.message).toBe("Subscribed successfully");
  });

  it("supports error response type", () => {
    const errorResponse: SubscribeResponse = {
      success: false,
      error: "Invalid email",
      message: "Please provide a valid email address",
    };
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBe("Invalid email");
    expect(errorResponse.message).toBe("Please provide a valid email address");
  });
});
