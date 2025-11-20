import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "./button";

const meta = {
  title: "Components/Interactive/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    children: "Disabled Button",
    disabled: true,
  },
};

/**
 * Accent variant for call-to-action buttons
 */
export const Accent: Story = {
  args: {
    variant: "accent",
    children: "Donate Now",
  },
};

/**
 * Small size variant for compact layouts
 */
export const Small: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: "Small Button",
  },
};

/**
 * Button rendered as an anchor tag for navigation
 */
export const AsLink: Story = {
  args: {
    variant: "primary",
    as: "a",
    href: "https://example.com",
    target: "_blank",
    rel: "noopener noreferrer",
    children: "Visit Website",
  },
};

/**
 * Submit button type for forms
 */
export const SubmitButton: Story = {
  args: {
    variant: "primary",
    type: "submit",
    children: "Submit Form",
  },
};

/**
 * All variants displayed together for comparison
 */
export const AllVariants: Story = {
  args: {
    children: "Button",
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="accent">Accent</Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" size="small">
          Small Primary
        </Button>
        <Button variant="secondary" size="small">
          Small Secondary
        </Button>
        <Button variant="outline" size="small">
          Small Outline
        </Button>
        <Button variant="accent" size="small">
          Small Accent
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" disabled>
          Disabled Primary
        </Button>
        <Button variant="secondary" disabled>
          Disabled Secondary
        </Button>
        <Button variant="outline" disabled>
          Disabled Outline
        </Button>
        <Button variant="accent" disabled>
          Disabled Accent
        </Button>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};

/**
 * Interaction test demonstrating button click behavior
 */
export const WithInteraction: Story = {
  args: {
    variant: "primary",
    children: "Click Me!",
  },
  play: async ({ args, canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Find and click the button", async () => {
      const button = canvas.getByRole("button", { name: /click me/i });

      // Verify button is in the document
      expect(button).toBeInTheDocument();

      // Click the button
      await userEvent.click(button);

      // Verify onClick was called
      expect(args.onClick).toHaveBeenCalled();
    });

    await step("Verify button is accessible via keyboard", async () => {
      const button = canvas.getByRole("button", { name: /click me/i });

      // Focus the button
      button.focus();
      expect(button).toHaveFocus();

      // Press Enter key
      await userEvent.keyboard("{Enter}");

      // Verify onClick was called again
      expect(args.onClick).toHaveBeenCalledTimes(2);
    });
  },
};
