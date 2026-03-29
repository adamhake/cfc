interface SplitOption {
  label: string
  percent: number
  count: number
}

interface SplitBarProps {
  title: string
  subtitle?: string
  options: [SplitOption, SplitOption]
}

export function SplitBar({ title, subtitle, options }: SplitBarProps) {
  const [primary, secondary] = options

  return (
    <div>
      <h3 className="font-display text-xl text-grey-900 md:text-2xl dark:text-grey-100">{title}</h3>
      {subtitle && (
        <p className="mt-1 font-body text-sm text-grey-500 dark:text-grey-400">{subtitle}</p>
      )}
      <div className="mt-4 space-y-3">
        {/* Stacked bar */}
        <div
          className="flex h-8 overflow-hidden rounded-full"
          role="img"
          aria-label={`${primary.label}: ${primary.percent}%, ${secondary.label}: ${secondary.percent}%`}
        >
          <div
            className="flex min-w-12 items-center justify-center bg-primary-600 dark:bg-primary-500"
            style={{ width: `${primary.percent}%` }}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-body text-xs font-semibold text-white">
              {primary.percent}%
            </span>
          </div>
          <div
            className="flex min-w-12 items-center justify-center bg-accent-700 dark:bg-accent-500"
            style={{ width: `${secondary.percent}%` }}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-body text-xs font-semibold text-white">
              {secondary.percent}%
            </span>
          </div>
        </div>
        {/* Labels */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-start gap-2">
            <span
              className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full bg-primary-600 dark:bg-primary-500"
              aria-hidden="true"
            />
            <span className="font-body text-sm text-grey-700 dark:text-grey-300">
              <span className="font-medium">{primary.percent}%</span> {primary.label}
              <span className="ml-1 text-grey-400 dark:text-grey-500">({primary.count})</span>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span
              className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full bg-accent-700 dark:bg-accent-500"
              aria-hidden="true"
            />
            <span className="font-body text-sm text-grey-700 dark:text-grey-300">
              <span className="font-medium">{secondary.percent}%</span> {secondary.label}
              <span className="ml-1 text-grey-400 dark:text-grey-500">({secondary.count})</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
