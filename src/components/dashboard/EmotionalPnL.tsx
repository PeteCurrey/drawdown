"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Brain, TrendingDown, TrendingUp, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function EmotionalPnL() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState("");
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Unauthenticated — show empty state, no fake data
        if (!user) {
          setHasData(false);
          setLoading(false);
          return;
        }

        const { data: manualTrades, error } = await supabase
          .from("trades")
          .select("pnl, emotional_state_entry")
          .eq("user_id", user.id);

        if (error) throw error;

        // No trades yet — show empty state, not demo data
        if (!manualTrades || manualTrades.length === 0) {
          setHasData(false);
          setLoading(false);
          return;
        }

        // Map raw emotional_state_entry values to display labels.
        // These keys correspond to the enum values stored by the trade journal.
        const labelMap: Record<string, string> = {
          calm:        "Calm",
          confident:   "Confidence",
          anxious:     "Anxiety",
          fearful:     "Fear",
          excited:     "Excitement",
          frustrated:  "Frustration",
          neutral:     "Neutral",
        };

        const emotionMap: Record<string, { pnl: number; count: number }> = {};

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

        const formatted = Object.entries(emotionMap)
          .map(([emotion, info]) => ({
            emotion,
            pnl: info.pnl,
            count: info.count,
            impact: info.pnl >= 0 ? ("positive" as const) : ("negative" as const),
          }))
          .sort((a, b) => b.pnl - a.pnl);

        setData(formatted);
        setHasData(true);

        // Generate insight from real data only — no static strings
        const positiveEmotions = formatted.filter(f => f.pnl > 0);
        const negativeEmotions = formatted.filter(f => f.pnl < 0);
        const bestEmotion  = positiveEmotions[0];
        const worstEmotion = negativeEmotions[negativeEmotions.length - 1];

        if (bestEmotion && worstEmotion) {
          setInsight(
            `Your "${bestEmotion.emotion}" state is your most profitable emotional context, yielding £${bestEmotion.pnl.toFixed(2)} across ${bestEmotion.count} trade(s). ` +
            `Conversely, "${worstEmotion.emotion}" is your largest equity leak — £${Math.abs(worstEmotion.pnl).toFixed(2)} lost across ${worstEmotion.count} trade(s).`
          );
        } else if (bestEmotion) {
          setInsight(
            `All logged trades are in profit. Your "${bestEmotion.emotion}" state leads with £${bestEmotion.pnl.toFixed(2)} across ${bestEmotion.count} trade(s). Keep logging to uncover the full picture.`
          );
        } else if (worstEmotion) {
          setInsight(
            `Current logs show a net loss under "${worstEmotion.emotion}" — £${Math.abs(worstEmotion.pnl).toFixed(2)} across ${worstEmotion.count} trade(s). Consider stepping away when this emotional state arises.`
          );
        } else {
          setInsight("No emotional correlations detected yet. Continue logging trades to build your profile.");
        }

      } catch (err) {
        console.error("Error loading emotional pnl:", err);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEmotions();
  }, []);

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            Emotional P&L Correlation
          </h4>
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

  // ── Empty state — no trades logged yet ───────────────────────────────────
  // IMPORTANT: never show demo/placeholder numbers when the user has no trades.
  // Fake P&L figures here directly contradict the "0 Trades" shown in Account Stats.
  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            Emotional P&L Correlation
          </h4>
          <Brain className="w-3 h-3 text-text-tertiary" />
        </div>
        <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 flex flex-col items-center text-center space-y-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
          <BookOpen className="w-7 h-7 text-text-tertiary/50" />
          <div className="space-y-2">
            <p className="text-sm font-sans font-bold uppercase text-text-primary">
              No Trade Data Yet
            </p>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
              Start tagging emotional states when you log trades to see how your psychology correlates with P&L.
            </p>
          </div>
          <Link
            href="/dashboard/tools/journal"
            className="px-6 py-2.5 border border-accent/40 text-accent text-[9px] font-mono uppercase tracking-widest hover:bg-accent/5 transition-colors"
          >
            Log a Trade
          </Link>
        </div>
      </div>
    );
  }

  // ── Live data ─────────────────────────────────────────────────────────────
  const maxAbsPnL = Math.max(...data.map(d => Math.abs(d.pnl))) || 1;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* "All Time" label distinguishes this from the month-to-date Account Stats above */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            Emotional P&L Correlation
          </h4>
          <span className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary/60">
            All time
          </span>
        </div>
        <Brain className="w-3 h-3 text-text-tertiary animate-pulse" />
      </div>

      <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 space-y-8 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
        <div className="space-y-6">
          {data.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest">
                <span className="text-text-primary font-bold">
                  {item.emotion}{" "}
                  <span className="text-text-tertiary font-normal">({item.count} trade{item.count !== 1 ? "s" : ""})</span>
                </span>
                <span className={cn(item.pnl >= 0 ? "text-profit" : "text-loss")}>
                  {item.pnl >= 0 ? "+" : "-"}
                  {Math.abs(item.pnl).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                </span>
              </div>
              <div className="h-1.5 bg-background-elevated/50 relative overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-1000",
                    item.pnl >= 0
                      ? "bg-profit shadow-[0_0_8px_rgba(0,230,118,0.3)]"
                      : "bg-loss shadow-[0_0_8px_rgba(255,61,87,0.3)]"
                  )}
                  style={{ width: `${(Math.abs(item.pnl) / maxAbsPnL) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border-slate/50">
          <p className="text-[10px] text-text-secondary leading-relaxed font-light">
            <span className="text-accent font-bold uppercase tracking-widest mr-2 underline decoration-accent/30 decoration-2 underline-offset-4">
              // AI Insight:
            </span>
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}
