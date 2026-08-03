import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Play, Lock } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import BreakdownsClient from "@/components/dashboard/BreakdownsClient";

export const revalidate = 0; // Force dynamic fetching

const TIER_WEIGHT: Record<string, number> = {
  free: 0, foundation: 1, edge: 2, floor: 3,
};

export default async function BreakdownsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── Tier gate: Foundation+ required ──────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  if (userWeight < 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
        <div className="p-10 bg-white border border-gray-200 shadow-sm flex flex-col items-center text-center space-y-6 max-w-md w-full rounded-2xl">
          <div className="w-14 h-14 rounded-full border border-[#F9771D]/30 bg-[#F9771D]/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#F9771D]" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-900">
              Foundation Access Required
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Weekly Breakdowns are included with Foundation, Edge, and Floor plans.
              Upgrade to watch Pete's weekly market prep and macro bias sessions.
            </p>
            <p className="text-xs text-gray-400 font-mono mt-2">
              Current plan: <span className="font-bold text-gray-700 uppercase">{tier ?? "Free"}</span>
            </p>
          </div>
          <div className="w-full space-y-2 pt-2">
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center px-8 py-4 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg"
            >
              Upgrade to Foundation →
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

  // ── Fetch published breakdowns ────────────────────────────────────────────
  const { data: breakdowns, error } = await supabase
    .from("weekly_breakdowns")
    .select("*")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching breakdowns:", error);
  }

  const hasBreakdowns = breakdowns && breakdowns.length > 0;

  return (
    <div
      className="space-y-8 max-w-5xl mx-auto"
      style={{
        "--tool-accent": "#3b82f6",
        "--tool-accent-hover": "#2563eb",
        "--tool-accent-tint": "#eff6ff",
        "--tool-accent-border": "#bfdbfe",
        "--tool-accent-text": "#1d4ed8",
      } as React.CSSProperties}
    >
      <PageHeader
        eyebrow="// MACRO PREP & VIDEO ANALYSIS"
        title="Weekly Breakdowns"
        description="Actionable market prep and weekly bias sessions to start your trading week with clarity."
      />

      {!hasBreakdowns ? (
        <div className="bg-white border border-[#DEDDD8] rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl flex items-center justify-center mb-4 text-[#1d4ed8]">
            <Play className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A1A] mb-2">First weekly breakdown dropping soon</h2>
          <p className="text-sm text-[#555550] max-w-sm">
            We're preparing the first market prep video for the platform. You'll receive an email notification when it goes live.
          </p>
        </div>
      ) : (
        <BreakdownsClient initialBreakdowns={breakdowns ?? []} userTier={tier} />
      )}
    </div>
  );
}
