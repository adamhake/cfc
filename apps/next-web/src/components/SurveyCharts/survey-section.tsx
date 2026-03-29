interface SurveySectionProps {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}

export function SurveySection({ id, title, description, children }: SurveySectionProps) {
  const headingId = `section-${id}`

  return (
    <section
      id={id}
      className="space-y-8 border-t border-primary-200/60 pt-16 first:border-t-0 first:pt-0 dark:border-primary-800/40"
      aria-labelledby={headingId}
    >
      <div>
        <h2
          id={headingId}
          className="font-display text-2xl text-primary-800 md:text-3xl lg:text-4xl dark:text-primary-400"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-3xl font-body text-grey-600 md:text-lg dark:text-grey-400">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-12">{children}</div>
    </section>
  )
}
