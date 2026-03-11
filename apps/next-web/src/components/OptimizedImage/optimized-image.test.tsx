// @vitest-environment jsdom
import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Image } from "./optimized-image"

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // Render all props as data attributes for inspection
    const dataProps: Record<string, string> = {}
    for (const [key, value] of Object.entries(props)) {
      dataProps[`data-${key.toLowerCase()}`] = String(value)
    }
    return <img {...dataProps} alt={props.alt as string} />
  },
}))

describe("OptimizedImage", () => {
  it("applies default quality of 80", () => {
    const { container } = render(<Image src="/test.webp" alt="Test" width={100} height={100} />)
    const img = container.querySelector("img")
    expect(img?.getAttribute("data-quality")).toBe("80")
  })

  it("applies default lazy loading", () => {
    const { container } = render(<Image src="/test.webp" alt="Test" width={100} height={100} />)
    const img = container.querySelector("img")
    expect(img?.getAttribute("data-loading")).toBe("lazy")
  })

  it("allows overriding quality", () => {
    const { container } = render(
      <Image src="/test.webp" alt="Test" width={100} height={100} quality={50} />,
    )
    const img = container.querySelector("img")
    expect(img?.getAttribute("data-quality")).toBe("50")
  })

  it("allows overriding loading to eager", () => {
    const { container } = render(
      <Image src="/test.webp" alt="Test" width={100} height={100} loading="eager" />,
    )
    const img = container.querySelector("img")
    expect(img?.getAttribute("data-loading")).toBe("eager")
  })

  it("passes through all other props", () => {
    const { container } = render(
      <Image
        src="/test.webp"
        alt="Test image"
        width={200}
        height={150}
        className="custom-class"
      />,
    )
    const img = container.querySelector("img")
    expect(img?.getAttribute("alt")).toBe("Test image")
    expect(img?.getAttribute("data-src")).toBe("/test.webp")
    expect(img?.getAttribute("data-width")).toBe("200")
    expect(img?.getAttribute("data-height")).toBe("150")
    expect(img?.getAttribute("data-classname")).toBe("custom-class")
  })
})
