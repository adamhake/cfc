interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

export default function InfoCard({ icon, title, content }: InfoCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border-2 border-grey-200 bg-white p-6 dark:border-primary-600 dark:bg-primary-800">
      <div
        className="shrink-0 rounded-lg bg-primary-100 p-3 dark:bg-primary-700"
        role="img"
        aria-label={`${title} icon`}
      >
        {icon}
      </div>
      <div>
        <h3 className="mb-1 font-display text-xl text-grey-900 dark:text-grey-100">{title}</h3>
        <p className="font-body text-grey-800 dark:text-grey-200">{content}</p>
      </div>
    </div>
  );
}
