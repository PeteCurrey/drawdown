"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="my-16 space-y-4 pt-12 border-t border-[#E5E5E5]">
      <h4 className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.2em] mb-6 block font-bold">
        // FREQUENTLY ASKED QUESTIONS
      </h4>
      <div className="border border-[#E5E5E5] divide-y divide-[#E5E5E5] rounded-none overflow-hidden">
        {faqs.map((faq, index) => (
          <details 
            key={index} 
            className="group [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer bg-white hover:bg-neutral-50/50 transition-colors list-none">
              <span className="font-sans text-xs sm:text-sm font-bold uppercase text-mkt-ink tracking-tight">
                {faq.question}
              </span>
              <span className="shrink-0 ml-4 p-1 text-neutral-400 group-open:rotate-180 transition-transform duration-200">
                <ChevronDown className="w-4 h-4" />
              </span>
            </summary>
            <div className="p-5 bg-[#FAF9F6]/40 border-t border-[#E5E5E5]">
              <p className="font-sans text-xs sm:text-sm text-mkt-i2 leading-relaxed whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
