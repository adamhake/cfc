import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import EventCardCondensed from "./event-card-condensed";

// Mock router for Link component
const rootRoute = createRootRoute({
    component: () => <div />,
});

const routeTree = rootRoute.addChildren([]);

const router = createRouter({
    routeTree,
});

const meta = {
    title: "Components/EventCardCondensed",
    component: EventCardCondensed,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <RouterProvider router={router}>
                <Story />
            </RouterProvider>
        ),
    ],
    argTypes: {
        date: { control: "date" },
    },
} satisfies Meta<typeof EventCardCondensed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Community Cleanup Day",
        slug: "community-cleanup-day",
        date: new Date("2023-10-15T09:00:00"),
        image: {
            src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
            alt: "Community cleanup",
            width: 800,
            height: 600,
        },
    },
};

export const LongTitle: Story = {
    args: {
        title: "Annual Chimborazo Park Conservancy Fundraising Gala and Silent Auction Night",
        slug: "fundraising-gala",
        date: new Date("2023-11-20T18:00:00"),
        image: {
            src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
            alt: "Gala event",
            width: 800,
            height: 600,
        },
    },
};
