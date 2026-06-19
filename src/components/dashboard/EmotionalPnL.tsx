"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Brain, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const defaultEmotionData = [
  { emotion: "FOMO", pnl: -1250.40, count: 12, impact: "negative" },
  { emotion: "Boredom", pnl: -450.20, count: 5, impact: "negative" },
  { emotion: "Discipline", pnl: 5890.15, count: 22, impact: "positive" },
  { emotion: "Confidence", pnl: 1200.00, count: 8, impact: "positive" },
  { emotion: "Revenge", pnl: -890.00, count: 4, impact: "negative" },
];

export function EmotionalPnL() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [insight, setInsight] = useState("");

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setData(defaultEmotionData);
          setIsDemo(true);
          setInsight("Your \"Discipline\" state generates 82% of your total profit. \"FOMO\" entries remain your single greatest equity leak, costing an average of £104 per occurrence.");
          setLoading(false);
          return;
        }

        // Fetch manual trades
        const { data: manualTrades, error } = await supabase
          .from("trades")
          .select("pnl, emotional_state_entry")
          .eq("user_id", user.id);

        if (error) throw error;

        // If no trades, use default mock fallback
        if (!manualTrades || manualTrades.length === 0) {
          setData(defaultEmotionData);
          setIsDemo(true);
          setInsight("Your \"Discipline\" state generates 82% of your total profit. \"FOMO\" entries remain your single greatest equity leak, costing an average of £104 per occurrence.");
          setLoading(false);
          return;
        }

        // Group by emotion
        const emotionMap: Record<string, { pnl: number; count: number }> = {};
        
        // Define human-readable mappings
        const labelMap: Record<string, string> = {
          calm: "Calm",
          confident: "Confidence",
          anxious: "Anxiety",
          fearful: "Fear",
          excited: "Excitement",
          frustrated: "Frustration",
          neutral: "Neutral"
        };

        (manualTrades as any[]).forEach((t: any) => {
          const rawEmotion = t.emotional_state_entry || "neutral";
          const label = labelMap[rawEmotion] || rawEmotion;
          const pnlVal = Number(t.pnl || 0);

          if (!emotionMap[label]) {
            emotionMap[label] = { pnl: 0, count: 0 };
          }
          emotionMap[label].pnl += pnlVal;
          emotionMap[label].count += 1;
        });

        // Convert to array
        const formatted = Object.entries(emotionMap).map(([emotion, info]) => ({
          emotion,
          pnl: info.pnl,
          count: info.count,
          impact: info.pnl >= 0 ? "positive" as const : "negative" as const
        })).sort((a, b) => b.pnl - a.pnl);

        setData(formatted);
        setIsDemo(false);

        // Generate dynamic insight
        const positiveEmotions = formatted.filter(f => f.pnl > 0);
        const negativeEmotions = formatted.filter(f => f.pnl < 0);
        
        let bestEmotion = positiveEmotions[0];
        let worstEmotion = negativeEmotions[negativeEmotions.length - 1];

        if (bestEmotion && worstEmotion) {
          setInsight(`Your "${bestEmotion.emotion}" state is your most profitable emotion, yielding £${bestEmotion.pnl.toFixed(2)} across ${bestEmotion.count} trades. Conversely, "${worstEmotion.emotion}" is your largest equity leak, costing you £${Math.abs(worstEmotion.pnl).toFixed(2)}.`);
        } else if (bestEmotion) {
          setInsight(`Outstanding discipline! Your "${bestEmotion.emotion}" trading is highly profitable with £${bestEmotion.pnl.toFixed(2)} in gains. Keep logging trades to uncover more insights.`);
        } else if (worstEmotion) {
          setInsight(`Your logged trades show an equity leak under "${worstEmotion.emotion}" costing £${Math.abs(worstEmotion.pnl).toFixed(2)}. Focus on slowing down and stepping away when feeling this way.`);
        } else {
          setInsight("No emotional trading correlations detected yet. Keep logging trades to build your profile.");
        }

      } catch (err) {
        console.error("Error loading emotional pnl:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Emotional P&L Correlation</h4>
          <Brain className="w-3 h-3 text-text-tertiary" />
        </div>
        <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 space-y-6 animate-pulse">
          <div className="h-4 bg-white/5 w-32 rounded" />
          <div className="space-y-4">
            <div className="h-10 bg-white/5 rounded" />
            <div className="h-10 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const maxAbsPnL = data.length > 0 ? Math.max(...data.map(d => Math.abs(d.pnl))) : 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Emotional P&L Correlation</h4>
        <Brain className="w-3 h-3 text-text-tertiary animate-pulse" />
      </div>

      <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 space-y-8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
        {isDemo && (
          <div className="text-[8px] font-mono uppercase text-accent/80 border border-accent/20 px-2 py-1 bg-accent/5 rounded w-max">
            Demo Data (No trades logged yet)
          </div>
        )}
        <div className="space-y-6">
          {data.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-primary font-bold">{item.emotion} <span className="text-text-tertiary font-normal">({item.count} trades)</span></span>
                <span className={cn(item.pnl >= 0 ? "text-profit" : "text-loss")}>
                  {item.pnl >= 0 ? "+" : "-"}{Math.abs(item.pnl).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                </span>
              </div>
              <div className="h-1.5 bg-background-elevated/50 relative overflow-hidden flex items-center">
                <div 
                  className={cn(
                    "h-full transition-all duration-1000",
                    item.pnl >= 0 ? "bg-profit shadow-[0_0_8px_rgba(0,230,118,0.3)]" : "bg-loss shadow-[0_0_8px_rgba(255,61,87,0.3)]"
                  )}
                  style={{ width: `${(Math.abs(item.pnl) / maxAbsPnL) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border-slate/50">
          <p className="text-[10px] text-text-secondary leading-relaxed font-light">
            <span className="text-accent font-bold uppercase tracking-widest mr-2 underline decoration-accent/30 decoration-2 underline-offset-4">// AI Insight:</span> 
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}
