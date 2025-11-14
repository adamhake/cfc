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
          <h1 className="mt-8 mb-4 font-display text-3xl text-grey-900 dark:text-grey-100">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 mb-4 font-display text-2xl text-grey-900 dark:text-grey-100">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-8 mb-4 font-display text-xl text-grey-900 dark:text-grey-100">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-4 text-lg leading-normal text-grey-800 dark:text-grey-200">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-grey-800 dark:text-grey-200">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 ml-6 list-decimal space-y-2 text-lg text-grey-800 dark:text-grey-200">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-normal">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-grey-900 dark:text-grey-100">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => {
          const isExternal = href?.startsWith("http");
          return (
            <a
              href={href}
              className="inline-flex items-center gap-1 text-primary-700 underline transition-opacity hover:text-primary-800 active:opacity-70 dark:text-primary-400 dark:hover:text-primary-300"
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
          <blockquote className="my-6 border-l-4 border-primary-600 pl-4 text-grey-700 italic dark:border-primary-500 dark:text-grey-300">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded bg-grey-100 px-1.5 py-0.5 font-mono text-sm text-grey-900 dark:bg-grey-800 dark:text-grey-100">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-grey-100 p-4 dark:bg-grey-800">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
