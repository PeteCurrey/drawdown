import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExecuteElsewhereClient } from "@/components/dashboard/ExecuteElsewhereClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "Execute Elsewhere Boundary · Drawdown",
  description: "Independent order placement boundary description.",
};

export default async function ExecuteElsewherePage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { planId } = await params;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Stage 3 · Execute"
        title="Execute Elsewhere"
        description="Order routing and order placement must occur independently on your broker terminal."
      />

      <ExecuteElsewhereClient planId={planId} />
    </div>
  );
}
