import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicSignalDetailClient } from "@/components/signal-centre/PublicSignalDetailClient";

export const metadata = {
  title: "Drawdown Signal Hub · Real-time Institutional Analysis",
  description: "Advanced quantitative confluence analytics, indicators grid, and dual AI sentiment scoring.",
};

const TIER_WEIGHT: Record<string, number> = {
  free: 0,
  'signal-centre': 0.5,
  foundation: 1,
  edge: 2,
  floor: 3,
};

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
  const isSubscriber = userWeight >= 3; // Edge (3) or Floor (4)

  return (
    <PublicSignalDetailClient
      signal={signal}
      isSubscriber={isSubscriber}
      userLoggedIn={!!user}
      initialSaved={isSaved}
      userTier={(tier as any) ?? null}
    />
  );
}
