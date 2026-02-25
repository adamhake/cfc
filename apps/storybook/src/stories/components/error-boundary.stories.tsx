import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundary } from "@chimborazo/ui/error-boundary";

const ThrowError = () => {
  throw new Error("Test error for ErrorBoundary story");
};

const meta = {
  title: "Components/Content/ErrorBoundary",
  component: ErrorBoundary,
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithError: Story = {
  args: { children: null },
  render: () => (
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  ),
};

export const WithoutError: Story = {
  args: { children: null },
  render: () => (
    <ErrorBoundary>
      <div className="rounded-xl bg-primary-100 p-6 dark:bg-primary-900">
        <p className="font-body text-primary-800 dark:text-primary-200">
          Content renders normally when there is no error.
        </p>
      </div>
    </ErrorBoundary>
  ),
};
