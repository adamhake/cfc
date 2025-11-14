interface SupportOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SupportOption({ title, description, icon }: SupportOptionProps) {
  return (
    <div className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-accent-600/20 bg-gradient-to-br from-grey-50 to-grey-50/80 p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-accent-500/20 dark:from-primary-900 dark:to-primary-900/80">
      {/* Subtle accent gradient overlay on hover */}
      <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-accent-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-accent-500/10"></div>

      {/* Icon with circular background */}
      <div
        className="relative shrink-0 rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10"
        role="img"
        aria-label={`${title} icon`}
      >
        {icon}
      </div>
      <div className="relative">
        <h3 className="mb-2 font-display text-xl text-grey-900 dark:text-grey-100">{title}</h3>
        <p className="font-body leading-relaxed text-grey-700 dark:text-grey-300">{description}</p>
      </div>
    </div>
  );
}
