import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GetInvolved from "./get-involved";

// Mock QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const meta = {
    title: "Components/GetInvolved",
    component: GetInvolved,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <Story />
            </QueryClientProvider>
        ),
    ],
} satisfies Meta<typeof GetInvolved>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomContent: Story = {
    args: {
        title: "Join Our Cause",
        description: "We need your help to make the park better for everyone.",
    },
};
