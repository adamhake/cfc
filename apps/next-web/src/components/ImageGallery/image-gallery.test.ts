import { describe, expect, it } from "vitest";
import { getResponsiveColumnClasses } from "./image-gallery-utils";

describe("getResponsiveColumnClasses", () => {
  it("builds deterministic responsive grid and masonry classes", () => {
    const classes = getResponsiveColumnClasses({
      default: 1,
      sm: 2,
      md: 3,
      lg: 4,
    });

    expect(classes.gridClassNames).toContain("grid-cols-1");
    expect(classes.gridClassNames).toContain("sm:grid-cols-2");
    expect(classes.gridClassNames).toContain("md:grid-cols-3");
    expect(classes.gridClassNames).toContain("lg:grid-cols-4");

    expect(classes.masonryClassNames).toContain("columns-1");
    expect(classes.masonryClassNames).toContain("sm:columns-2");
    expect(classes.masonryClassNames).toContain("md:columns-3");
    expect(classes.masonryClassNames).toContain("lg:columns-4");
  });
});
