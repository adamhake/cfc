interface DonutSegment {
  label: string
  percent: number
  count: number
  color: string
}

interface DonutChartProps {
  title: string
  subtitle?: string
  data: DonutSegment[]
  centerLabel?: string
}

const RADIUS = 15.915
const CIRCUMFERENCE = 2 * Math.PI * RADIUS // ~100

export function DonutChart({ title, subtitle, data, centerLabel }: DonutChartProps) {
  const visibleData = data.filter((d) => d.percent > 0)

  let cumulativePercent = 0
  const segments = visibleData.map((segment) => {
    const offset = CIRCUMFERENCE - (cumulativePercent / 100) * CIRCUMFERENCE
    const dashLength = (segment.percent / 100) * CIRCUMFERENCE
    cumulativePercent += segment.percent
    return { ...segment, offset, dashLength }
  })

  const titleId = `donut-title-${title.replace(/\s+/g, "-").toLowerCase()}`
  const subtitleId = `donut-subtitle-${title.replace(/\s+/g, "-").toLowerCase()}`
  const descId = `donut-desc-${title.replace(/\s+/g, "-").toLowerCase()}`
  const dataDescription = visibleData
    .map((d) => `${d.label}: ${d.percent}% (${d.count})`)
    .join(", ")

  return (
    <div>
      <h3
        id={titleId}
        className="font-display text-xl text-grey-900 md:text-2xl dark:text-grey-100"
      >
        {title}
      </h3>
      {subtitle && (
        <p id={subtitleId} className="mt-1 font-body text-sm text-grey-500 dark:text-grey-400">
          {subtitle}
        </p>
      )}
      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
        <div
          className="relative w-48 shrink-0 sm:w-56"
          role="img"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <svg viewBox="0 0 36 36" className="-rotate-90">
            <title>{title}</title>
            <desc id={descId}>{dataDescription}</desc>
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r={RADIUS}
              fill="none"
              className="stroke-grey-100 dark:stroke-grey-800"
              strokeWidth="3.5"
            />
            {/* Data segments */}
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="18"
                cy="18"
                r={RADIUS}
                fill="none"
                stroke={segment.color}
                strokeWidth="3.5"
                strokeDasharray={`${segment.dashLength} ${CIRCUMFERENCE - segment.dashLength}`}
                strokeDashoffset={segment.offset}
                strokeLinecap="butt"
              >
                <title>
                  {segment.label}: {segment.percent}%
                </title>
              </circle>
            ))}
          </svg>
          {centerLabel && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-display text-lg text-grey-700 dark:text-grey-300">
                {centerLabel}
              </span>
              <span className="text-xs text-grey-500 dark:text-grey-400">responses</span>
            </div>
          )}
        </div>
        <ul className="space-y-2" aria-label={`${title} legend`}>
          {visibleData.map((segment) => (
            <li key={segment.label} className="flex items-start gap-2">
              <span
                className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="font-body text-sm text-grey-700 dark:text-grey-300">
                <span className="font-medium">{segment.percent}%</span> {segment.label}
                <span className="ml-1 text-grey-400 dark:text-grey-500">({segment.count})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
