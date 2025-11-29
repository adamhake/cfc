import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "./newsletter-form";

// Mock the environment variables
vi.mock("@/env", () => ({
  env: {
    VITE_TURNSTILE_SITE_KEY: undefined, // Disable Turnstile in tests
  },
}));

// Mock the newsletter signup hook
const mockMutateAsync = vi.fn();
vi.mock("@/hooks/useNewsletterSignup", () => ({
  useNewsletterSignup: () => ({
    mutateAsync: mockMutateAsync,
    error: null,
    isPending: false,
  }),
}));

// Mock Turnstile component
vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: () => null,
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient();
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with default label", () => {
    renderWithProviders(<NewsletterForm source="footer" />);

    expect(screen.getByLabelText(/stay updated/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    renderWithProviders(<NewsletterForm source="footer" label="Join our newsletter" />);

    expect(screen.getByLabelText(/join our newsletter/i)).toBeInTheDocument();
  });

  it("shows privacy notice by default", () => {
    renderWithProviders(<NewsletterForm source="footer" />);

    expect(screen.getByText(/we respect your privacy/i)).toBeInTheDocument();
  });

  it("hides privacy notice when showPrivacyNotice is false", () => {
    renderWithProviders(<NewsletterForm source="footer" showPrivacyNotice={false} />);

    expect(screen.queryByText(/we respect your privacy/i)).not.toBeInTheDocument();
  });

  it("validates email format on change", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NewsletterForm source="footer" />);

    const input = screen.getByPlaceholderText(/your.email@example.com/i);
    await user.type(input, "invalid-email");
    await user.tab(); // Blur to trigger validation

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/please enter a valid email/i);
    });
  });

  it("shows success message after successful submission", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({
      success: true,
      message: "Thank you for subscribing!",
    });

    renderWithProviders(<NewsletterForm source="footer" />);

    const input = screen.getByPlaceholderText(/your.email@example.com/i);
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /subscribe/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/you're subscribed!/i)).toBeInTheDocument();
      expect(screen.getByText(/thank you for subscribing!/i)).toBeInTheDocument();
    });
  });

  it("calls onSuccess callback after successful submission", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    mockMutateAsync.mockResolvedValueOnce({
      success: true,
      message: "Thank you!",
    });

    renderWithProviders(<NewsletterForm source="footer" onSuccess={onSuccess} />);

    const input = screen.getByPlaceholderText(/your.email@example.com/i);
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /subscribe/i });
    await user.click(button);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("has proper accessibility attributes", () => {
    renderWithProviders(<NewsletterForm source="footer" />);

    const input = screen.getByPlaceholderText(/your.email@example.com/i);
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("id", "newsletter-email-footer");
  });

  it("generates unique IDs for different sources", () => {
    const { rerender } = renderWithProviders(<NewsletterForm source="footer" />);
    expect(screen.getByPlaceholderText(/your.email@example.com/i)).toHaveAttribute(
      "id",
      "newsletter-email-footer",
    );

    rerender(
      <QueryClientProvider client={createTestQueryClient()}>
        <NewsletterForm source="homepage-widget" />
      </QueryClientProvider>,
    );
    expect(screen.getByPlaceholderText(/your.email@example.com/i)).toHaveAttribute(
      "id",
      "newsletter-email-homepage-widget",
    );
  });

  it("success message container has proper focus management attributes", async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce({
      success: true,
      message: "Thank you!",
    });

    renderWithProviders(<NewsletterForm source="footer" />);

    const input = screen.getByPlaceholderText(/your.email@example.com/i);
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /subscribe/i });
    await user.click(button);

    await waitFor(() => {
      const successContainer = screen.getByRole("status");
      expect(successContainer).toHaveAttribute("tabindex", "-1");
      expect(successContainer).toHaveAttribute("aria-live", "polite");
    });
  });
});
