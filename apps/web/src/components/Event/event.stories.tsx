import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import Event from "./event";

const meta = {
  title: "Components/Content/Event",
  component: Event,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: () => (
          <div className="w-[400px]">
            <Story />
          </div>
        ),
      });

      const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/",
        component: () => null,
      });

      const routeTree = rootRoute.addChildren([indexRoute]);

      const router = createRouter({
        routeTree,
        history: createMemoryHistory({
          initialEntries: ["/"],
        }),
      });

      return <RouterProvider router={router} />;
    },
  ],
} satisfies Meta<typeof Event>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockEvent = {
  _id: "event-1",
  _type: "event" as const,
  title: "Community Picnic",
  slug: { current: "community-picnic" },
  description: "Join us for a day of food, fun, and community bonding at the park.",
  date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow (date only)
  time: "12:00 PM - 4:00 PM",
  location: "Central Lawn",
  heroImage: {
    asset: {
      _id: "image-123",
      url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
      metadata: {
        dimensions: {
          width: 800,
          height: 600,
          aspectRatio: 800 / 600,
        },
        lqip: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMEAgIDAAAAAAAAAAAAAQIDBAAFESEGEjFBB3GR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAXEQEBAQEAAAAAAAAAAAAAAAABAAIR/9oADAMBAAIRAxEAPwC0",
      },
    },
    alt: "Picnic in the park",
    hotspot: { x: 0.5, y: 0.5 },
  },
};

export const Upcoming: Story = {
  args: mockEvent,
};

export const Past: Story = {
  args: {
    ...mockEvent,
    _id: "event-2",
    title: "Past Event",
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday (date only)
  },
};
