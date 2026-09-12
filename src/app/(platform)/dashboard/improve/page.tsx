import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImproveClient } from "@/components/dashboard/ImproveClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "Improve · Drawdown",
  description: "Track improvement commitments formed after each trade review.",
};

export default async function ImprovePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/improve");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Stage 6 · Improve"
        title="Improvement Commitments"
        description="Each review produces at least one commitment. Track them here. Closed commitments build your process history."
      />

      <ImproveClient />
    </div>
  );
}
