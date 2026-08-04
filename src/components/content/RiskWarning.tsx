'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskWarningProps {
  message?: string;
  title?: string;
  warning?: string;
}

export const RiskWarning: React.FC<RiskWarningProps> = ({ 
  message = "Trading involves substantial risk of loss. Past performance is not indicative of future results. Never trade with money you cannot afford to lose.",
  title,
  warning
}) => {
  const content = warning || message;

  return (
    <div 
      className="my-6 border-l-4 p-5 flex gap-4 items-start"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", borderLeftColor: "var(--risk-amber)" }}
    >
      <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--risk-amber)" }} />
      <div className="space-y-1">
        {title && (
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] font-bold block" style={{ color: "var(--risk-amber)" }}>
            {title}
          </span>
        )}
        <p className="font-sans text-[13px] leading-relaxed" style={{ color: "var(--ink-950)" }}>
          {content}
        </p>
      </div>
    </div>
  );
};

