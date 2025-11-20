import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundary } from "./error-boundary";

const meta = {
  title: "Components/ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

const ThrowError = () => {
  throw new Error("This is a simulated error for testing the ErrorBoundary.");
};

export const Default: Story = {
  args: {
    children: <div>Content works fine.</div>,
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowError />,
  },
};
