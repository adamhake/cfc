import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Image as OptimizedImage } from "./optimized-image";

const unpicImageMock = vi.fn((props: Record<string, unknown>) => <img alt="" {...props} />);

vi.mock("@unpic/react", () => ({
  Image: (props: Record<string, unknown>) => unpicImageMock(props),
}));

describe("OptimizedImage", () => {
  it("defaults to Netlify fallback for local images", () => {
    render(
      <OptimizedImage
        src="/bike_sunset.webp"
        alt="Park"
        width={1200}
        height={800}
        layout="constrained"
      />,
    );

    expect(unpicImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fallback: "netlify",
        src: "/bike_sunset.webp",
      }),
    );
  });

  it("allows overriding fallback provider", () => {
    render(
      <OptimizedImage
        src="/bike_sunset.webp"
        alt="Park"
        width={1200}
        height={800}
        layout="constrained"
        fallback="cloudinary"
      />,
    );

    expect(unpicImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fallback: "cloudinary",
      }),
    );
  });
});
