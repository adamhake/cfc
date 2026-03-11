// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { ErrorBoundary } from "./error-boundary"

// Mock the Button component to avoid complex dependency chain
vi.mock("../Button/button", () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error message")
  }
  return <div>Child content renders correctly</div>
}

describe("ErrorBoundary", () => {
  const originalConsoleError = console.error

  beforeEach(() => {
    // Suppress React error boundary console.error noise in test output
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Child content renders correctly")).toBeInTheDocument()
  })

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument()
  })

  it("shows refresh button in error state", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Refresh Page")).toBeInTheDocument()
  })

  it("calls window.location.reload when refresh button clicked", async () => {
    const user = userEvent.setup()
    const reloadMock = vi.fn()
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, reload: reloadMock },
    })

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    await user.click(screen.getByText("Refresh Page"))
    expect(reloadMock).toHaveBeenCalled()
  })

  it("shows error details in development mode", () => {
    const originalEnv = process.env.NODE_ENV
    vi.stubEnv("NODE_ENV", "development")

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Error details")).toBeInTheDocument()
    expect(screen.getByText(/Test error message/)).toBeInTheDocument()

    vi.stubEnv("NODE_ENV", originalEnv ?? "test")
  })
})
