import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignalCentreDashboardClient } from "@/components/signal-centre/SignalCentreDashboardClient";

export const metadata = {
  title: "Signal Centre · Drawdown",
  description: "Real-time, high-conviction sessional confluence signals and technical setups.",
};

const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  'signal-centre': 1,
  foundation: 2,
  edge: 3,
  floor: 4,
};

export default async function SignalCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/signal-centre");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = ((profile as any)?.subscription_tier as string | undefined) ?? "free";
  const userWeight = TIER_WEIGHT[tier] ?? 0;
  // isSubscriber = true for any paid tier (hides the free-user upgrade CTA)
  // Internal Signal Centre feature gating is handled by the dashboard client's own TierGate
  const isSubscriber = userWeight >= 1; // signal-centre, foundation, edge, floor

  // Fetch active signals
  const { data: signals } = await supabase
    .from("signals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch user's saved watchlist
  const { data: savedSignals } = await supabase
    .from("signals_saved")
    .select("signal_id")
    .eq("user_id", user.id);

  const savedIds = (savedSignals ?? []).map(s => s.signal_id);

  const themeStyles = {
    "--tool-accent":        "#C8F135",
    "--tool-accent-hover":  "#b8df1a",
    "--tool-accent-tint":   "#f7ffe8",
    "--tool-accent-border": "#d4f05a",
    "--tool-accent-text":   "#4a6600",
  } as React.CSSProperties;

  return (
    <div className="space-y-8 animate-in fade-in duration-700" style={themeStyles}>
      {/* Page header — matches dashboard tool design: accent eyebrow, font-display h1, italic accent word */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-teal-500 font-mono text-[10px] uppercase tracking-widest block mb-3">
            // MODULE_SC // SIGNAL CENTRE
          </span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">
            Signal <span className="text-teal-500 italic">Centre.</span>
          </h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Multi-model consensus signals via institutional indicators — Claude, GPT-4o, and Grok scoring live market data simultaneously.
          </p>
        </div>
      </header>

      <SignalCentreDashboardClient
        initialSignals={signals ?? []}
        initialSavedIds={savedIds}
        isSubscriber={isSubscriber}
        userId={user.id}
        userTier={tier}
      />
    </div>
  );
}
