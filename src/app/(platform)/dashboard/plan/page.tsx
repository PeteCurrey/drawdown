import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PlanWorkspace } from "@/components/dashboard/PlanWorkspace";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

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
      <PageHeader
        eyebrow="Stage 2 · Plan"
        title="Strategy Planning"
        description="Construct your pre-trade target entry, invalidation parameters, and risk size constraints."
      />

      <PlanWorkspace />
    </div>
  );
}
