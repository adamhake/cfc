export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Chimbo Park Conservancy",
    description:
      "Chimbo Park Conservancy is a non-profit organization dedicated to preserving and enhancing the beauty of Chimbo Park.",
    date: "2022-01-01",
    location: "Chimbo Park",
    image: "chimbo-park-conservancy.jpg",
  },
  {
    id: 2,
    title: "Chimbo Park Conservancy",
    description:
      "Chimbo Park Conservancy is a non-profit organization dedicated to preserving and enhancing the beauty of Chimbo Park.",
    date: "2022-01-01",
    location: "Chimbo Park",
    image: "chimbo-park-conservancy.jpg",
  },
];
