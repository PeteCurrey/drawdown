import { Metadata } from "next";
import { ShieldCheck, Scale, Search, PenTool, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Standards | Drawdown",
  description: "Our strict editorial guidelines for ensuring accuracy, objectivity, transparency, and truth in all Drawdown market analysis and publications.",
};

export default function EditorialStandardsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl space-y-16 animate-in fade-in duration-1000">
      
      {/* Header */}
      <section className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4 border border-accent/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-text-primary">
          Editorial Standards
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          "Trade the Truth." It is not just a slogan; it is the fundamental law of Drawdown. We have zero tolerance for fabricated claims, hidden sponsorships, or retail noise.
        </p>
      </section>

      {/* Core Principles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <Scale className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">1. Honest affiliate disclosure</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            We earn commissions from some of the tools and platforms we recommend — currently TradingView and FTMO, with further broker and prop firm partnerships in application. Every affiliate link is disclosed on the page it appears, and pages state clearly when a link is not an affiliate link. Commissions never determine rankings: we rank on merit, and we only recommend platforms we've personally used or thoroughly researched.
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <Database className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">2. No fabricated performance claims</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            We do not publish invented win rates, backtested results we haven't run, or "typical member returns." Where live data feeds power a widget, if the feed fails, the widget hides — we never fall back to placeholder numbers. Where educational examples use hypothetical trades, they are labelled hypothetical.
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <Search className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">3. Written by a trader, checked before publish</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            All content is written by Pete Currey (founder, active trader based in Chesterfield, UK) and reviewed against primary sources — central bank statements, exchange data, broker documentation — before publishing. AI tools assist with drafting and fact-checking; final review and publish decisions are Pete's.
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <PenTool className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">4. Corrections logged in public</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            When we get something wrong, the article gets a timestamped correction notice at the bottom saying what changed and when. A running corrections log is maintained at <a href="/editorial-standards/corrections" className="text-accent hover:underline">/editorial-standards/corrections</a>.
          </p>
        </div>
      </section>

      {/* Who writes Drawdown */}
      <section className="pt-12 border-t border-border-slate/50 space-y-6">
        <h2 className="text-2xl font-bold font-display uppercase">Who writes Drawdown</h2>
        <p className="text-text-secondary leading-relaxed">
          Drawdown is written by Pete Currey, founder and sole author. Pete is an active retail trader based in Chesterfield, UK, writing from lived market experience. To learn more about Pete's background, visit the <a href="/about" className="text-accent hover:underline">About page</a>.
        </p>
      </section>

      {/* Financial Disclaimer */}
      <section className="p-6 bg-loss/5 border border-loss/20 rounded-xl mt-12">
        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-loss mb-2">Financial Disclaimer</h4>
        <p className="text-xs text-text-tertiary leading-relaxed">
          Drawdown Trading provides educational resources and market intelligence, not financial advice. Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange, you should carefully consider your investment objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. You should be aware of all the risks associated with foreign exchange trading and seek advice from an independent financial advisor if you have any doubts.
        </p>
      </section>

    </div>
  );
}
