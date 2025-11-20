import type { Meta, StoryObj } from "@storybook/react-vite";
import PageHero from "./page-hero";

const meta = {
  title: "Components/Content/PageHero",
  component: PageHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Page Title",
    subtitle: "This is a subtitle for the page hero.",
    imageSrc:
      "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Hero Image",
    imageWidth: 2000,
    imageHeight: 1200,
  },
};

export const SmallHeight: Story = {
  args: {
    title: "Small Hero",
    subtitle: "This is a small height hero.",
    imageSrc:
      "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Hero Image",
    imageWidth: 2000,
    imageHeight: 1200,
    height: "small",
  },
};

export const LargeHeight: Story = {
  args: {
    title: "Large Hero",
    subtitle: "This is a large height hero.",
    imageSrc:
      "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Hero Image",
    imageWidth: 2000,
    imageHeight: 1200,
    height: "large",
  },
};

export const CustomAlignment: Story = {
  args: {
    title: "Bottom Aligned",
    subtitle: "This content is aligned to the bottom on mobile.",
    imageSrc:
      "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Hero Image",
    imageWidth: 2000,
    imageHeight: 1200,
    alignment: "bottom-mobile-center-desktop",
  },
};

export const LargeTitle: Story = {
  args: {
    title: "Large Title",
    subtitle: "This hero has a larger title size.",
    imageSrc:
      "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=2000&q=80",
    imageAlt: "Hero Image",
    imageWidth: 2000,
    imageHeight: 1200,
    titleSize: "large",
  },
};
