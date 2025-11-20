import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info, MapPin, Phone } from "lucide-react";
import InfoCard from "./info-card";

const meta = {
    title: "Components/InfoCard",
    component: InfoCard,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        icon: { control: false },
    },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        icon: <Info className="h-6 w-6 text-primary-700 dark:text-primary-300" />,
        title: "Information",
        content: "This is an information card with an icon, title, and content.",
    },
};

export const Location: Story = {
    args: {
        icon: <MapPin className="h-6 w-6 text-primary-700 dark:text-primary-300" />,
        title: "Location",
        content: "3201 E Broad St, Richmond, VA 23223",
    },
};

export const Contact: Story = {
    args: {
        icon: <Phone className="h-6 w-6 text-primary-700 dark:text-primary-300" />,
        title: "Contact Us",
        content: "(804) 646-5733",
    },
};
