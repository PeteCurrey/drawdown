import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeeklyReviewClient } from "@/components/dashboard/WeeklyReviewClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

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
      <PageHeader
        eyebrow="Stage 7 · Weekly Review"
        title="Weekly Review"
        description="Close the loop. Document what worked, commit to what changes, decide whether you trade next week."
      />

      <WeeklyReviewClient />
    </div>
  );
}
