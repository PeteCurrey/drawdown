import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Star, Check, X, Shield, Info, ExternalLink, Zap, BarChart3, AlertTriangle } from "lucide-react";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";

export const metadata: Metadata = {
  title: "TradingView Review UK 2026 — Is It Worth It? | Drawdown",
  description: "We use TradingView every single day. Here's our completely honest review for UK traders — pricing, features, Pine Script, and whether the paid plans are worth it.",
};

export default function TradingViewReviewUK() {
  return (
    <div className="bg-background-primary min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border-slate/30 py-4 mb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/best" className="hover:text-accent transition-colors">Best</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary italic">TradingView Review</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* H1 + Offer Badge */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-accent text-background-primary text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap className="w-3 h-3 fill-current" /> $15 OFF Your First Plan via Drawdown
          </div>
          <h1 className="text-4xl md:text-8xl font-display font-black uppercase mb-8 leading-tight">
            TradingView <span className="text-accent italic">Review</span> 2026
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed font-medium mb-8">
            The honest verdict from daily users. We've spent thousands of hours on TradingView. Here is the truth about the pricing, the indicators, and whether the upgrade is actually worth your money.
          </p>
          <div className="p-4 bg-background-elevated border border-border-slate inline-flex items-center gap-4 mb-8">
             <div className="flex items-center gap-1 text-accent">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className="w-4 h-4 fill-current" />
               ))}
               <span className="text-xl font-display font-black ml-2">4.9/5</span>
             </div>
             <div className="w-px h-8 bg-border-slate/50" />
             <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Daily Usage: <span className="text-text-primary">8+ Hours</span>
             </div>
          </div>
          <AffiliateDisclosure />
        </div>

        {/* Quick Verdict Box */}
        <div className="bg-background-elevated border border-border-slate p-12 mb-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-display font-black text-accent/5 select-none uppercase">PETE</div>
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl font-display font-black uppercase mb-6 flex items-center gap-3">
              <span className="text-accent">//</span> Pete's Honest Take
            </h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed italic">
              "TradingView is the only software I use every single day without fail. While MetaTrader is for execution, TradingView is for intelligence. If you are serious about technical analysis, you cannot avoid this platform. But most people overpay for the Premium plan when 'Essential' is all they actually need."
            </p>
            <a 
              href="https://www.tradingview.com/?aff_id=165855"
              className="inline-flex items-center gap-4 bg-accent text-background-primary px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
            >
              Get $15 Off TradingView <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="mb-24">
          <h2 className="text-3xl font-display font-black uppercase mb-12 flex items-center gap-4">
            <span className="text-accent">//</span> Plans <span className="italic">Compared</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border-slate">
              <thead>
                <tr className="bg-background-surface border-b border-border-slate text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-center">
                  <th className="p-6 text-left border-r border-border-slate">Feature</th>
                  <th className="p-6">Free</th>
                  <th className="p-6 text-accent">Essential</th>
                  <th className="p-6">Plus</th>
                  <th className="p-6">Premium</th>
                </tr>
              </thead>
              <tbody className="text-[10px] font-mono uppercase text-center">
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Price (Approx)</td>
                  <td className="p-6">$0</td>
                  <td className="p-6 text-accent font-black">$12.95/mo</td>
                  <td className="p-6">$24.95/mo</td>
                  <td className="p-6">$49.95/mo</td>
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Indicators/Chart</td>
                  <td className="p-6">2</td>
                  <td className="p-6 text-accent font-black">5</td>
                  <td className="p-6">10</td>
                  <td className="p-6">25</td>
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Charts/Layout</td>
                  <td className="p-6">1</td>
                  <td className="p-6 text-accent font-black">2</td>
                  <td className="p-6">4</td>
                  <td className="p-6">8</td>
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Bar Replay</td>
                  <td className="p-6 text-loss">NO</td>
                  <td className="p-6 text-accent font-black">YES</td>
                  <td className="p-6 text-profit">YES</td>
                  <td className="p-6 text-profit">YES</td>
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">No Ads</td>
                  <td className="p-6 text-loss">ADS</td>
                  <td className="p-6 text-accent font-black">NO ADS</td>
                  <td className="p-6 text-profit">NO ADS</td>
                  <td className="p-6 text-profit">NO ADS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* What We Like / Don't Like */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="space-y-8">
            <h2 className="text-xl font-display font-black uppercase flex items-center gap-3">
              <span className="text-accent">//</span> What We Like
            </h2>
            <ul className="space-y-6">
              {[
                "Superior charting technology that works in any browser.",
                "Pine Script allows for incredible custom indicator builds.",
                "Massive community library of over 100k+ free indicators.",
                "Stable, cloud-based alerts that never miss a level."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                  <Check className="w-5 h-5 text-profit mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <h2 className="text-xl font-display font-black uppercase flex items-center gap-3">
              <span className="text-accent">//</span> The Drawbacks
            </h2>
            <ul className="space-y-6">
              {[
                "Direct trade execution is limited to specific brokers.",
                "Real-time data feeds for some exchanges cost extra.",
                "Customer support is only available for paid tiers.",
                "The 'Free' plan is heavily restricted with ads."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                  <X className="w-5 h-5 text-loss mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TradingView for UK Traders */}
        <div className="mb-32 p-12 bg-background-surface border border-border-slate relative overflow-hidden">
          <div className="max-w-4xl relative z-10">
            <h2 className="text-3xl font-display font-black uppercase mb-8">TradingView for UK Traders</h2>
            <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
              <p>
                In the UK, TradingView's utility is maximized when paired with a compatible broker. You can natively connect your <strong>Pepperstone</strong> or <strong>IG Markets</strong> account directly to TradingView, allowing you to execute spread bets and CFDs without leaving the chart.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <Link href="/how-to/use-tradingview-for-spread-betting" className="p-6 bg-background-elevated border border-border-slate hover:border-accent transition-premium group">
                  <span className="text-[10px] font-mono text-accent block mb-2 uppercase font-bold tracking-widest">Guide // 01</span>
                  <h4 className="text-sm font-black uppercase group-hover:text-accent transition-colors">How to Use TradingView for Spread Betting</h4>
                </Link>
                <Link href="/compare/tradingview-vs-prorealtime" className="p-6 bg-background-elevated border border-border-slate hover:border-accent transition-premium group">
                  <span className="text-[10px] font-mono text-accent block mb-2 uppercase font-bold tracking-widest">Comparison // 02</span>
                  <h4 className="text-sm font-black uppercase group-hover:text-accent transition-colors">TradingView vs ProRealTime</h4>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-32">
          <h2 className="text-xl font-display font-black uppercase mb-12 flex items-center gap-3">
            <span className="text-accent">//</span> TradingView FAQ
          </h2>
          <div className="max-w-3xl space-y-8">
            <div className="border-b border-border-slate pb-8">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">Is TradingView free?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Yes, there is a lifetime free plan. However, it is restricted to 2 indicators per chart and includes ads. For serious analysis, we recommend the 'Essential' tier.</p>
            </div>
            <div className="border-b border-border-slate pb-8">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">Can I trade directly from TradingView in the UK?</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Yes, if you use a supported broker like Pepperstone or IG. You simply connect your broker account in the 'Trading Panel' at the bottom of the screen.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-32 border-t border-border-slate/30">
          <h2 className="text-5xl md:text-8xl font-display font-black uppercase mb-12">Upgrade <span className="text-accent italic">Today</span></h2>
          <p className="max-w-2xl mx-auto text-text-secondary mb-16 text-lg">
            Stop limiting your analysis. Get $15 off your first TradingView plan when you upgrade via Drawdown.
          </p>
          <a 
            href="https://www.tradingview.com/?aff_id=165855"
            className="inline-flex items-center gap-4 bg-accent text-background-primary px-16 py-6 text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
          >
            Claim Your $15 Discount <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
