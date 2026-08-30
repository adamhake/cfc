import type { PortableTextBlock } from "@portabletext/react"
import { PortableText } from "@/components/PortableText/portable-text"

interface PageIntroductionProps {
  content?: unknown[] | null
  fallback: readonly [string, ...string[]]
}

const leadClasses =
  "font-body text-xl leading-snug font-medium text-grey-800 md:text-2xl dark:text-grey-100"

export function PageIntroduction({ content, fallback }: PageIntroductionProps) {
  return (
    <div className="max-w-4xl">
      {content && content.length > 0 ? (
        <PortableText
          value={content as PortableTextBlock[]}
          className="[&>p]:text-grey-800 [&>p:first-child]:text-xl [&>p:first-child]:leading-snug [&>p:first-child]:font-medium md:[&>p]:text-lg md:[&>p:first-child]:text-2xl dark:[&>p]:text-grey-100"
        />
      ) : (
        <div className="space-y-4">
          <p className={leadClasses}>{fallback[0]}</p>
          {fallback.slice(1).map((paragraph) => (
            <p key={paragraph} className="font-body text-grey-800 md:text-lg dark:text-grey-100">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
