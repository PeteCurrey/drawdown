"use client";

import { useState, useEffect } from "react";
import { 
  Wrench, 
  Percent, 
  LayoutDashboard, 
  History, 
  Cpu, 
  Code,
  ArrowRight,
  Zap,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

interface ToolDef {
  slug: string;
  title: string;
  description: string;
  icon: any;
  minTier: 'free' | 'foundation' | 'edge' | 'floor';
  bullet: string;
}

const appTools: ToolDef[] = [
  {
    slug: "journal",
    title: "AI Trade Journal",
    description: "Launch your institutional logging suite.",
    icon: LayoutDashboard,
    minTier: "free",
    bullet: "Pattern detection across 6 emotional trading categories"
  },
  {
    slug: "position-sizer",
    title: "Risk Calculator",
    description: "Size positions precisely, every trade.",
    icon: Percent,
    minTier: "free",
    bullet: "Multi-asset calculation parameters with risk limit engine"
  },
  {
    slug: "technical-scanner",
    title: "AI Market Scanner",
    description: "13 instruments, 4-timeframe confluence.",
    icon: Zap,
    minTier: "edge",
    bullet: "Real-time sessional trend scanning and alerts"
  },
  {
    slug: "backtester",
    title: "Strategy Backtester",
    description: "Test your edge against up to 5,000 bars of historical OHLC data.",
    icon: History,
    minTier: "edge",
    bullet: "Multi-year candle range selection and historic simulation"
  },
  {
    slug: "intelligence",
    title: "Intelligence Hub",
    description: "Daily pre-market and post-session briefs.",
    icon: Cpu,
    minTier: "free",
    bullet: "Follow the flows of insiders and politicians"
  },
  {
    slug: "algo-builder",
    title: "Algo Strategy Builder",
    description: "Convert your rules to Pine Script or Python.",
    icon: Code,
    minTier: "floor",
    bullet: "Convert trading ideas into Pine Script v6 with QuantCoder AI"
  }
];

export default function AppToolsHub() {
  const [userTier, setUserTier] = useState<'free' | 'foundation' | 'edge' | 'floor'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTier() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        
        const tier = (profile as any)?.subscription_tier;
        if (tier) {
          setUserTier(tier as any);
        }
      }
      setLoading(false);
    }
    getTier();
  }, []);

  const tierWeight = { free: 0, foundation: 1, edge: 2, floor: 3 };

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Execution Systems · Tools"
        title="AI Tools"
        description="Purpose-built for serious traders. Real-time data, institutional precision, zero fluff."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appTools.map((tool) => {
          const Icon = tool.icon;
          const isLocked = tierWeight[userTier] < tierWeight[tool.minTier];

          return (
            <div 
              key={tool.slug} 
              className={cn(
                "group p-6 bg-white border border-[#E6E4DE] rounded-[8px] transition-all duration-300 relative flex flex-col justify-between min-h-[220px] shadow-[0_1px_2px_rgba(14,13,10,0.04),0_2px_8px_rgba(14,13,10,0.05)]",
                isLocked
                  ? "opacity-75"
                  : "hover:shadow-[0_4px_16px_rgba(14,13,10,0.08)] hover:-translate-y-0.5"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-[#F3F2EE] border border-[#E6E4DE] rounded-[6px] text-[#181818]">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F5F4F1] border border-[#E6E4DE] rounded-[4px]">
                       <Lock className="w-3 h-3 text-[#87877F]" />
                       <span className="text-[9px] font-semibold uppercase tracking-wider text-[#87877F]">{tool.minTier.toUpperCase()} Required</span>
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 border border-[rgba(24,184,128,0.25)] bg-[#F0FDF8] text-[#18B880] rounded-[4px]">
                       <span className="text-[9px] font-semibold uppercase tracking-wider text-[#18B880]">Unlocked</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-base font-bold text-[#181818]">{tool.title}</h3>
                  <p className="text-xs text-[#87877F]">{tool.description}</p>
                  <p className="text-[10px] text-[#87877F] pt-1">{tool.bullet}</p>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="w-full h-10 bg-[#F3F2EE] rounded-[6px] animate-pulse" />
                ) : isLocked ? (
                  <Link 
                    href="/pricing"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-[10px] font-semibold uppercase tracking-wider rounded-[6px] transition-colors"
                  >
                     Unlock with Edge+ <Lock className="w-3 h-3 text-[#F9771D]" />
                   </Link>
                ) : (
                  <Link 
                    href={tool.slug === 'intelligence' ? '/dashboard/market-intelligence' : `/dashboard/tools/${tool.slug}`}
                    className="flex items-center justify-between w-full px-5 py-2.5 bg-[#181818] hover:bg-[#2A2A2A] text-white text-[10px] font-semibold uppercase tracking-wider transition-all rounded-[6px]"
                  >
                     Open Tool <ArrowRight className="w-4 h-4 text-[#F9771D] transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
