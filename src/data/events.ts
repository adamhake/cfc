export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export const events: Event[] = [
  {
    id: 1,
    title: "Spring Clean-up 2022",
    slug: "spring-cleanup-2022",
    description:
      "Join neighbors for our spring park clean-up to prepare Chimborazo for the warmer months ahead. All ages welcome—bring gloves and community spirit.",
    date: "2022-04-23",
    time: "9am - 12pm",
    location: "Meet at the center circle",
    image: {
      src: "sign_cleanup_2022.webp",
      alt: "Volunteers cleaning Chimborazo Park",
      width: 1200,
      height: 1357,
    },
  },
  {
    id: 2,
    title: "Chimborazo Round House Holiday Open House",
    slug: "chimborazo-round-house-holiday-open-house",
    description:
      "Chimbo Park Conservancy is a non-profit organization dedicated to preserving and enhancing the beauty of Chimbo Park.",
    date: "2022-12-11",
    time: "12pm - 5pm",
    location: "Chimborazo Park Round House",
    image: {
      src: "roundhouse_evening.webp",
      alt: "Chimborazo Park Round House",
      width: 2048,
      height: 1536,
    },
  },
  {
    id: 3,
    title: "Spring Clean-up 2023",
    slug: "spring-cleanup-2023",
    description:
      "Help beautify our historic park as we clear winter debris and prepare trails and greenspaces for spring. Community volunteers of all ages are encouraged to participate.",
    date: "2023-04-01",
    time: "9am - 12pm",
    location: "Meet at the center circle",
    image: {
      src: "volunteers.webp",
      alt: "Volunteers cleaning Chimborazo Park",
      width: 1600,
      height: 1041,
    },
  },
  {
    id: 4,
    title: "Spring Clean-up 2025",
    slug: "spring-cleanup-2025",
    description:
      "Kick off spring by joining fellow Church Hill neighbors to refresh and ready our beloved park for the season. Coffee and refreshments provided.",
    date: "2024-04-26",
    time: "9am - 1pm",
    location: "Meet at the round house",
    image: {
      src: "volunteers.webp",
      alt: "Volunteers cleaning Chimborazo Park",
      width: 1600,
      height: 1041,
    },
  },
  {
    id: 5,
    title: "All About Trees Presentation",
    slug: "all-about-trees-presentation",
    description:
      "Discover how climate change impacts our urban trees with author Mike Tidwell and Richmond experts discussing solutions from heat island mitigation to the city's new Urban Forestry Master Plan. Co-sponsored by Chimborazo Park Conservancy and Church Hill Association.",
    date: "2025-10-01",
    time: "7pm - 9pm",
    location: "Perish Hall, St. John's Church",
    image: {
      src: "oaks.webp",
      alt: "Oak trees in Chimborazo Park",
      width: 1200,
      height: 1600,
    },
  },
  {
    id: 6,
    title: "Chimborazo Park Community Tree Planting ",
    slug: "chimborazo-park-community-tree-planting",
    description:
      "Join the Chesapeake Bay Foundation for a community tree planting in Chimborazo Park. This event is part of Richmond Tree Week.",
    date: "2025-11-8",
    time: "9am - 1pm",
    location: "Chimborazo Park",
    image: {
      src: "tree_planting_plan.webp",
      alt: "2025 Tree Planting Plan for Chimborazo Park",
      width: 1600,
      height: 1041,
    },
  },
];
