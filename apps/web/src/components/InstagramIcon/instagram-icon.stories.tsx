import type { Meta, StoryObj } from "@storybook/react-vite";
import { InstagramIcon } from "./instagram-icon";

const meta = {
    title: "Components/Icons/InstagramIcon",
    component: InstagramIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof InstagramIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Large: Story = {
    args: {
        className: "h-12 w-12 text-pink-600",
    },
};

export const CustomColor: Story = {
    args: {
        className: "h-8 w-8 text-accent-600",
    },
};
