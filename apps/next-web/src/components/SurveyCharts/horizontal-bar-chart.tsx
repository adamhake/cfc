interface BarItem {
  label: string
  percent: number
  count: number
}

interface HorizontalBarChartProps {
  title: string
  subtitle?: string
  data: BarItem[]
}

export function HorizontalBarChart({ title, subtitle, data }: HorizontalBarChartProps) {
  const titleId = `bar-title-${title.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div>
      <h3 id={titleId} className="font-display text-lg text-grey-900 md:text-xl dark:text-grey-100">
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 font-body text-sm text-grey-500 dark:text-grey-400">{subtitle}</p>
      )}
      <ul className="mt-4 list-none space-y-3" aria-labelledby={titleId}>
        {data.map((item) => (
          <li key={item.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="font-body text-xs text-grey-800 sm:text-sm dark:text-grey-200">
                {item.label}
              </span>
              <span className="shrink-0 font-body text-sm font-medium text-grey-600 dark:text-grey-400">
                {item.percent}%
                <span className="ml-1 text-grey-400 dark:text-grey-500">({item.count})</span>
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-grey-100 dark:bg-grey-800">
              <div
                className="h-full rounded-full bg-primary-600 dark:bg-primary-500"
                style={{ width: `${item.percent}%` }}
                aria-hidden="true"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
