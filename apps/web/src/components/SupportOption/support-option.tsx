interface SupportOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function SupportOption({ title, description, icon }: SupportOptionProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-accent-600/20 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-accent-500/20 dark:bg-primary-900">
      {/* Icon with circular background */}
      <div
        className="relative mb-4 inline-flex rounded-full bg-accent-600/10 p-3 dark:bg-accent-500/10"
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
