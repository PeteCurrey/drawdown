import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicSignalDetailClient } from "@/components/signal-centre/PublicSignalDetailClient";
import { CommercialAccess } from "@/lib/entitlements";

export const metadata = {
  title: "Drawdown Signal Hub · Real-time Institutional Analysis",
  description: "Advanced quantitative confluence analytics, indicators grid, and dual AI sentiment scoring. Deep-dive signal analysis with full technical context and rationale.",
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

export default async function DashboardSignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch signal data
  const { data: signal, error } = await supabase
    .from("signals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !signal) {
    notFound();
  }

  // Get current user auth & subscription tier
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let isSaved = false;

  if (user) {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_status, role")
      .eq("id", user.id)
      .single();
    profile = profileData;

    // Check if signal is in user's watchlist
    const { data: savedData } = await supabase
      .from("signals_saved")
      .select("signal_id")
      .eq("user_id", user.id)
      .eq("signal_id", id)
      .maybeSingle();
    isSaved = !!savedData;
  }

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const status = (profile as any)?.subscription_status as string | undefined;
  const isAdmin = (profile as any)?.role === "admin";
  const isSubscriber = isAdmin || CommercialAccess.canAccessSignalCentre(tier, status);

  const displaySignal = isSubscriber ? signal : sanitizeSignalForPreview(signal);

  return (
    <PublicSignalDetailClient
      signal={displaySignal}
      isSubscriber={isSubscriber}
      userLoggedIn={!!user}
      initialSaved={isSaved}
      userTier={(tier as any) ?? null}
    />
  );
}
