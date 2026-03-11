// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

// Mock next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock posthog events
vi.mock("@/integrations/posthog/events", () => ({
  trackCtaClick: vi.fn(),
}))

import { trackCtaClick } from "@/integrations/posthog/events"

describe("Button", () => {
  it("renders as a button by default", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe("BUTTON")
  })

  it("renders as a link when as=a", () => {
    render(
      <Button as="a" href="/donate">
        Donate
      </Button>,
    )
    const link = screen.getByRole("link", { name: "Donate" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/donate")
  })

  it("calls onClick handler", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByRole("button"))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>,
    )
    await user.click(screen.getByRole("button"))

    expect(handleClick).not.toHaveBeenCalled()
  })

  it("sets correct button type", () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("defaults to type=button", () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "button")
  })

  it("applies aria-label", () => {
    render(<Button aria-label="Close menu">X</Button>)
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<Button className="mt-4">Styled</Button>)
    expect(screen.getByRole("button")).toHaveClass("mt-4")
  })

  it("appends hash to href when as=a", () => {
    render(
      <Button as="a" href="/page" hash="section">
        Go
      </Button>,
    )
    expect(screen.getByRole("link")).toHaveAttribute("href", "/page#section")
  })

  it("sets target and rel on links", () => {
    render(
      <Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
        External
      </Button>,
    )
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  it("applies data-zeffy-form-link attribute", () => {
    render(<Button data-zeffy-form-link="form-123">Donate</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("data-zeffy-form-link", "form-123")
  })

  describe("tracking", () => {
    it("fires posthog event when trackingLocation is set", async () => {
      const user = userEvent.setup()

      render(<Button trackingLocation="hero">Donate Now</Button>)
      await user.click(screen.getByRole("button"))

      expect(trackCtaClick).toHaveBeenCalledWith("hero", "Donate Now")
    })

    it("uses aria-label for tracking when children is not a string", async () => {
      const user = userEvent.setup()

      render(
        <Button trackingLocation="header" aria-label="Go home">
          <span>Icon</span>
        </Button>,
      )
      await user.click(screen.getByRole("button"))

      expect(trackCtaClick).toHaveBeenCalledWith("header", "Go home")
    })

    it("does not fire tracking event when trackingLocation is not set", async () => {
      const user = userEvent.setup()
      vi.mocked(trackCtaClick).mockClear()

      render(<Button>No tracking</Button>)
      await user.click(screen.getByRole("button"))

      expect(trackCtaClick).not.toHaveBeenCalled()
    })
  })

  describe("variants", () => {
    it("applies primary variant classes", () => {
      render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole("button").className).toContain("bg-primary-700")
    })

    it("applies secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole("button").className).toContain("bg-primary-100")
    })

    it("applies outline variant classes", () => {
      render(<Button variant="outline">Outline</Button>)
      expect(screen.getByRole("button").className).toContain("bg-transparent")
    })

    it("applies accent variant classes", () => {
      render(<Button variant="accent">Accent</Button>)
      expect(screen.getByRole("button").className).toContain("bg-accent-600")
    })
  })

  describe("sizes", () => {
    it("applies small size classes", () => {
      render(<Button size="small">Small</Button>)
      expect(screen.getByRole("button").className).toContain("px-4")
    })

    it("applies large size classes", () => {
      render(<Button size="large">Large</Button>)
      expect(screen.getByRole("button").className).toContain("px-8")
    })
  })
})
