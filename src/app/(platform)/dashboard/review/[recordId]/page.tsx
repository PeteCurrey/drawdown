import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewClient } from "@/components/dashboard/ReviewClient";

export const metadata = {
  title: "Review Trade · Drawdown",
  description: "Score your process quality against the original plan. Financial outcomes are secondary.",
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { recordId } = await params;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-widest block mb-2">
          // STAGE_05 // REVIEW
        </span>
        <h1 className="text-3xl font-display font-extrabold uppercase text-text-primary">
          Process <span className="text-emerald-500 italic">Review.</span>
        </h1>
        <p className="text-text-secondary text-xs mt-1 max-w-xl">
          Evaluate process quality, not financial outcome. Profitable deviations are flagged — not celebrated.
        </p>
      </header>

      <ReviewClient recordId={recordId} />
    </div>
  );
}
