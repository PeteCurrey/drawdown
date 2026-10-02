// Server Component auth and tier gate for Strategy Backtester
// Enforces Edge-tier subscription server-side; prevents execution of simulation or candle fetching for unauthorized users.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasTierAccess } from "@/lib/entitlements";
import { Lock } from "lucide-react";
import Link from "next/link";
import { BacktesterClient } from "./BacktesterClient";

export const metadata = {
  title: "Strategy Backtester · Drawdown",
  description:
    "Simulate your trading strategy against historical OHLC data. Test mechanical expectancy, drawdown variance, and profit factor before risking capital.",
};

export default async function BacktesterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 1. Auth gate ──────────────────────────────────────────────────────────
  if (!user) {
    redirect("/login?redirect=/dashboard/tools/backtester");
  }

  // ── 2. Tier gate: Edge+ required ──────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, role")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const status = (profile as any)?.subscription_status as string | undefined;
  const isAdmin = (profile as any)?.role === "admin";
  const hasAccess = isAdmin || hasTierAccess(tier, "edge", status);

  const themeStyles = {
    "--tool-accent": "#f43f5e",
    "--tool-accent-hover": "#e11d48",
    "--tool-accent-tint": "#fff1f2",
    "--tool-accent-border": "#fecdd3",
    "--tool-accent-text": "#be123c",
  } as React.CSSProperties;

  if (!hasAccess) {
    return (
      <div style={themeStyles}>
        <BacktesterLockedState tier={tier} />
      </div>
    );
  }

  return (
    <div style={themeStyles}>
      <BacktesterClient />
    </div>
  );
}

// ─── Locked state — non-Edge users ───────────────────────────────────────────
function BacktesterLockedState({ tier }: { tier?: string }) {
  const C = "#f43f5e"; // Rose / Coral accent

  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] space-y-10 animate-in fade-in duration-700 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Lock icon — rose pill matching locked state */}
        <div className="flex justify-center">
          <div className="relative">
            <div
              className="w-20 h-20 flex items-center justify-center border rounded-2xl"
              style={{ backgroundColor: `${C}15`, borderColor: `${C}40` }}
            >
              <Lock className="w-8 h-8" style={{ color: C }} />
            </div>
            <span
              className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full animate-pulse"
              style={{ backgroundColor: C }}
            />
          </div>
        </div>

        {/* Headline */}
        <div className="text-center space-y-3">
          <p
            className="text-[10px] font-mono font-bold uppercase tracking-[0.3em]"
            style={{ color: C }}
          >
            BACKTESTER // EDGE ACCESS REQUIRED
          </p>
          <h1 className="text-3xl font-display font-bold uppercase text-gray-900">
            Strategy Backtester
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Simulate mechanical trading strategies against historical candle data with instant statistical expectancy, drawdown analysis, and profit factor calculation. Available exclusively on{" "}
            <span className="font-bold" style={{ color: C }}>
              Edge
            </span>{" "}
            and{" "}
            <span className="font-bold" style={{ color: C }}>
              Floor
            </span>{" "}
            plans.
          </p>
          {tier && (
            <p className="text-[11px] text-gray-400 font-mono">
              CURRENT PLAN:{" "}
              <span className="text-gray-700 uppercase font-bold">{tier}</span>
            </p>
          )}
        </div>

        {/* Feature list — white card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2.5">
          {[
            "Multi-year historical OHLC candle data (up to 5,000 bars per query)",
            "Mechanical strategy simulation (EMA Cross, RSI Reversal, Sessional Breakout)",
            "Detailed statistical breakdown: Win Rate, Profit Factor, Max Drawdown",
            "Interactive equity curve visualization and benchmark drawdown metrics",
            "Rule-of-Thumb mechanical profile assessment",
            "Direct Pine Script / Python conversion via Algo Builder",
          ].map((feat) => (
            <div key={feat} className="flex items-start gap-2.5">
              <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: C }}>
                ✓
              </span>
              <span className="text-xs text-gray-600 font-mono leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTAs — Rose primary + secondary */}
        <div className="space-y-2">
          <Link
            href="/pricing?source=backtester"
            className="w-full flex items-center justify-center px-8 py-4 text-[11px] font-mono font-bold uppercase tracking-widest transition-opacity hover:opacity-90 text-white rounded-lg"
            style={{ backgroundColor: C }}
          >
            Upgrade to Edge
          </Link>
          <Link
            href="/dashboard/tools"
            className="w-full flex items-center justify-center px-8 py-3 border border-gray-200 hover:border-gray-400 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all rounded-lg"
          >
            ← Back to Tools
          </Link>
        </div>
      </div>

      <p className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">
        Strategy Backtester · Edge Plan · Execution Systems
      </p>
    </div>
  );
}
