import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "@chimborazo/ui/container";

const meta = {
  title: "Components/Layout/Container",
  component: Container,
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "4xl", "6xl"],
    },
    spacing: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    gutter: {
      control: "select",
      options: ["default", "none"],
    },
    as: {
      control: "select",
      options: ["div", "section", "article", "main"],
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-xl bg-primary-100 p-6 dark:bg-primary-900">
        <p className="font-body text-primary-800 dark:text-primary-200">
          Default container with 6xl max-width and medium spacing.
        </p>
      </div>
    ),
  },
};

export const Narrow: Story = {
  args: {
    maxWidth: "2xl",
    children: (
      <div className="rounded-xl bg-primary-100 p-6 dark:bg-primary-900">
        <p className="font-body text-primary-800 dark:text-primary-200">
          Narrow container (max-w-2xl) for text-heavy content.
        </p>
      </div>
    ),
  },
};

export const WithSpacing: Story = {
  args: {
    spacing: "xl",
    children: (
      <>
        <div className="rounded-xl bg-primary-100 p-4 dark:bg-primary-900">
          <p className="font-body text-primary-800 dark:text-primary-200">Item 1</p>
        </div>
        <div className="rounded-xl bg-accent-100 p-4 dark:bg-accent-900">
          <p className="font-body text-accent-800 dark:text-accent-200">Item 2</p>
        </div>
        <div className="rounded-xl bg-grey-200 p-4 dark:bg-grey-700">
          <p className="font-body text-grey-800 dark:text-grey-200">Item 3</p>
        </div>
      </>
    ),
  },
};
