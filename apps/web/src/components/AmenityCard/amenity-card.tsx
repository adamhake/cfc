interface AmenityCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  details?: string[];
  link?: {
    text: string;
    url: string;
  };
  image?: {
    src: string;
    alt: string;
  };
}

export default function AmenityCard({
  title,
  icon,
  description,
  details,
  link,
  image,
}: AmenityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-accent-600/20 bg-gradient-to-br from-grey-50 to-grey-50/80 shadow-sm transition-all duration-300 hover:shadow-md dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80">
      {/* Subtle accent gradient overlay on hover */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-accent-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-accent-500/10"></div>

      {image && (
        <div className="relative h-48 w-full overflow-hidden bg-grey-200 dark:bg-primary-700">
          {/* Image placeholder - replace with actual images */}
          <div className="flex h-full items-center justify-center text-grey-400 dark:text-primary-500">
            <span className="font-body text-sm">Image: {image.alt}</span>
          </div>
        </div>
      )}
      <div className="relative p-6 lg:p-8">
        <div className="mb-4 flex items-center gap-3">
          {/* Icon with circular background */}
          <div
            className="inline-flex rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10"
            role="img"
            aria-label={`${title} icon`}
          >
            {icon}
          </div>
          <h3 className="font-display text-2xl text-grey-900 dark:text-grey-100">{title}</h3>
        </div>
        <p className="mb-4 font-body text-base leading-relaxed text-grey-700 md:text-lg dark:text-grey-300">
          {description}
        </p>
        {details && details.length > 0 && (
          <ul className="mb-4 space-y-2 font-body text-grey-700 dark:text-grey-300" role="list">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-600 dark:bg-accent-400"
                  aria-hidden="true"
                ></span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
        {link && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-body font-semibold text-accent-700 transition-colors hover:text-accent-800 focus:ring-2 focus:ring-accent-600 focus:ring-offset-2 focus:outline-none dark:text-accent-400 dark:hover:text-accent-300 dark:focus:ring-accent-500"
          >
            {link.text}
            <span className="ml-1" aria-hidden="true">
              →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
