'use client';

import React from 'react';

interface TradeExampleProps {
  title: string;
  instrument: string;
  session: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  accountSize?: string;
  riskPercent?: string;
  positionSize?: string;
  result: string;
  isProfit?: boolean;
}

export const TradeExample: React.FC<TradeExampleProps> = ({
  title,
  instrument,
  session,
  entry,
  stopLoss,
  takeProfit,
  riskReward,
  accountSize,
  riskPercent,
  positionSize,
  result,
  isProfit = true
}) => {
  return (
    <div 
      className="my-10 border overflow-hidden transition-all duration-300"
      style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}
    >
      <div 
        className="px-6 py-4 border-b flex justify-between items-center"
        style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}
      >
        <h4 className="font-display text-base uppercase tracking-[0.08em] font-semibold m-0" style={{ color: "var(--ink-950)" }}>
          Execution Example: {title}
        </h4>
        <span 
          className="font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 border font-bold"
          style={{ 
            backgroundColor: isProfit ? "var(--paper-100)" : "var(--paper-100)", 
            borderColor: "var(--line-200)", 
            color: isProfit ? "var(--signal-navy)" : "var(--risk-amber)" 
          }}
        >
          {isProfit ? 'WIN' : 'LOSS'}
        </span>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
        {/* Left: Setup */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2 text-[13px]" style={{ borderColor: "var(--line-200)" }}>
            <span style={{ color: "var(--graphite-600)" }}>Instrument</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink-950)" }}>{instrument}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 text-[13px]" style={{ borderColor: "var(--line-200)" }}>
            <span style={{ color: "var(--graphite-600)" }}>Session</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink-950)" }}>{session}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 text-[13px]" style={{ borderColor: "var(--line-200)" }}>
            <span style={{ color: "var(--graphite-600)" }}>Entry Price</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink-950)" }}>{entry}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 text-[13px]" style={{ borderColor: "var(--line-200)" }}>
            <span style={{ color: "var(--graphite-600)" }}>Stop Loss</span>
            <span className="font-mono font-bold" style={{ color: "var(--risk-amber)" }}>{stopLoss}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 text-[13px]" style={{ borderColor: "var(--line-200)" }}>
            <span style={{ color: "var(--graphite-600)" }}>Take Profit</span>
            <span className="font-mono font-bold" style={{ color: "var(--signal-navy)" }}>{takeProfit}</span>
          </div>
        </div>

        {/* Right: Numbers */}
        <div className="p-5 border space-y-3" style={{ backgroundColor: "var(--paper-0)", borderColor: "var(--line-200)" }}>
          <div className="flex justify-between items-center text-[13px]">
            <span style={{ color: "var(--graphite-600)" }}>Risk:Reward</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink-950)" }}>{riskReward}</span>
          </div>
          {accountSize && (
            <div className="flex justify-between items-center text-[13px]">
              <span style={{ color: "var(--graphite-600)" }}>Account Size</span>
              <span className="font-mono font-bold" style={{ color: "var(--ink-950)" }}>{accountSize}</span>
            </div>
          )}
          {riskPercent && (
            <div className="flex justify-between items-center text-[13px]">
              <span style={{ color: "var(--graphite-600)" }}>Risk %</span>
              <span className="font-mono font-bold" style={{ color: "var(--risk-amber)" }}>{riskPercent}</span>
            </div>
          )}
          {positionSize && (
            <div className="flex justify-between items-center text-[13px]">
              <span style={{ color: "var(--graphite-600)" }}>Position Size</span>
              <span className="font-mono font-bold" style={{ color: "var(--signal-navy)" }}>{positionSize}</span>
            </div>
          )}
          <div className="pt-3 mt-2 border-t flex justify-between items-center" style={{ borderColor: "var(--line-200)" }}>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] font-bold" style={{ color: "var(--ink-950)" }}>
              Net Trade Result
            </span>
            <span 
              className="font-mono font-bold text-base"
              style={{ color: isProfit ? "var(--signal-navy)" : "var(--risk-amber)" }}
            >
              {result}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

