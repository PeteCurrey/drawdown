import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { RecordClient } from "@/components/dashboard/RecordClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata = {
  title: "Record Trade · Drawdown",
  description: "Record your actual trade execution parameters against the pre-defined strategy plan.",
};

export default async function RecordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/record");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        eyebrow="Stage 4 · Record"
        title="Trade Record"
        description="Enter what actually happened. The original plan cannot be changed."
      />

      <Suspense fallback={
        <div className="text-[#87877F] text-xs font-medium">Loading plan context…</div>
      }>
        <RecordClient />
      </Suspense>
    </div>
  );
}
