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
    description: "40+ instruments, 4-timeframe confluence.",
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
    <div
      className="space-y-10"
      style={{
        "--tool-accent": "#F9771D",
        "--tool-accent-hover": "#e0600d",
        "--tool-accent-tint": "#fff7ed",
        "--tool-accent-border": "#fed7aa",
        "--tool-accent-text": "#c2410c",
      } as React.CSSProperties}
    >
      <PageHeader
        eyebrow="// INSTITUTIONAL TOOLS"
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
                "group p-6 bg-white border border-[#DEDDD8] rounded-xl transition-all duration-300 relative flex flex-col justify-between min-h-[220px] shadow-[0_2px_8px_rgba(0,0,0,0.03)]",
                isLocked
                  ? "opacity-75"
                  : "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#181818] border border-[#333330] rounded-none text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F8F8F8] border border-[#DEDDD8] rounded-lg">
                       <Lock className="w-3 h-3 text-[#555550]" />
                       <span className="text-[9px] font-mono uppercase tracking-wider text-[#555550]">{tool.minTier.toUpperCase()} Required</span>
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 border border-[#18B880] bg-[#ecfdf5] text-[#18B880] rounded-lg">
                       <span className="text-[9px] font-mono uppercase font-bold">Unlocked</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-[#1A1A1A]">{tool.title}</h3>
                  <p className="text-xs text-[#555550]">{tool.description}</p>
                  <p className="text-[10px] font-mono text-[#8A8A85] pt-1">{tool.bullet}</p>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="w-full h-10 bg-[#C8CBB8] animate-pulse" />
                ) : isLocked ? (
                  <Link 
                    href="/pricing"
                    className="flex items-center justify-center gap-1 w-full py-2.5 bg-[#181818] hover:bg-[#232323] text-white text-[10px] font-bold uppercase tracking-widest rounded-[4px] transition-colors"
                  >
                     Unlock with Edge+ <Lock className="w-3 h-3 text-[#F9771D]" />
                   </Link>
                ) : (
                  <Link 
                    href={tool.slug === 'intelligence' ? '/dashboard/market-intelligence' : `/dashboard/tools/${tool.slug}`}
                    className="flex items-center justify-between w-full px-5 py-2.5 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-[4px]"
                  >
                     Open Tool <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
