import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { IntelligenceFeed } from "@/components/dashboard/IntelligenceFeed";
import { PetesDailyTakeExcerpt } from "@/components/home/PetesDailyTakeExcerpt";
import { MessageSquare, Users, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Community Hub — Drawdown Intelligence",
  description: "Join the professional trading community. Live market intelligence, institutional signals, and exclusive updates from the Drawdown team.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <div className="pt-24 pb-20 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">Community <span className="text-accent">Hub.</span></h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-widest">Connect. Analyze. Survive.</p>
        </header>

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
            <div className="p-8 bg-background-elevated border border-border-slate space-y-6">
              <h3 className="text-xl font-display font-bold uppercase border-b border-border-slate pb-4">Network Status</h3>
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
            <div className="p-8 bg-background-surface border border-border-slate space-y-6">
              <h3 className="text-xl font-display font-bold uppercase">Quick Resources</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/tools/journal" className="text-xs font-bold uppercase tracking-widest text-text-primary hover:text-accent transition-colors flex items-center justify-between">
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
