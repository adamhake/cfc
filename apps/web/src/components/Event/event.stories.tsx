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
  id: "event-1",
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
    id: "event-2",
    title: "Past Event",
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
};
