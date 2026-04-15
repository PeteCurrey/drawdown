"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine,
  PieChart, Pie, Cell as PieCell, Legend
} from "recharts";
import { cn } from "@/lib/utils";

interface Trade {
  pnl_amount: number;
  feeling: string;
}

interface EmotionChartsProps {
  trades: Trade[];
}

const EMOTION_COLORS: Record<string, string> = {
  Confident: "#00C2FF",   // Signal Blue
  Disciplined: "#00E676", // Profit Green
  Neutral: "#7A7D85",     // Graphite
  Anxious: "#FFB020",     // Amber
  FOMO: "#FF6B35",        // Orange
  Revenge: "#FF3D57",     // Loss Red
};

export function EmotionCharts({ trades }: EmotionChartsProps) {
  const pnlData = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    
    const aggregates: Record<string, number> = {};
    trades.forEach(t => {
      const feel = t.feeling || "Neutral";
      aggregates[feel] = (aggregates[feel] || 0) + (t.pnl_amount || 0);
    });

    return Object.entries(aggregates)
      .map(([emotion, pnl]) => ({ emotion, pnl }))
      .sort((a, b) => b.pnl - a.pnl);
  }, [trades]);

  const winRateData = useMemo(() => {
    if (!trades || trades.length === 0) return [];

    const stats: Record<string, { wins: number, total: number }> = {};
    trades.forEach(t => {
      const feel = t.feeling || "Neutral";
      if (!stats[feel]) stats[feel] = { wins: 0, total: 0 };
      stats[feel].total += 1;
      if (t.pnl_amount > 0) stats[feel].wins += 1;
    });

    return Object.entries(stats).map(([emotion, { wins, total }]) => {
      const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
      return { emotion, rate, total };
    });
  }, [trades]);

  const distributionData = useMemo(() => {
    if (!trades || trades.length === 0) return [];
    
    const count: Record<string, number> = {};
    trades.forEach(t => {
      const feel = t.feeling || "Neutral";
      count[feel] = (count[feel] || 0) + 1;
    });

    return Object.entries(count).map(([emotion, value]) => ({ emotion, value }));
  }, [trades]);

  if (!trades || trades.length < 10) {
    return (
      <div className="p-12 bg-background-surface border border-border-slate text-center space-y-4">
        <h3 className="text-xl font-display font-bold uppercase text-text-primary">Not Enough Data</h3>
        <p className="text-sm font-mono text-text-tertiary">Log 10+ trades with emotional state tags to see how your emotions affect your trading.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Chart 1: P&L By Emotion */}
      <div className="p-8 bg-background-surface border border-border-slate">
        <div className="mb-8">
          <h3 className="text-xl font-display font-bold uppercase">P&L by Emotional State</h3>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-1">How your emotions affect your bottom line</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pnlData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" stroke="#4A4D55" tick={{ fill: '#7A7D85', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis dataKey="emotion" type="category" stroke="#4A4D55" tick={{ fill: '#E4E2DD', fontSize: 12, fontWeight: 'bold' }} width={100} />
              <RechartsTooltip 
                cursor={{ fill: '#1A1D24' }}
                contentStyle={{ backgroundColor: '#111318', borderColor: '#2A2D35', fontFamily: 'monospace', fontSize: '12px' }}
                formatter={(value: number) => [`£${value.toFixed(2)}`, 'P&L']}
              />
              <ReferenceLine x={0} stroke="#4A4D55" />
              <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                {pnlData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#00E676' : '#FF3D57'} fillOpacity={entry.pnl >= 0 ? 0.8 : 0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chart 2: Win Rate By Emotion */}
        <div className="p-8 bg-background-surface border border-border-slate">
          <div className="mb-8">
            <h3 className="text-xl font-display font-bold uppercase">Win Rate by Emotion</h3>
          </div>
          <div className="space-y-6">
            {winRateData.map((data, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-text-primary">{data.emotion} <span className="text-text-tertiary font-normal">({data.total} trades)</span></span>
                  <span className="font-mono text-text-secondary">{data.rate}%</span>
                </div>
                <div className="h-2 w-full bg-background-elevated relative overflow-hidden rounded-full">
                  <div 
                    className={cn("absolute left-0 top-0 h-full", data.rate >= 50 ? "bg-profit" : "bg-loss")}
                    style={{ width: `${data.rate}%` }}
                  />
                  <div className="absolute left-1/2 top-0 h-full w-[1px] bg-background-primary/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Distribution Donut */}
        <div className="p-8 bg-background-surface border border-border-slate">
          <div className="mb-8">
            <h3 className="text-xl font-display font-bold uppercase">Trade Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <PieCell key={`cell-${index}`} fill={EMOTION_COLORS[entry.emotion] || EMOTION_COLORS.Neutral} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111318', borderColor: '#2A2D35', fontFamily: 'monospace', fontSize: '10px' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif', marginTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <span className="text-2xl font-mono font-bold text-text-primary">{trades.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
