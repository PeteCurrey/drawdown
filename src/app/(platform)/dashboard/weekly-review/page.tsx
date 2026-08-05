import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeeklyReviewClient } from "@/components/dashboard/WeeklyReviewClient";

export const metadata = {
  title: "Weekly Review · Drawdown",
  description: "Close the trading week. Review process consistency, commit to next week's plan, and repeat.",
};

export default async function WeeklyReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/weekly-review");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_07 // WEEKLY REVIEW
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Repeat <span className="text-emerald-500 italic">Weekly.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Close the loop. Document what worked, commit to what changes, decide whether you trade next week.
        </p>
      </header>

      <WeeklyReviewClient />
    </div>
  );
}
