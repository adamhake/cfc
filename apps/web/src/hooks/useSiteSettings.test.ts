import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFetch, mockGetSanityClient } = vi.hoisted(() => {
  const fetch = vi.fn();
  const getSanityClient = vi.fn(() => ({ fetch }));
  return { mockFetch: fetch, mockGetSanityClient: getSanityClient };
});

vi.mock("@/lib/sanity", () => ({
  getSanityClient: mockGetSanityClient,
}));

import { siteSettingsQueryOptions } from "./useSiteSettings";

describe("siteSettingsQueryOptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("includes preview flag in query key and fetches via preview client", async () => {
    mockFetch.mockResolvedValueOnce({ organizationName: "Chimborazo Park Conservancy" });

    const options = siteSettingsQueryOptions(true);
    expect(options.queryKey).toEqual(["siteSettings", { preview: true }]);

    const result = await options.queryFn?.({
      queryKey: options.queryKey,
      client: {} as never,
      signal: new AbortController().signal,
      meta: undefined,
      pageParam: undefined,
      direction: "forward",
    });

    expect(mockGetSanityClient).toHaveBeenCalledWith(true);
    expect(result).toEqual({ organizationName: "Chimborazo Park Conservancy" });
  });
});
