import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewClient } from "@/components/dashboard/ReviewClient";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

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
      <PageHeader
        eyebrow="Stage 5 · Review"
        title="Process Review"
        description="Evaluate process quality, not financial outcome. Profitable deviations are flagged — not celebrated."
      />

      <ReviewClient recordId={recordId} />
    </div>
  );
}
