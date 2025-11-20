import type { Meta, StoryObj } from "@storybook/react-vite";
import Quote from "./quote";

const meta = {
  title: "Components/Content/Quote",
  component: Quote,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quoteText:
      "Nature is not a luxury, but a necessity. We need the calming influences of green spaces to cleanse our souls and rejuvenate our spirits.",
    attribution: "Frederick Law Olmstead",
    backgroundImage: {
      src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80",
      alt: "Nature background",
      width: 1600,
      height: 1200,
    },
  },
};

export const CustomQuote: Story = {
  args: {
    quoteText: "The clearest way into the Universe is through a forest wilderness.",
    attribution: "John Muir",
    backgroundImage: {
      src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",
      alt: "Forest background",
      width: 1600,
      height: 1200,
    },
  },
};
