import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { IntelligenceFeed } from "@/components/dashboard/IntelligenceFeed";
import { PetesDailyTakeExcerpt } from "@/components/home/PetesDailyTakeExcerpt";
import { MessageSquare, Users, TrendingUp, Shield } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export const metadata: Metadata = getMetadata({
  title: "Community Hub — Drawdown Intelligence",
  description: "Join the professional trading community. Live market intelligence, institutional signals, and exclusive updates from the Drawdown team.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <div
      className="space-y-8 min-h-screen"
      style={{
        "--tool-accent": "#0ea5e9",
        "--tool-accent-hover": "#0284c7",
        "--tool-accent-tint": "#f0f9ff",
        "--tool-accent-border": "#bae6fd",
        "--tool-accent-text": "#0369a1",
      } as React.CSSProperties}
    >
      <PageHeader
        eyebrow="// DISCIPLINE & SIGNAL NETWORK"
        title="Community Hub"
        description="Connect with serious traders, analyze macroeconomic setups, and share execution feedback."
      />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-background-surface border border-border-slate p-8">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-display font-bold uppercase">The Wire</h2>
              </div>
              {/* Reuse the excerpt component but in a more detailed way if needed */}
              <div className="bg-background-elevated/50 p-6 border-l-2 border-accent">
                <PetesDailyTakeExcerpt />
              </div>
            </section>

            <section>
              <IntelligenceFeed />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Stats Card */}
            <div className="p-6 bg-white border border-[#DEDDD8] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] space-y-6">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#DEDDD8] pb-4">Network Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-text-tertiary" />
                    <span className="text-[10px] font-mono uppercase text-text-secondary">Active Traders</span>
                  </div>
                  <span className="text-sm font-bold font-mono">1,248</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-text-tertiary" />
                    <span className="text-[10px] font-mono uppercase text-text-secondary">Signals (24h)</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-profit">+14</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-text-tertiary" />
                    <span className="text-[10px] font-mono uppercase text-text-secondary">Uptime</span>
                  </div>
                  <span className="text-sm font-bold font-mono">99.9%</span>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="p-6 bg-[#F8F8F8] border border-[#DEDDD8] rounded-xl space-y-6">
              <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">Quick Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/dashboard/journal" className="text-xs font-mono font-bold uppercase tracking-widest text-[#555550] hover:text-[#1A1A1A] transition-colors flex items-center justify-between">
                    AI Trade Journal <ArrowRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="/dashboard/tools/technical-scanner" className="text-xs font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors flex items-center justify-between">
                    Technical Scanner <ArrowRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="/learn-to-trade" className="text-xs font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors flex items-center justify-between">
                    Education Hub <ArrowRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
