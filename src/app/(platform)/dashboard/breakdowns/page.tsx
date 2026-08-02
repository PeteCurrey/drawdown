import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Play, Calendar, Lock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

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
            <p className="text-xs font-bold uppercase tracking-widest text-gray-900">
              Foundation Access Required
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
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
  const latestBreakdown = hasBreakdowns ? breakdowns[0] : null;
  const pastBreakdowns = hasBreakdowns ? breakdowns.slice(1) : [];

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
        <div className="space-y-8">
          {/* Latest Breakdown */}
          <section>
            <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Latest Video</h2>
            <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
              {latestBreakdown.video_url ? (
                <div className="aspect-video w-full bg-black relative">
                  <iframe
                    src={latestBreakdown.video_url.includes('youtube')
                      ? latestBreakdown.video_url.replace('watch?v=', 'embed/')
                      : latestBreakdown.video_url}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full bg-[#F8F8F8] border-b border-[#DEDDD8] flex items-center justify-center">
                  <span className="text-[#555550] text-sm font-mono uppercase tracking-widest">Video processing...</span>
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[#F9771D]" />
                  <span className="text-xs font-mono font-bold text-[#F9771D] tracking-widest uppercase">
                    Week of {new Date(latestBreakdown.week_of).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">{latestBreakdown.title}</h3>

                {latestBreakdown.summary_md && (
                  <div className="prose prose-sm max-w-none text-[#555550]">
                    <ReactMarkdown>{latestBreakdown.summary_md}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Past Breakdowns */}
          {pastBreakdowns.length > 0 && (
            <section>
              <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest mb-4">Past Breakdowns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBreakdowns.map((b) => (
                  <div key={b.id} className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="aspect-video w-full bg-[#1A1A1A] relative flex items-center justify-center overflow-hidden">
                      {b.video_url ? (
                        <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: `url(https://img.youtube.com/vi/${b.video_url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg)` }}></div>
                      ) : null}
                      <Play className="w-10 h-10 text-white/80 group-hover:text-white transition-colors z-10" />
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-widest mb-2">
                        {new Date(b.week_of).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="font-bold text-[#1A1A1A] text-sm leading-tight group-hover:text-[#F9771D] transition-colors">{b.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
