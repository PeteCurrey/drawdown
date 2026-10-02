import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarketLobbyClient } from "@/components/market-lobby/MarketLobbyClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Market Lobby · Drawdown Trading",
  description: "Cross-asset market discovery, live technical confluences, active session rhythm, and verified signal intelligence.",
};

export default async function MarketLobbyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/market-lobby");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <MarketLobbyClient />
    </div>
  );
}
