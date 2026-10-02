import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrepareClient } from "@/components/dashboard/PrepareClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

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
      <PageHeader
        eyebrow="Stage 1 · Prepare"
        title="Session Preparation"
        description="Assess sessional rules, watchlist parameters, and psychological indicators before charting."
      />

      <PrepareClient />
    </div>
  );
}
