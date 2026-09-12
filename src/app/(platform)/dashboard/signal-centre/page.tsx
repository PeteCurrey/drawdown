import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignalCentreDashboardClient } from "@/components/signal-centre/SignalCentreDashboardClient";
import { CommercialAccess } from "@/lib/entitlements";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "Signal Centre · Drawdown",
  description: "Real-time, high-conviction sessional confluence signals and technical setups. Three AI models produce a single consensus score on every live market opportunity.",
};

function sanitizeSignalForPreview(signal: any) {
  return {
    ...signal,
    entry_price: null,
    stop_loss: null,
    take_profit_1: null,
    take_profit_2: null,
    rr_ratio: null,
    claude_analysis: null,
    gpt4_analysis: null,
    grok_analysis: null,
    taapi_data: null,
    coingecko_data: null,
    ai_debate: null,
    rationale: "Upgrade to Foundation, Edge, or Floor to unlock institutional entry levels, stop loss, take profit targets, and complete multi-model AI rationale.",
  };
}

export default async function SignalCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/signal-centre");
  }

  // Fetch profile with subscription status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, subscription_status, role")
    .eq("id", user.id)
    .single();

  const tier = ((profile as any)?.subscription_tier as string | undefined) ?? "free";
  const status = (profile as any)?.subscription_status as string | undefined;
  const isAdmin = (profile as any)?.role === "admin";
  const isSubscriber = isAdmin || CommercialAccess.canAccessSignalCentre(tier, status);

  // Fetch active signals + closed archive + saved watchlist in parallel
  const [signalsRes, closedRes, savedRes] = await Promise.all([
    supabase
      .from("signals")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("signals")
      .select("id, instrument, bias, dcs_score, rr_ratio, created_at, expires_at")
      .eq("is_active", false)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("signals_saved")
      .select("signal_id")
      .eq("user_id", user.id),
  ]);

  const rawSignals = signalsRes.data ?? [];
  const activeSignals = isSubscriber ? rawSignals : rawSignals.map(sanitizeSignalForPreview);

  const savedIds = (savedRes.data ?? []).map(s => s.signal_id);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <PageHeader
        eyebrow="Market Intelligence · Confluence"
        title="Signal Centre"
        description="Multi-model consensus signals via institutional indicators — Claude, GPT-4o, and Grok scoring live market data simultaneously."
      />

      <SignalCentreDashboardClient
        initialSignals={activeSignals}
        initialSavedIds={savedIds}
        isSubscriber={isSubscriber}
        userId={user.id}
        userTier={tier}
        closedSignals={closedRes.data ?? []}
      />
    </div>
  );
}
