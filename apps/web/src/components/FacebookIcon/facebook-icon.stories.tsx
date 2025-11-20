import type { Meta, StoryObj } from "@storybook/react-vite";
import { FacebookIcon } from "./facebook-icon";

const meta = {
    title: "Components/Icons/FacebookIcon",
    component: FacebookIcon,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof FacebookIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Large: Story = {
    args: {
        className: "h-12 w-12 text-blue-600",
    },
};

export const CustomColor: Story = {
    args: {
        className: "h-8 w-8 text-accent-600",
    },
};
