"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQItem[];
  isDark?: boolean;
}

export function FaqAccordion({ faqs, isDark = false }: FaqAccordionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={cn(
      "my-16 space-y-4 pt-12 border-t",
      isDark ? "border-[#1A1A1A]" : "border-[#E5E5E5]"
    )}>
      <h4 className={cn(
        "font-mono text-[10px] uppercase tracking-[0.2em] mb-6 block font-bold",
        isDark ? "text-zinc-500" : "text-text-tertiary"
      )}>
        // FREQUENTLY ASKED QUESTIONS
      </h4>
      <div className={cn(
        "border divide-y rounded-none overflow-hidden",
        isDark ? "border-[#1A1A1A] divide-[#1A1A1A]" : "border-[#E5E5E5] divide-[#E5E5E5]"
      )}>
        {faqs.map((faq, index) => (
          <details 
            key={index} 
            className="group [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className={cn(
              "flex items-center justify-between p-5 cursor-pointer transition-colors list-none",
              isDark ? "bg-[#111111] hover:bg-[#1A1A1A]" : "bg-white hover:bg-neutral-50/50"
            )}>
              <span className={cn(
                "font-sans text-xs sm:text-sm font-bold uppercase tracking-tight",
                isDark ? "text-white" : "text-mkt-ink"
              )}>
                {faq.question}
              </span>
              <span className={cn(
                "shrink-0 ml-4 p-1 group-open:rotate-180 transition-transform duration-200",
                isDark ? "text-[#C8F135]" : "text-neutral-400"
              )}>
                <ChevronDown className="w-4 h-4" />
              </span>
            </summary>
            <div className={cn(
              "p-5 border-t",
              isDark ? "bg-[#0D0D0D] border-[#1A1A1A]" : "bg-[#FAF9F6]/40 border-[#E5E5E5]"
            )}>
              <p className={cn(
                "font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line",
                isDark ? "text-zinc-300" : "text-mkt-i2"
              )}>
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
