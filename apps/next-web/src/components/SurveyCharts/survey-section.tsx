interface SurveySectionProps {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}

export function SurveySection({ id, title, description, children }: SurveySectionProps) {
  const headingId = `section-${id}`

  return (
    <section id={id} className="space-y-8" aria-labelledby={headingId}>
      <div>
        <h2
          id={headingId}
          className="font-display text-2xl text-grey-900 md:text-3xl dark:text-grey-100"
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
