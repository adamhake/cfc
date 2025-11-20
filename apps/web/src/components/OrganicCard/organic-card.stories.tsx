import type { Meta, StoryObj } from "@storybook/react-vite";
import OrganicCard from "./organic-card";

const meta = {
  title: "Components/Content/OrganicCard",
  component: OrganicCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof OrganicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderContent = () => (
  <div className="bg-primary-100 p-8 text-center dark:bg-primary-800">
    <h3 className="mb-2 text-xl font-bold text-primary-900 dark:text-primary-100">
      Organic Content
    </h3>
    <p className="text-primary-800 dark:text-primary-200">
      This card has organic, asymmetric rounded corners.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    children: <PlaceholderContent />,
    variant: "medium",
    tilt: "none",
  },
};

export const Subtle: Story = {
  args: {
    children: <PlaceholderContent />,
    variant: "subtle",
  },
};

export const Bold: Story = {
  args: {
    children: <PlaceholderContent />,
    variant: "bold",
  },
};

export const SlightTilt: Story = {
  args: {
    children: <PlaceholderContent />,
    tilt: "slight",
  },
};

export const MediumTilt: Story = {
  args: {
    children: <PlaceholderContent />,
    tilt: "medium",
  },
};
