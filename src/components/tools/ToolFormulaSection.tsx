import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface ToolFormulaSectionProps {
  title: string;
  description: string;
  formulaLatex: string;
  steps: string[];
  faqs?: FAQItem[];
}

export function ToolFormulaSection({
  title,
  description,
  formulaLatex,
  steps,
  faqs = [],
}: ToolFormulaSectionProps) {
  return (
    <article className="mt-14 pt-10 border-t border-[var(--border-subtle)] space-y-10">
      {/* Mathematical Theory */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] block">
          Methodology &amp; Mathematical Specification
        </span>
        <h2 className="text-2xl font-display font-medium text-[var(--text-primary)]">
          {title}
        </h2>
        <p className="text-sm font-sans text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>

        {/* Formula Box */}
        <div 
          className="p-5 border border-black/5 font-mono text-xs my-4 bg-[var(--surface-raised)]"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <div className="text-[10px] uppercase text-[var(--text-tertiary)] tracking-wider mb-2">
            Governing Equation:
          </div>
          <div className="text-sm md:text-base font-semibold text-[var(--accent)] overflow-x-auto py-1">
            {formulaLatex}
          </div>
        </div>

        {/* Breakdown Steps */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            How The Calculation Works:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs font-sans text-[var(--text-secondary)] leading-relaxed pl-1">
            {steps.map((step, idx) => (
              <li key={idx} className="pl-1">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      {faqs.length > 0 && (
        <div className="space-y-4 max-w-3xl pt-6 border-t border-[var(--border-subtle)]">
          <h3 className="text-xl font-display font-medium text-[var(--text-primary)]">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 border border-[var(--border-subtle)] bg-[var(--surface-raised)] rounded-md space-y-2"
              >
                <h4 className="text-sm font-sans font-semibold text-[var(--text-primary)]">
                  {faq.question}
                </h4>
                <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
