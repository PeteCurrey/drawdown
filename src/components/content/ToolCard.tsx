'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Wrench } from 'lucide-react';

interface ToolCardProps {
  toolSlug: string;
  toolName: string;
  description: string;
  features: string[];
  tier: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  toolSlug,
  toolName,
  description,
  features,
  tier
}) => {
  return (
    <div 
      className="my-10 p-6 md:p-8 border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md group"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
    >
      <div className="flex justify-between items-start mb-6">
        <div 
          className="p-3 border shrink-0"
          style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}
        >
          <Wrench size={22} />
        </div>
        <span 
          className="font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 border font-bold"
          style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}
        >
          {tier}
        </span>
      </div>
      
      <h4 className="font-display text-xl font-semibold mb-2 uppercase tracking-tight" style={{ color: "var(--ink-950)" }}>
        {toolName}
      </h4>
      <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: "var(--graphite-600)" }}>
        {description}
      </p>
      
      <div className="space-y-2.5 mb-8">
        {features.slice(0, 3).map((feature, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <CheckCircle2 size={15} style={{ color: "var(--signal-navy)" }} className="shrink-0" />
            <span className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
      
      <Link 
        href={`/tools/${toolSlug}`}
        className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.08em] transition-all group-hover:translate-x-1"
        style={{ color: "var(--signal-navy)" }}
      >
        <span>Try This Tool</span>
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

