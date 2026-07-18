import { Metadata } from "next";
import { ShieldCheck, Scale, Search, PenTool, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Standards | Drawdown",
  description: "Our strict editorial guidelines for ensuring accuracy, objectivity, and truth in all Drawdown publications.",
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
          <h3 className="text-xl font-bold font-display uppercase">1. Absolute Objectivity</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            We do not accept paid placements for broker reviews, proprietary trading firm rankings, or algorithmic tool recommendations. If a tool or broker is fundamentally flawed, we will state it clearly.
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <Database className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">2. Data-Driven Claims</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            All trading performance claims, statistics, and backtested results must be verifiable. We do not use dummy variables, fabricated success rates, or "placeholder" wins to drive engagement.
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <Search className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">3. Rigorous Fact-Checking</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            Every piece of macroeconomic analysis and quantitative research is reviewed by the Drawdown Research Desk before publication. We cross-reference our data with primary sources (e.g., central bank releases, order flow data).
          </p>
        </div>

        <div className="p-8 bg-background-surface border border-border-slate/50 rounded-2xl space-y-4">
          <PenTool className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold font-display uppercase">4. Transparent Corrections</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            In the event that an error is published, it will be corrected promptly. A timestamped correction notice will be appended to the bottom of the article detailing what was changed and why.
          </p>
        </div>
      </section>

      {/* Author Accountability */}
      <section className="pt-12 border-t border-border-slate/50 space-y-6">
        <h2 className="text-2xl font-bold font-display uppercase">Author Accountability</h2>
        <p className="text-text-secondary leading-relaxed">
          All authors at Drawdown are required to trade live capital using the principles they teach. We do not employ "content writers" to produce trading material. Our contributors are active participants in the foreign exchange and equities markets, blending institutional frameworks with retail execution.
        </p>
        <p className="text-text-secondary leading-relaxed">
          When you read an article under the Drawdown banner, it is the result of genuine market experience, statistical validation, and cold, hard reality.
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
