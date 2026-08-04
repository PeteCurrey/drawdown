'use client';

import React from 'react';

interface StatCalloutProps {
  stat: string;
  context: string;
  source?: string;
}

export const StatCallout: React.FC<StatCalloutProps> = ({ stat, context, source }) => {
  return (
    <div 
      className="my-8 relative overflow-hidden p-6 md:p-8 border-l-4 transition-all duration-300 hover:shadow-sm"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderLeftColor: "var(--signal-navy)" }}
    >
      <div className="flex flex-col gap-2">
        <span className="font-display text-4xl md:text-5xl font-semibold tracking-tight" style={{ color: "var(--ink-950)" }}>
          {stat}
        </span>
        <p className="font-sans text-sm md:text-base max-w-lg leading-relaxed" style={{ color: "var(--graphite-600)" }}>
          {context}
        </p>
        {source && (
          <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
            Source: {source}
          </span>
        )}
      </div>
    </div>
  );
};

