// Phase 1 — Server Component auth gate for Algo Strategy Builder
// Enforces floor-tier subscription server-side; no flash of unauthenticated content.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AlgoBuilderShell } from "@/components/algo-builder/AlgoBuilderShell";
import { Lock } from "lucide-react";
import Link from "next/link";

const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

export const metadata = {
  title: "Algo Strategy Builder · Drawdown",
  description:
    "Convert discretionary logic into production Pine Script v6 & Python with QuantCoder AI.",
};

export default async function AlgoBuilderPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 1. Auth gate ──────────────────────────────────────────────────────────
  if (!user) {
    redirect("/login?redirect=/dashboard/tools/algo-builder");
  }

  // ── 2. Tier gate ─────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, display_name")
    .eq("id", user.id)
    .single();

  const tier        = (profile as any)?.subscription_tier as string | undefined;
  const displayName = (profile as any)?.display_name     as string | undefined;
  const userWeight  = TIER_WEIGHT[tier ?? "free"] ?? 0;

  if (userWeight < 3) {
    return <AlgoBuilderLockedState tier={tier} />;
  }

  return (
    <AlgoBuilderShell
      userName={displayName ?? user.email ?? ""}
      userEmail={user.email ?? ""}
      tier={tier ?? "floor"}
    />
  );
}

// ─── Locked state — non-floor users ───────────────────────────────────────────
function AlgoBuilderLockedState({ tier }: { tier?: string }) {
  const C = "#00e5cc"; // Journal cyan accent

  return (
    <div className="flex flex-col items-center justify-center min-h-[72vh] space-y-10 animate-in fade-in duration-700 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Lock icon — teal pill matching Journal locked state */}
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
            ALGO_BUILDER // FLOOR ACCESS REQUIRED
          </p>
          <h1 className="text-3xl font-display font-bold uppercase text-gray-900">
            Algo Strategy Builder
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Convert your discretionary ideas into production&nbsp;Pine Script v6 and
            Python — powered by QuantCoder AI. Available exclusively on the{" "}
            <span className="font-bold" style={{ color: C }}>
              Floor
            </span>{" "}
            plan.
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
            "Pine Script v6 & Python code generation",
            "QuantCoder AI with lookahead-bias detection",
            "Strategy library — save up to 20 strategies",
            "Health check with simulated equity curve",
            "Error fix loop for TradingView compiler errors",
            "10 generations / 24 hours",
          ].map((feat) => (
            <div key={feat} className="flex items-start gap-2.5">
              <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: C }}>
                ✓
              </span>
              <span className="text-xs text-gray-600 font-mono leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTAs — Journal primary + secondary */}
        <div className="space-y-2">
          <Link
            href="/pricing?source=algo-builder"
            className="w-full flex items-center justify-center px-8 py-4 text-[11px] font-mono font-bold uppercase tracking-widest transition-opacity hover:opacity-90 text-black rounded-lg"
            style={{ backgroundColor: C }}
          >
            Upgrade to Floor
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
        Algo Strategy Builder · Floor Plan · QuantCoder AI
      </p>
    </div>
  );
}
