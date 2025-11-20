import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import Event from "./event";

// Mock router
const rootRoute = createRootRoute({
    component: () => <div />,
});

const routeTree = rootRoute.addChildren([]);

const router = createRouter({
    routeTree,
});

const meta = {
    title: "Components/Event",
    component: Event,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <RouterProvider router={router}>
                <div className="w-[400px]">
                    <Story />
                </div>
            </RouterProvider>
        ),
    ],
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvent = {
    title: "Community Picnic",
    slug: "community-picnic",
    description: "Join us for a day of food, fun, and community bonding at the park.",
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    time: "12:00 PM - 4:00 PM",
    location: "Central Lawn",
    image: {
        src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
        alt: "Picnic in the park",
        width: 800,
        height: 600,
    },
};

export const Upcoming: Story = {
    args: mockEvent,
};

export const Past: Story = {
    args: {
        ...mockEvent,
        title: "Past Event",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
};
