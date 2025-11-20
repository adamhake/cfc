import type { Meta, StoryObj } from "@storybook/react-vite";
import StaggeredGrid from "./staggered-grid";

const meta = {
  title: "Components/Layout/StaggeredGrid",
  component: StaggeredGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StaggeredGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const PlaceholderCard = ({ index }: { index: number }) => (
  <div className="h-64 w-full rounded-2xl bg-primary-100 p-6 dark:bg-primary-800">
    <h3 className="mb-2 text-xl font-bold text-primary-900 dark:text-primary-100">
      Item {index + 1}
    </h3>
    <p className="text-primary-800 dark:text-primary-200">
      This is a placeholder card to demonstrate the staggered grid layout.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    children: Array.from({ length: 6 }).map((_, i) => <PlaceholderCard key={i} index={i} />),
    columns: 2,
    gap: "md",
    stagger: "medium",
  },
};

export const ThreeColumns: Story = {
  args: {
    children: Array.from({ length: 9 }).map((_, i) => <PlaceholderCard key={i} index={i} />),
    columns: 3,
    gap: "md",
    stagger: "medium",
  },
};

export const FourColumns: Story = {
  args: {
    children: Array.from({ length: 8 }).map((_, i) => <PlaceholderCard key={i} index={i} />),
    columns: 4,
    gap: "sm",
    stagger: "subtle",
  },
};

export const PronouncedStagger: Story = {
  args: {
    children: Array.from({ length: 6 }).map((_, i) => <PlaceholderCard key={i} index={i} />),
    columns: 2,
    gap: "lg",
    stagger: "pronounced",
  },
};
