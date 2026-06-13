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
    <div className="my-10 bg-surface border border-border rounded-lg overflow-hidden animate-in zoom-in-95">
      <div className="bg-elevated px-6 py-4 border-b border-border flex justify-between items-center">
        <h4 className="font-sans text-lg uppercase tracking-tight text-white m-0">
          EXAMPLE: {title}
        </h4>
        <span className={`font-mono text-xs px-2 py-1 rounded ${isProfit ? 'bg-profit/10 text-mkt-grn' : 'bg-loss/10 text-red-500'}`}>
          {isProfit ? 'WIN' : 'LOSS'}
        </span>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Setup */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-mkt-i2 text-sm">Instrument</span>
            <span className="font-mono text-white">{instrument}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-mkt-i2 text-sm">Session</span>
            <span className="font-mono text-white">{session}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-mkt-i2 text-sm">Entry Price</span>
            <span className="font-mono text-white">{entry}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-mkt-i2 text-sm">Stop Loss</span>
            <span className="font-mono text-red-500">{stopLoss}</span>
          </div>
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-mkt-i2 text-sm">Take Profit</span>
            <span className="font-mono text-mkt-grn">{takeProfit}</span>
          </div>
        </div>

        {/* Right: Numbers */}
        <div className="bg-elevated/50 rounded-lg p-5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-mkt-i2 text-sm">Risk:Reward</span>
            <span className="font-mono text-white">{riskReward}</span>
          </div>
          {accountSize && (
            <div className="flex justify-between items-center">
              <span className="text-mkt-i2 text-sm">Account Size</span>
              <span className="font-mono text-white">{accountSize}</span>
            </div>
          )}
          {riskPercent && (
            <div className="flex justify-between items-center">
              <span className="text-mkt-i2 text-sm">Risk %</span>
              <span className="font-mono text-warning">{riskPercent}</span>
            </div>
          )}
          {positionSize && (
            <div className="flex justify-between items-center">
              <span className="text-mkt-i2 text-sm">Position Size</span>
              <span className="font-mono text-accent">{positionSize}</span>
            </div>
          )}
          <div className="pt-2 mt-2 border-t border-border flex justify-between items-center">
            <span className="text-mkt-ink font-bold">RESULT</span>
            <span className={`font-mono font-bold text-lg ${isProfit ? 'text-mkt-grn' : 'text-red-500'}`}>
              {result}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
