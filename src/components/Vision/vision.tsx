import { BookOpenText, HeartHandshake, LeafyGreen, Trees } from "lucide-react";

interface VisionProps {
  title: string;
  icon: "leafy-green" | "trees" | "heart-handshake" | "book-open-text";
  description: string;
  contentPosition?: "left" | "right";
  image?: {
    src: string;
    alt: string;
  };
}

function getIcon(icon: string) {
  switch (icon) {
    case "leafy-green":
      return (
        <LeafyGreen className="h-8 w-8 stroke-green-700 md:h-10 md:w-10 dark:stroke-green-400" />
      );
    case "trees":
      return <Trees className="h-8 w-8 stroke-green-700 md:h-10 md:w-10 dark:stroke-green-400" />;
    case "heart-handshake":
      return (
        <HeartHandshake className="h-8 w-8 stroke-green-700 md:h-10 md:w-10 dark:stroke-green-400" />
      );
    case "book-open-text":
      return (
        <BookOpenText className="h-8 w-8 stroke-green-700 md:h-10 md:w-10 dark:stroke-green-400" />
      );
    default:
      return null;
  }
}
export default function Vision({ title, icon, description }: VisionProps) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-grey-200 bg-grey-50 p-8 font-body font-medium lg:p-10 dark:border-green-600 dark:bg-green-900">
      {getIcon(icon)}
      <h3 className="mt-2 mb-6 font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100">
        {title}
      </h3>
      <p className="text-grey-800 md:text-lg dark:text-grey-200">{description}</p>
    </div>
  );
}
