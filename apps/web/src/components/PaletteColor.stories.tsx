import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaletteColor } from "./PaletteColor";

const meta = {
    title: "Components/PaletteColor",
    component: PaletteColor,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof PaletteColor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackgroundColor: Story = {
    args: {
        children: <div className="h-24 w-24 rounded-lg flex items-center justify-center text-white">500</div>,
        property: "backgroundColor",
        shade: 500,
    },
};

export const TextColor: Story = {
    args: {
        children: <div className="text-4xl font-bold">Primary 700 Text</div>,
        property: "color",
        shade: 700,
    },
};

export const BorderColor: Story = {
    args: {
        children: <div className="h-24 w-24 rounded-lg border-4 flex items-center justify-center">Border</div>,
        property: "borderColor",
        shade: 600,
    },
};

export const DarkModeSpecific: Story = {
    args: {
        children: <div className="p-4 rounded bg-gray-100 dark:bg-gray-800">Visible only in dark mode (toggle theme)</div>,
        property: "color",
        shade: 300,
        dark: true,
    },
};
