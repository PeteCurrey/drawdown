import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RunMyTrade } from "@/components/dashboard/RunMyTrade";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "Run My Trade · Drawdown Operating System",
  description: "Quantify risk, calculate exact position size, and verify drawdown limits before placing a trade.",
};

export default async function RunMyTradePage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/run-my-trade");
  }

  const { symbol } = await searchParams;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Stage 2 · Pre-Trade"
        title="Run My Trade"
        description="Enter your trade idea to immediately quantify position size, reward/risk, and drawdown exposure before executing at your broker."
      />

      <RunMyTrade initialInstrument={symbol} />
    </div>
  );
}
