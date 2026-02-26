import { describe, expect, it } from "vitest";
import { shouldPrerenderPath } from "./prerender-filter";

describe("shouldPrerenderPath", () => {
  it("disables homepage prerendering", () => {
    expect(shouldPrerenderPath("/")).toBe(false);
  });

  it("disables component documentation prerendering", () => {
    expect(shouldPrerenderPath("/components")).toBe(false);
  });

  it("disables prerendering for all routes", () => {
    expect(shouldPrerenderPath("/about")).toBe(false);
    expect(shouldPrerenderPath("/events/spring-cleanup")).toBe(false);
  });
});
