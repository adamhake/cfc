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
          <h1 className="mb-6 mt-10 font-display text-3xl text-grey-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-4 mt-10 font-display text-2xl text-grey-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-3 mt-8 font-display text-xl text-grey-900">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 text-lg leading-normal text-grey-800">{children}</p>,
        ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-grey-800">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2 text-lg text-grey-800">{children}</ol>,
        li: ({ children }) => <li className="leading-normal">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-grey-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-green-700 underline hover:text-green-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-green-600 pl-4 italic text-grey-700">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="rounded bg-grey-100 px-1.5 py-0.5 font-mono text-sm text-grey-900">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-grey-100 p-4">
            {children}
          </pre>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
