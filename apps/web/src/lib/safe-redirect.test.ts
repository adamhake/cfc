import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "./safe-redirect";

describe("getSafeRedirectPath", () => {
  it("returns a safe in-app path for normal relative redirects", () => {
    expect(getSafeRedirectPath("/events/spring-cleanup")).toBe("/events/spring-cleanup");
    expect(getSafeRedirectPath("/events?sort=asc#upcoming")).toBe("/events?sort=asc#upcoming");
  });

  it("rejects protocol-relative and external redirects", () => {
    expect(getSafeRedirectPath("//evil.com")).toBe("/");
    expect(getSafeRedirectPath("https://evil.com")).toBe("/");
    expect(getSafeRedirectPath("javascript:alert(1)")).toBe("/");
  });

  it("rejects non-path values and backslash variants", () => {
    expect(getSafeRedirectPath(undefined)).toBe("/");
    expect(getSafeRedirectPath(null)).toBe("/");
    expect(getSafeRedirectPath("events")).toBe("/");
    expect(getSafeRedirectPath("/\\evil")).toBe("/");
  });
});
