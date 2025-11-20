import type { Meta, StoryObj } from "@storybook/react-vite";
import FlowingSection from "./flowing-section";

const meta = {
  title: "Components/Layout/FlowingSection",
  component: FlowingSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof FlowingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderContent = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <h2 className="mb-4 text-3xl font-bold text-grey-900 dark:text-grey-100">Section Content</h2>
    <p className="text-lg text-grey-700 dark:text-grey-300">
      This is a flowing section with organic wave dividers.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    children: <PlaceholderContent />,
    backgroundColor: "bg-primary-100 dark:bg-primary-900",
  },
};

export const TopWave: Story = {
  args: {
    children: <PlaceholderContent />,
    topWave: true,
    backgroundColor: "bg-primary-100 dark:bg-primary-900",
    waveColor: "fill-white dark:fill-grey-950",
  },
};

export const BottomWave: Story = {
  args: {
    children: <PlaceholderContent />,
    bottomWave: true,
    backgroundColor: "bg-primary-100 dark:bg-primary-900",
    waveColor: "fill-white dark:fill-grey-950",
  },
};

export const BothWaves: Story = {
  args: {
    children: <PlaceholderContent />,
    topWave: true,
    bottomWave: true,
    backgroundColor: "bg-primary-100 dark:bg-primary-900",
    waveColor: "fill-white dark:fill-grey-950",
  },
};
