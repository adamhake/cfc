import { JsonLd } from "@/components/JsonLd/json-ld";
import SectionHeader from "@/components/SectionHeader/section-header";
import { generateFAQStructuredData } from "@/utils/seo";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
}

export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const structuredData = generateFAQStructuredData(faqs);

  return (
    <div className={className}>
      <JsonLd data={structuredData} />
      <SectionHeader title={title} size="large" />
      <div className="mt-8 space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-button-${index}`;
          const panelId = `faq-panel-${index}`;
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-grey-200 bg-white dark:border-primary-700 dark:bg-primary-950"
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-grey-50 dark:hover:bg-primary-900"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <h3 className="font-display text-base font-semibold text-grey-900 md:text-lg dark:text-grey-100">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 stroke-grey-500 transition-transform duration-200 dark:stroke-grey-400 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="border-t border-grey-100 px-6 py-5 dark:border-primary-800"
                >
                  <p className="font-body leading-relaxed text-grey-700 dark:text-grey-300">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
