'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RiskWarningProps {
  message?: string;
}

export const RiskWarning: React.FC<RiskWarningProps> = ({ 
  message = "Trading involves substantial risk of loss. Past performance is not indicative of future results. Never trade with money you cannot afford to lose." 
}) => {
  return (
    <div className="my-6 border-l-2 border-warning bg-warning/5 px-4 py-3 flex gap-3 items-center">
      <AlertTriangle size={16} className="text-warning shrink-0" />
      <p className="font-sans text-[11px] md:text-xs text-warning/80 leading-snug uppercase tracking-wide">
        {message}
      </p>
    </div>
  );
};
