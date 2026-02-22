import { FileAttachment } from "@/components/FileAttachment/file-attachment";
import { SanityImage } from "@/components/SanityImage";
import type { PortableTextBlock, PortableTextComponents } from "@portabletext/react";
import { PortableText as BasePortableText } from "@portabletext/react";

// Custom components for rendering portable text blocks
const components: PortableTextComponents = {
  block: {
    // Paragraphs
    normal: ({ children }) => (
      <p className="mb-4 font-body leading-relaxed text-grey-800 dark:text-grey-200">{children}</p>
    ),

    // Leading paragraph (slightly larger text)
    leading: ({ children }) => (
      <p className="mb-4 font-body text-base leading-relaxed text-grey-800 md:text-lg dark:text-grey-200">
        {children}
      </p>
    ),

    // Leading large paragraph (larger intro text)
    "leading-lg": ({ children }) => (
      <p className="mb-4 font-body text-xl leading-relaxed text-grey-800 md:text-2xl dark:text-grey-200">
        {children}
      </p>
    ),

    // Headings
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 font-display text-3xl font-bold text-primary-800 dark:text-primary-400">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 font-display text-2xl font-bold text-primary-700 dark:text-primary-400">
        {children}
      </h3>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary-600 bg-primary-50 py-4 pr-4 pl-6 font-body text-primary-900 italic dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-100">
        {children}
      </blockquote>
    ),
  },

  list: {
    // Bullet lists
    bullet: ({ children }) => (
      <ul className="mb-4 ml-4 list-disc space-y-2 font-body text-grey-800 dark:text-grey-200">
        {children}
      </ul>
    ),

    // Numbered lists
    number: ({ children }) => (
      <ol className="mb-4 ml-4 list-decimal space-y-2 font-body text-grey-800 dark:text-grey-200">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },

  marks: {
    // Bold
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,

    // Italic
    em: ({ children }) => <em className="italic">{children}</em>,

    // Links
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="font-body text-primary-700 underline decoration-primary-300 underline-offset-2 transition-colors hover:text-primary-600 hover:decoration-primary-500 dark:text-primary-400 dark:decoration-primary-600 dark:hover:text-primary-300"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    // Embedded images in portable text
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-8">
          <SanityImage
            image={value}
            alt={value.alt || ""}
            className="mx-auto rounded-lg shadow-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            maxWidth={1200}
            fit="max"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center font-body text-sm text-grey-600 italic dark:text-grey-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },

    // File attachments in portable text
    fileAttachment: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <FileAttachment asset={value.asset} title={value.title} description={value.description} />
      );
    },
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
  className?: string;
}

export function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className={`prose max-w-none dark:prose-invert ${className}`}>
      <BasePortableText value={value} components={components} />
    </div>
  );
}
