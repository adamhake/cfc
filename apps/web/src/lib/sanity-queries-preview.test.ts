import {
  eventBySlugQuery,
  getSiteSettingsQuery,
  projectBySlugQuery,
  recentEventsQuery,
} from "@chimborazo/sanity-config";
import { describe, expect, it } from "vitest";

describe("Sanity query preview compatibility", () => {
  it("does not hard-filter drafts in key queries", () => {
    const queries = [eventBySlugQuery, projectBySlugQuery, getSiteSettingsQuery, recentEventsQuery];

    for (const query of queries) {
      expect(query).not.toContain('path("drafts.**")');
    }
  });
});
