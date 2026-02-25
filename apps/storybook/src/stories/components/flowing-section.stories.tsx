import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowingSection } from "@chimborazo/ui/flowing-section";

const meta = {
  title: "Components/Layout/FlowingSection",
  component: FlowingSection,
  argTypes: {
    topWave: { control: "boolean" },
    bottomWave: { control: "boolean" },
  },
} satisfies Meta<typeof FlowingSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    topWave: true,
    bottomWave: true,
    children: (
      <div className="px-8 py-12">
        <h2 className="mb-4 font-display text-3xl text-primary-800 dark:text-primary-200">
          Section with Wave Dividers
        </h2>
        <p className="font-body text-grey-700 dark:text-grey-300">
          Content flows naturally between sections with organic wave transitions.
        </p>
      </div>
    ),
  },
};

export const TopWaveOnly: Story = {
  args: {
    topWave: true,
    bottomWave: false,
    children: (
      <div className="px-8 py-12">
        <p className="font-body text-grey-700 dark:text-grey-300">Top wave only.</p>
      </div>
    ),
  },
};

export const BottomWaveOnly: Story = {
  args: {
    topWave: false,
    bottomWave: true,
    children: (
      <div className="px-8 py-12">
        <p className="font-body text-grey-700 dark:text-grey-300">Bottom wave only.</p>
      </div>
    ),
  },
};
