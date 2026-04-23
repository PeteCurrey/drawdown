import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Shield, Search, Info, TrendingUp, BarChart3 } from "lucide-react";
import { propFirms } from "@/data/prop-firms";
import { PropFirmCard } from "@/components/ui/PropFirmCard";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";

export const metadata: Metadata = {
  title: "Best Prop Trading Firms 2026 — Honest Reviews | Drawdown",
  description: "The most honest prop firm comparison on the internet. No sponsored rankings. We evaluate challenge rules, payout reliability, and real trader feedback.",
};

export default function PropFirmsIndex() {
  return (
    <div className="bg-background-primary min-h-screen">
      {/* Hero Header */}
      <div className="pt-32 pb-16 border-b border-border-slate/30">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-12">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary italic">Prop Firms</span>
          </nav>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-display font-black uppercase mb-8 leading-none">
              Prop <span className="text-accent italic">Trading</span> Firms
            </h1>
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed font-medium mb-8">
              The honest comparison. Most sites rank firms based on payout CPA. We rank them based on drawdown rules, payout history, and institutional reliability.
            </p>
            <AffiliateDisclosure />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-start">
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
            <h2 className="text-xl font-display font-black uppercase flex items-center gap-3 text-text-primary">
              <span className="text-accent">//</span> The Honest Risk Picture
            </h2>
            <p>
              Prop firm trading (funded account challenges) has exploded in popularity because it offers a shortcut to large trading capital. For a fee of $100–$500, you can gain access to accounts ranging from $10,000 to $200,000.
            </p>
            <p className="p-6 border-l-2 border-loss bg-loss/5 italic">
              "The reality is that over 90% of traders fail their challenges. These firms are businesses built on statistical failure. If you don't have a proven strategy and disciplined risk management, you are simply donating your fee to the firm."
            </p>
          </div>
          <div className="bg-background-surface border border-border-slate p-8 space-y-6">
            <h2 className="text-xl font-display font-black uppercase flex items-center gap-3 text-text-primary">
              <span className="text-accent">//</span> Evaluation Pillars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Shield className="w-5 h-5 text-accent" />
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Reliability</p>
                <p className="text-xs text-text-tertiary">Historical payout proof and firm age.</p>
              </div>
              <div className="space-y-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Ruleset</p>
                <p className="text-xs text-text-tertiary">Trailing vs static drawdown transparency.</p>
              </div>
              <div className="space-y-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Scaling</p>
                <p className="text-xs text-text-tertiary">Ability to reach $1M+ funding.</p>
              </div>
              <div className="space-y-2">
                <Search className="w-5 h-5 text-accent" />
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Support</p>
                <p className="text-xs text-text-tertiary">Response time during news volatility.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Firms Grid */}
        <div className="mb-32">
          <h2 className="text-3xl font-display font-black uppercase mb-12 flex items-center gap-4">
            <span className="text-accent">//</span> Featured <span className="italic">Firms</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propFirms.map((firm) => (
              <PropFirmCard 
                key={firm.id} 
                firm={firm} 
                isPetesPick={firm.id === "the5ers"} 
                source="prop_firms_index"
              />
            ))}
          </div>
        </div>

        {/* Methodology Section */}
        <div className="mb-32 p-12 bg-background-elevated border border-border-slate relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 max-w-4xl">
            <h2 className="text-3xl font-display font-black uppercase mb-8">How We Evaluate Prop Firms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-text-secondary leading-relaxed">
              <div className="space-y-4">
                <p>
                  Most comparison sites are owned by the firms they rank, or they rank solely based on who pays the highest commission. At Drawdown, we use an objective scoring model that prioritizes <strong>Payout Reliability</strong> over all other factors.
                </p>
                <p>
                  A challenge fee is only worth it if the firm actually pays out when you win. We monitor community payout reports and firm solvency continuously.
                </p>
              </div>
              <div className="space-y-4">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <span><strong>Static Drawdown:</strong> We penalize firms that use trailing drawdown on live accounts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-accent mt-1 shrink-0" />
                    <span><strong>Trust Score:</strong> Minimum 2 years of operation for a 4+ star rating.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-24 border-t border-border-slate/30">
          <h2 className="text-4xl font-display font-black uppercase mb-8">Before You Buy A Challenge</h2>
          <p className="max-w-2xl mx-auto text-text-secondary mb-12">
            Make sure your strategy can actually handle the strict drawdown rules. Use our backtester to validate your edge before risking your capital.
          </p>
          <Link 
            href="/tools/strategy-backtester"
            className="inline-flex items-center gap-3 bg-accent text-background-primary px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
          >
            Validate Your Strategy <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      {/* Footer Disclosure - Required per spec */}
      <div className="border-t border-border-slate/30 bg-background-surface py-12">
        <div className="container mx-auto px-6">
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-[0.2em] max-w-4xl leading-relaxed">
            Drawdown may earn a commission if you purchase a challenge via our links. Prop firm trading involves significant risk of losing your challenge fee. We only recommend firms we have evaluated against objective criteria. Past challenge pass rates are not indicative of your results.
          </p>
        </div>
      </div>
    </div>
  );
}
