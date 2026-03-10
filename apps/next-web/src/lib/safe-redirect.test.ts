import { describe, expect, it } from "vitest";
import { getSafeRedirectPath } from "./safe-redirect";

describe("getSafeRedirectPath", () => {
  it("returns / for null or undefined", () => {
    expect(getSafeRedirectPath(null)).toBe("/");
    expect(getSafeRedirectPath(undefined)).toBe("/");
  });

  it("returns / for empty string", () => {
    expect(getSafeRedirectPath("")).toBe("/");
  });

  it("allows valid relative paths", () => {
    expect(getSafeRedirectPath("/about")).toBe("/about");
    expect(getSafeRedirectPath("/events/spring-cleanup")).toBe("/events/spring-cleanup");
  });

  it("preserves query strings and hashes", () => {
    expect(getSafeRedirectPath("/search?q=park")).toBe("/search?q=park");
    expect(getSafeRedirectPath("/page#section")).toBe("/page#section");
  });

  it("rejects paths not starting with /", () => {
    expect(getSafeRedirectPath("about")).toBe("/");
    expect(getSafeRedirectPath("https://evil.com")).toBe("/");
  });

  it("rejects protocol-relative URLs (//)", () => {
    expect(getSafeRedirectPath("//evil.com")).toBe("/");
  });

  it("rejects paths with backslashes", () => {
    expect(getSafeRedirectPath("/path\\evil")).toBe("/");
  });

  it("rejects absolute URLs disguised as paths", () => {
    // Tests URL parsing to prevent open redirect
    expect(getSafeRedirectPath("http://evil.com/path")).toBe("/");
  });
});
