import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicSignalDetailClient } from "@/components/signal-centre/PublicSignalDetailClient";

export const metadata = {
  title: "Drawdown Signal Centre · High-Conviction Market Setups",
  description: "Real-time, algorithmic market structural shifts and confluence setups verified on live price history with institutional multi-AI consensus scoring.",
};

const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  foundation: 1,
  edge: 2,
  floor: 3,
};

export default async function PublicSignalPage({
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
      .select("subscription_tier")
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
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;
  const isSubscriber = userWeight >= 2; // Edge or Floor

  return (
    <PublicSignalDetailClient
      signal={signal}
      isSubscriber={isSubscriber}
      userLoggedIn={!!user}
      initialSaved={isSaved}
    />
  );
}
