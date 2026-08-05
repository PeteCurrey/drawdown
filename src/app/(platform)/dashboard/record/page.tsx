import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { RecordClient } from "@/components/dashboard/RecordClient";

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
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_04 // RECORD
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Trade <span className="text-emerald-500 italic">Record.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Enter what actually happened. The original plan cannot be changed.
        </p>
      </header>

      <Suspense fallback={
        <div className="text-text-tertiary font-mono text-xs">// LOADING PLAN CONTEXT...</div>
      }>
        <RecordClient />
      </Suspense>
    </div>
  );
}
