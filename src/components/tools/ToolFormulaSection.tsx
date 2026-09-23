import React from "react";
import Link from "next/link";
import { ArrowRight, Table2, ShieldAlert, BookOpen, AlertTriangle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export interface VariableSpec {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface WorkedExampleItem {
  title?: string;
  scenario: string;
  steps: { label: string; formula?: string; value: string }[];
  conclusion?: string;
}

export interface RelatedLinkItem {
  label: string;
  href: string;
  description?: string;
}

interface ToolFormulaSectionProps {
  title: string;
  description: string;
  formulaLatex: string;
  steps: string[];
  variables?: VariableSpec[];
  workedExample?: WorkedExampleItem;
  assumptions?: string[];
  limitations?: string[];
  relatedLinks?: RelatedLinkItem[];
  faqs?: FAQItem[];
}

export function ToolFormulaSection({
  title,
  description,
  formulaLatex,
  steps,
  variables,
  workedExample,
  assumptions,
  limitations,
  relatedLinks,
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

        {/* Variable Specification Table */}
        {variables && variables.length > 0 && (
          <div className="space-y-3 pt-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Table2 className="w-3.5 h-3.5 text-[var(--accent)]" />
              Variable Definitions &amp; Units:
            </h3>
            <div className="overflow-x-auto border border-[var(--border-subtle)] rounded-md">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/5 font-mono text-[var(--text-tertiary)] uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-[var(--border-subtle)]">Symbol</th>
                    <th className="p-2.5 border-b border-[var(--border-subtle)]">Parameter</th>
                    <th className="p-2.5 border-b border-[var(--border-subtle)]">Unit</th>
                    <th className="p-2.5 border-b border-[var(--border-subtle)]">Definition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] font-sans">
                  {variables.map((v, i) => (
                    <tr key={i} className="hover:bg-black/[0.02]">
                      <td className="p-2.5 font-mono font-semibold text-[var(--accent)]">{v.symbol}</td>
                      <td className="p-2.5 font-medium text-[var(--text-primary)]">{v.name}</td>
                      <td className="p-2.5 font-mono text-[var(--text-tertiary)]">{v.unit}</td>
                      <td className="p-2.5 text-[var(--text-secondary)]">{v.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        {/* Worked Example */}
        {workedExample && (
          <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
              {workedExample.title || "Step-by-Step Worked Example"}
            </h3>
            <p className="text-xs font-sans text-[var(--text-secondary)] leading-relaxed">
              {workedExample.scenario}
            </p>
            <div className="p-4 bg-[var(--surface-raised)] border border-[var(--border-subtle)] rounded-md space-y-2 font-mono text-xs">
              {workedExample.steps.map((s, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-1 border-b border-black/5 last:border-0 gap-1">
                  <span className="text-[var(--text-secondary)]">{s.label}:</span>
                  <div className="flex items-center gap-2 text-right">
                    {s.formula && <span className="text-[var(--text-tertiary)] text-[11px]">{s.formula} =</span>}
                    <span className="font-semibold text-[var(--text-primary)]">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
            {workedExample.conclusion && (
              <p className="text-xs font-sans text-[var(--text-secondary)] italic leading-relaxed">
                {workedExample.conclusion}
              </p>
            )}
          </div>
        )}

        {/* Assumptions & Limitations Grid */}
        {((assumptions && assumptions.length > 0) || (limitations && limitations.length > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
            {assumptions && assumptions.length > 0 && (
              <div className="p-4 border border-[var(--border-subtle)] rounded-md bg-[var(--surface-raised)] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  Underlying Assumptions
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {limitations && limitations.length > 0 && (
              <div className="p-4 border border-[var(--border-subtle)] rounded-md bg-[var(--surface-raised)] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Practical Limitations
                </h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                  {limitations.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Related Research & Quantitative Models */}
        {relatedLinks && relatedLinks.length > 0 && (
          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[var(--text-primary)]">
              Related Research &amp; Risk Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {relatedLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-md bg-[var(--surface-raised)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition group"
                >
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block">{link.label}</span>
                    {link.description && (
                      <span className="text-[11px] text-[var(--text-tertiary)]">{link.description}</span>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--accent)] group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        )}
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
