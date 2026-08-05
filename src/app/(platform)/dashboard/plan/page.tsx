import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlanClient } from "@/components/dashboard/PlanClient";

export const metadata = {
  title: "Construct Strategy Plan · Drawdown",
  description: "Require planning logic and risk metrics calculation before placing a position elsewhere.",
};

export default async function PlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/plan");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_02 // PLAN
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Strategy <span className="text-emerald-500 italic">Planning.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Construct your pre-trade target entry, invalidation parameters, and risk size constraints.
        </p>
      </header>

      <PlanClient />
    </div>
  );
}
