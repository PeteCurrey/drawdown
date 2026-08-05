import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ImproveClient } from "@/components/dashboard/ImproveClient";

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
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_06 // IMPROVE
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Improvement <span className="text-emerald-500 italic">Commitments.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Each review produces at least one commitment. Track them here. Closed commitments build your process history.
        </p>
      </header>

      <ImproveClient />
    </div>
  );
}
