import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PeteMemoPage from "./PeteMemoClient";

export default async function PeteMemoGatedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check for active subscription in profiles/subscriptions table
  let tier: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, subscription_status")
      .eq("id", user.id)
      .single();

    if (
      profile?.subscription_status === "active" &&
      ["foundation", "edge", "floor"].includes(profile?.subscription_tier ?? "")
    ) {
      tier = profile.subscription_tier;
    }
  }

  // Pass tier down — the client component handles metered vs full access
  return <PeteMemoPage tier={tier} />;
}
