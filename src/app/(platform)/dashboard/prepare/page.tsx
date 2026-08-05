import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrepareClient } from "@/components/dashboard/PrepareClient";

export const metadata = {
  title: "Session Preparation · Drawdown",
  description: "Prepare and evaluate your sessional risk parameters and readiness flags before creating a trading plan.",
};

export default async function PreparePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/prepare");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_01 // PREPARE
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Session <span className="text-emerald-500 italic">Preparation.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Assess sessional rules, watchlist parameters, and psychological indicators before charting.
        </p>
      </header>

      <PrepareClient />
    </div>
  );
}
