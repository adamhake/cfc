import type { Meta, StoryObj } from "@storybook/react-vite";
import AsymmetricSection from "./asymmetric-section";

const meta = {
  title: "Components/Layout/AsymmetricSection",
  component: AsymmetricSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    imageSlot: { control: false },
    contentSlot: { control: false },
  },
} satisfies Meta<typeof AsymmetricSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const ImagePlaceholder = () => (
  <img
    src="https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80"
    alt="Placeholder"
    className="h-full w-full object-cover"
  />
);

const ContentPlaceholder = () => (
  <div className="p-4">
    <h2 className="mb-4 text-3xl font-bold text-grey-900 dark:text-grey-100">Section Title</h2>
    <p className="text-lg text-grey-700 dark:text-grey-300">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
  </div>
);

export const Default: Story = {
  args: {
    imageSlot: <ImagePlaceholder />,
    contentSlot: <ContentPlaceholder />,
    imagePosition: "left",
    imageSize: "medium",
    curved: true,
  },
};

export const RightImage: Story = {
  args: {
    imageSlot: <ImagePlaceholder />,
    contentSlot: <ContentPlaceholder />,
    imagePosition: "right",
    imageSize: "medium",
    curved: true,
  },
};

export const SmallImage: Story = {
  args: {
    imageSlot: <ImagePlaceholder />,
    contentSlot: <ContentPlaceholder />,
    imagePosition: "left",
    imageSize: "small",
    curved: true,
  },
};

export const LargeImage: Story = {
  args: {
    imageSlot: <ImagePlaceholder />,
    contentSlot: <ContentPlaceholder />,
    imagePosition: "left",
    imageSize: "large",
    curved: true,
  },
};

export const NoCurve: Story = {
  args: {
    imageSlot: <ImagePlaceholder />,
    contentSlot: <ContentPlaceholder />,
    imagePosition: "left",
    imageSize: "medium",
    curved: false,
  },
};
