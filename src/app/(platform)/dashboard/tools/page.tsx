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
    description: "Test your edge against 3 years of data.",
    icon: History,
    minTier: "edge",
    bullet: "Comprehensive parameters and historic execution sandbox"
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8CBB8] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F9771D]">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Institutional_Tools</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            AI Tools
          </h1>
          <p className="text-sm text-[#555550]">
            Purpose-built for traders. Not demos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appTools.map((tool) => {
          const Icon = tool.icon;
          const isLocked = tierWeight[userTier] < tierWeight[tool.minTier];

          return (
            <div 
              key={tool.slug} 
              className={cn(
                "group p-6 bg-[#DADDCD] border border-[#C8CBB8] rounded-none transition-all duration-300 relative flex flex-col justify-between min-h-[220px]",
                isLocked 
                  ? "opacity-75" 
                  : "hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#181818] border border-[#333330] rounded-none text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#181818] border border-[#333330] text-white">
                       <Lock className="w-3 h-3 text-[#F9771D]" />
                       <span className="text-[9px] font-mono uppercase tracking-wider">{tool.minTier.toUpperCase()} Required</span>
                    </div>
                  ) : (
                    <div className="px-2 py-0.5 border border-[#18B880] bg-transparent text-[#18B880]">
                       <span className="text-[9px] font-mono uppercase font-bold">Free</span>
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
