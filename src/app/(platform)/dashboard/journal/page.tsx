import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lock } from "lucide-react";
import Link from "next/link";
import { JournalClient } from "@/components/journal/JournalClient";

export const metadata = {
  title: "AI Trade Journal | Drawdown",
  description: "Every trade logged. Every pattern found. Every edge revealed.",
};

const TIER_WEIGHT: Record<string, number> = {
  free: 0, foundation: 1, edge: 2, floor: 3,
};

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const weight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  if (weight < 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="p-10 bg-white border border-gray-200 shadow-sm flex flex-col items-center text-center space-y-6 max-w-md w-full rounded-2xl">
          <div className="w-14 h-14 rounded-full border border-[#00e5cc]/20 bg-[#00e5cc]/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#00e5cc]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Foundation Access Required
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              The AI Trade Journal requires a Foundation plan or above. Your current plan is{" "}
              <span className="font-bold text-gray-900 uppercase">{tier ?? "Free"}</span>.
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center px-8 py-4 bg-[#00e5cc] hover:bg-[#00c8b0] text-black text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg"
            >
              Upgrade to Foundation
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center px-8 py-3 border border-gray-200 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-all rounded-lg"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { view } = await searchParams;

  return <JournalClient initialView={(view as any) ?? "calendar"} userId={user.id} />;
}
