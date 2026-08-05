import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExecuteElsewhereClient } from "@/components/dashboard/ExecuteElsewhereClient";

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
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_03 // EXECUTE ELSEWHERE
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Execute <span className="text-emerald-500 italic">Elsewhere.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Order routing and order placement must occur independently on your broker terminal.
        </p>
      </header>

      <ExecuteElsewhereClient planId={planId} />
    </div>
  );
}
