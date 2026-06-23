import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lock } from "lucide-react";
import Link from "next/link";
import { DotProgressBar } from "@/components/dashboard/DotProgressBar";

const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

export default async function CurriculumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  // Let's seed the 6 phases described in the specification
  const curriculumPhases = [
    {
      num: "01",
      name: "Ground Zero",
      tier: "FREE",
      minWeight: 0,
      desc: "Get started with the absolute essentials of trading operations.",
      info: "8 Modules · 4.5 Hours",
      pct: 100,
      status: "COMPLETED",
      cta: "Completed ✓"
    },
    {
      num: "02",
      name: "Chart Reader",
      tier: "FOUNDATION",
      minWeight: 1,
      desc: "Learn to read price structure, candlestick patterns, and liquid zones.",
      info: "12 Modules · 8.2 Hours",
      pct: 58,
      status: "IN_PROGRESS",
      cta: "Continue →"
    },
    {
      num: "03",
      name: "Strategist",
      tier: "FOUNDATION",
      minWeight: 1,
      desc: "Build rules around confluence strategy and probability models.",
      info: "10 Modules · 6.0 Hours",
      pct: 0,
      status: "LOCKED",
      cta: "Locked"
    },
    {
      num: "04",
      name: "Risk Manager",
      tier: "FOUNDATION",
      minWeight: 1,
      desc: "Understand sizing math, sessional parameters, and risk curves.",
      info: "6 Modules · 4.0 Hours",
      pct: 0,
      status: "LOCKED",
      cta: "Locked"
    },
    {
      num: "05",
      name: "Mind Over Market",
      tier: "EDGE",
      minWeight: 2,
      desc: "Master sessional psychology, bias mapping, and trade reviews.",
      info: "8 Modules · 5.5 Hours",
      pct: 0,
      status: "LOCKED",
      cta: "Locked"
    },
    {
      num: "06",
      name: "AI Integration",
      tier: "EDGE",
      minWeight: 2,
      desc: "Integrate LLM sentiment analysis, macro metrics, and code scripts.",
      info: "10 Modules · 7.0 Hours",
      pct: 0,
      status: "LOCKED",
      cta: "Locked"
    }
  ];

  return (
    <div className="space-y-10">
      <header className="border-b border-[#C8CBB8] pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Curriculum</h1>
        <p className="text-sm text-[#555550] mt-2 max-w-xl">
          Phase-based trading education built in the order you actually need it.
        </p>
      </header>

      {/* Progress summary bar */}
      <section className="bg-[#181818] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 rounded-none">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#8A8A85] uppercase tracking-widest">Active Tier</span>
            <span className="px-2 py-0.5 bg-[#F9771D] text-white font-bold text-[9px]">FOUNDATION</span>
          </div>
          <p className="text-xs text-[#8A8A85]">7 of 36 modules complete</p>
        </div>

        <div className="w-full md:w-96 flex flex-col gap-1.5 shrink-0">
          <DotProgressBar percentage={32} label="Curriculum Progress" color="bg-[#F9771D]" />
        </div>

        <button className="px-6 py-3 bg-[#F9771D] hover:bg-[#e0600d] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-[4px] shrink-0">
          Continue → Chart Reader
        </button>
      </section>

      {/* Phase Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {curriculumPhases.map((phase) => {
          const isPhaseLocked = userWeight < phase.minWeight;
          
          return (
            <div 
              key={phase.num} 
              className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between min-h-[260px] relative transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xl font-bold font-mono text-[#555550]">{phase.num}</span>
                  <span className={`px-2 py-0.5 text-[8px] font-mono font-bold ${
                    phase.tier === 'FREE' ? 'border border-[#18B880] text-[#18B880]' : 'bg-[#F9771D] text-white'
                  }`}>
                    {phase.tier}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#1A1A1A] mb-2">{phase.name}</h3>
                <p className="text-xs text-[#555550] leading-relaxed mb-4">{phase.desc}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-[#555550]">
                  <span>{phase.info}</span>
                  <span>{phase.pct}%</span>
                </div>
                
                <DotProgressBar percentage={phase.pct} color={isPhaseLocked ? "bg-[#C8CBB8]" : "bg-[#F9771D]"} />

                {isPhaseLocked ? (
                  <button 
                    disabled 
                    className="w-full py-2.5 bg-[#C8CBB8] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    Locked
                  </button>
                ) : phase.status === "COMPLETED" ? (
                  <button className="w-full py-2.5 bg-[#181818] hover:bg-[#232323] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors">
                    Completed ✓
                  </button>
                ) : (
                  <button className="w-full py-2.5 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors">
                    Continue →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
