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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">
            Emotional P&L Correlation
          </h4>
          <Brain className="w-3.5 h-3.5 text-[#888882]" />
        </div>
        <div className="p-6 bg-white border border-[#E8E6E1] rounded-lg space-y-4 animate-pulse">
          <div className="h-4 bg-[#F4F3F0] w-32 rounded" />
          <div className="space-y-3">
            <div className="h-8 bg-[#F4F3F0] rounded" />
            <div className="h-8 bg-[#F4F3F0] rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state — no trades logged yet ───────────────────────────────────
  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">
            Emotional P&L Correlation
          </h4>
          <Brain className="w-3.5 h-3.5 text-[#888882]" />
        </div>
        <div className="p-6 bg-white border border-[#E8E6E1] rounded-lg flex flex-col items-center text-center space-y-3">
          <div className="w-9 h-9 rounded-full bg-[#F4F3F0] flex items-center justify-center text-[#888882]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#1A1A1A]">
              No Trade Psychology Data
            </p>
            <p className="text-xs text-[#888882] leading-relaxed max-w-xs">
              Tag your emotional state when journaling trades to discover psychological performance leaks.
            </p>
          </div>
          <Link
            href="/dashboard/record"
            className="text-[11px] font-semibold text-[#F9771D] hover:underline uppercase tracking-wider mt-1"
          >
            Journal a Trade →
          </Link>
        </div>
      </div>
    );
  }

  // ── Live data ─────────────────────────────────────────────────────────────
  const maxAbsPnL = Math.max(...data.map(d => Math.abs(d.pnl))) || 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#888882]">
            Emotional P&L Correlation
          </h4>
          <span className="text-[10px] text-[#888882]">
            All-time correlation
          </span>
        </div>
        <Brain className="w-3.5 h-3.5 text-[#F9771D]" />
      </div>

      <div className="p-5 bg-white border border-[#E8E6E1] rounded-lg space-y-5">
        <div className="space-y-4">
          {data.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#1A1A1A] font-semibold">
                  {item.emotion}{" "}
                  <span className="text-[#888882] font-normal text-[11px]">({item.count} trade{item.count !== 1 ? "s" : ""})</span>
                </span>
                <span className={cn("font-semibold dd-tabular", item.pnl >= 0 ? "text-[#18B880]" : "text-[#CE6969]")}>
                  {item.pnl >= 0 ? "+" : "-"}
                  {Math.abs(item.pnl).toLocaleString("en-GB", { style: "currency", currency: "GBP" })}
                </span>
              </div>
              <div className="h-1.5 bg-[#F4F3F0] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    item.pnl >= 0 ? "bg-[#18B880]" : "bg-[#CE6969]"
                  )}
                  style={{ width: `${(Math.abs(item.pnl) / maxAbsPnL) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#F0EEE9]">
          <p className="text-xs text-[#4A4A47] leading-relaxed">
            <span className="text-[#F9771D] font-semibold mr-1.5">
              Insight:
            </span>
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}

