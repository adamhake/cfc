import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import EventCardCondensed from "./event-card-condensed";

const meta = {
  title: "Components/Content/EventCardCondensed",
  component: EventCardCondensed,
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
    date: "2023-10-15T09:00:00",
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
    date: "2023-11-20T18:00:00",
    image: {
      src: "https://images.unsplash.com/photo-1501854140884-074cf2b2b3af?auto=format&fit=crop&w=1000&q=80",
      alt: "Gala event",
      width: 800,
      height: 600,
    },
  },
};

/**
 * Past event - shows how completed events are displayed
 */
export const PastEvent: Story = {
  args: {
    title: "Winter Festival",
    slug: "winter-festival",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    image: {
      src: "https://images.unsplash.com/photo-1482012792084-a0c3725f289f?auto=format&fit=crop&w=1000&q=80",
      alt: "Winter festival",
      width: 800,
      height: 600,
    },
  },
};

/**
 * Event without an image - tests fallback behavior
 * Note: Image prop is required by component, so using a placeholder
 */
export const MissingImage: Story = {
  args: {
    title: "Community Meeting",
    slug: "community-meeting",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    image: {
      src: "",
      alt: "",
      width: 0,
      height: 0,
    },
  },
};

/**
 * Event with short title
 */
export const ShortTitle: Story = {
  args: {
    title: "Yoga",
    slug: "yoga",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    image: {
      src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1000&q=80",
      alt: "Yoga session",
      width: 800,
      height: 600,
    },
  },
};
