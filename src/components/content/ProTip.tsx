'use client';

import React from 'react';
import { Brain } from 'lucide-react';

interface ProTipProps {
  tip: string;
}

export const ProTip: React.FC<ProTipProps> = ({ tip }) => {
  return (
    <div 
      className="my-8 p-6 md:p-8 border border-l-4 transition-all duration-300 hover:shadow-sm"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderLeftColor: "var(--signal-navy)" }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 border shrink-0" style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
          <Brain size={18} />
        </div>
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] font-semibold mb-2 block" style={{ color: "var(--signal-navy)" }}>
            Pete&apos;s Pro Tip
          </span>
          <p className="font-sans text-base md:text-lg italic leading-relaxed" style={{ color: "var(--ink-950)" }}>
            &quot;{tip}&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

