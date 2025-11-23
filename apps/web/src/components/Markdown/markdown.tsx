import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="mt-12 mb-6 font-display text-4xl font-bold text-grey-900 first:mt-0 md:text-5xl dark:text-grey-100">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-10 mb-4 font-display text-3xl font-semibold text-primary-900 first:mt-0 md:text-4xl dark:text-primary-200">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 mb-3 font-display text-2xl font-semibold text-grey-900 first:mt-0 md:text-3xl dark:text-grey-100">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-6 mb-3 font-display text-xl font-semibold text-grey-900 first:mt-0 md:text-2xl dark:text-grey-100">
            {children}
          </h4>
        ),
        h5: ({ children }) => (
          <h5 className="mt-6 mb-2 font-display text-lg font-semibold text-grey-900 first:mt-0 md:text-xl dark:text-grey-100">
            {children}
          </h5>
        ),
        h6: ({ children }) => (
          <h6 className="mt-6 mb-2 font-display text-base font-semibold text-grey-900 first:mt-0 md:text-lg dark:text-grey-100">
            {children}
          </h6>
        ),
        p: ({ children }) => (
          <p className="mb-6 font-body text-base leading-relaxed text-grey-800 md:text-lg dark:text-grey-200">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-6 ml-4 list-disc space-y-3 font-body text-base leading-relaxed text-grey-800 marker:text-accent-600 md:text-lg dark:text-grey-200 dark:marker:text-accent-400">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-6 ml-4 list-decimal space-y-3 font-body text-base leading-relaxed text-grey-800 marker:text-accent-600 md:text-lg dark:text-grey-200 dark:marker:text-accent-400">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-2">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-grey-900 dark:text-grey-100">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-grey-900 italic dark:text-grey-100">{children}</em>
        ),
        a: ({ children, href }) => {
          const isExternal = href?.startsWith("http");
          return (
            <a
              href={href}
              className="inline-flex items-center gap-1 font-medium text-accent-700 underline decoration-accent-500/30 underline-offset-2 transition-all hover:text-accent-800 hover:decoration-accent-600 active:opacity-70 dark:text-accent-400 dark:decoration-accent-400/30 dark:hover:text-accent-300 dark:hover:decoration-accent-400"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              aria-label={isExternal ? `${children} (opens in new window)` : undefined}
            >
              {children}
              {isExternal && <ExternalLink className="inline h-4 w-4" aria-hidden="true" />}
            </a>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="my-8 rounded-r-2xl border-l-4 border-accent-600 bg-accent-50/50 py-4 pr-6 pl-6 font-body text-base leading-relaxed text-grey-800 md:text-lg dark:border-accent-500 dark:bg-accent-900/20 dark:text-grey-200">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded-md bg-primary-100 px-2 py-1 font-mono text-sm text-primary-900 dark:bg-primary-800 dark:text-primary-100">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="my-6 overflow-x-auto rounded-2xl border border-grey-200 bg-grey-50 p-6 dark:border-grey-700 dark:bg-grey-800">
            {children}
          </pre>
        ),
        hr: () => <hr className="my-12 border-0 border-t border-grey-200 dark:border-grey-700" />,
        table: ({ children }) => (
          <div className="my-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-grey-200 rounded-2xl border border-grey-200 dark:divide-grey-700 dark:border-grey-700">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-primary-50 dark:bg-primary-900/30">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="divide-y divide-grey-200 bg-white dark:divide-grey-700 dark:bg-grey-800">
            {children}
          </tbody>
        ),
        tr: ({ children }) => <tr>{children}</tr>,
        th: ({ children }) => (
          <th className="px-6 py-3 text-left font-display text-sm font-semibold text-grey-900 dark:text-grey-100">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 font-body text-sm text-grey-800 dark:text-grey-200">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
