import React from "react";
import Link from "next/link";
import { Shield, Star, Check, X, ExternalLink, ChevronRight, Info, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { Broker } from "@/data/brokers";

interface FAQItem {
  question: string;
  answer: string;
}

interface ReviewContent {
  overview: string;
  accountTypes: string;
  platformsTools: string;
  feesCosts: string;
  regulationSafety: string;
  whoShouldUse: string[];
  whoShouldNotUse: string[];
  whoShouldNotUseLong: string;
  verdict: string;
  faqs: FAQItem[];
}

interface BrokerReviewTemplateProps {
  broker: Broker;
  content: ReviewContent;
  slug: string;
}

export function BrokerReviewTemplate({
  broker,
  content,
  slug
}: BrokerReviewTemplateProps) {
  return (
    <div className="bg-background-primary min-h-screen pb-24">
      {/* 1. Breadcrumb */}
      <div className="border-b border-border-slate/30 py-4 mb-12 pt-32">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/brokers" className="hover:text-accent transition-colors">Brokers</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary italic">{broker.name} Review</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* 2. H1 */}
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-7xl font-display font-black uppercase mb-8 leading-tight">
            {broker.name} Review 2026 — <span className="text-accent italic">Is It Worth It?</span>
          </h1>
          <AffiliateDisclosure />
        </div>

        {/* 3. Quick Verdict Box */}
        <div className="bg-background-surface border border-border-slate p-8 md:p-12 mb-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-display font-black text-accent/5 select-none uppercase pointer-events-none">VERDICT</div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-border-slate pb-8 md:pb-0 md:pr-12">
              <div className="w-20 h-20 bg-background-elevated border border-border-slate flex items-center justify-center text-3xl font-black mb-4">
                {broker.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1 mb-2 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(broker.rating) ? "fill-current" : "text-text-tertiary")} />
                ))}
              </div>
              <span className="text-2xl font-display font-black">{broker.rating} / 5.0</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-display font-black uppercase mb-4 flex items-center gap-3">
                <span className="text-accent">//</span> Pete's Honest Take
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed italic mb-0">
                "{broker.oneLine}"
              </p>
            </div>
            <div className="md:w-1/4 w-full">
              <a 
                href={`/go/${broker.slug}`}
                className="w-full py-5 bg-accent text-background-primary text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
              >
                Open Account <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-24">
            {/* 4. Overview */}
            <section id="overview" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">01 //</span> Overview
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{content.overview}</p>
              </div>
            </section>

            {/* 5. Key Stats Table */}
            <section id="stats" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">02 //</span> Key Stats at a Glance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border-slate">
                  <tbody className="text-[10px] font-mono uppercase">
                    {[
                      { label: "Regulation", value: broker.fcaRegulated ? "FCA (UK) + Global" : "Global/Offshore" },
                      { label: "Min Deposit", value: broker.minDeposit },
                      { label: "Spreads From", value: broker.spreads },
                      { label: "Platforms", value: broker.platforms.join(", ") },
                      { label: "Execution", value: "No Dealing Desk / ECN" },
                      { label: "Assets", value: "Forex, Indices, Stocks, Commodities" }
                    ].map((stat, i) => (
                      <tr key={i} className="border-b border-border-slate/50">
                        <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30 w-1/3">{stat.label}</td>
                        <td className="p-6 text-text-primary">{stat.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Pros & Cons */}
            <section id="pros-cons" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-display font-black uppercase flex items-center gap-3">
                  <span className="text-profit">//</span> What We Like
                </h3>
                <ul className="space-y-4">
                  {broker.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <Check className="w-5 h-5 text-profit mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-display font-black uppercase flex items-center gap-3">
                  <span className="text-loss">//</span> What We Don't Like
                </h3>
                <ul className="space-y-4">
                  {broker.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <X className="w-5 h-5 text-loss mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 7. Account Types */}
            <section id="accounts" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">03 //</span> Account Types
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed">
                <p className="whitespace-pre-line">{content.accountTypes}</p>
              </div>
            </section>

            {/* 8. Platforms & Tools */}
            <section id="platforms" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">04 //</span> Platforms & Tools
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed">
                <p className="whitespace-pre-line">{content.platformsTools}</p>
              </div>
            </section>

            {/* 9. Fees & Costs */}
            <section id="fees" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">05 //</span> Fees & Costs
              </h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed">
                <p className="whitespace-pre-line">{content.feesCosts}</p>
              </div>
            </section>

            {/* 10. Regulation & Safety */}
            <section id="regulation" className="scroll-mt-32">
              <h2 className="text-3xl font-display font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">06 //</span> Regulation & Safety
              </h2>
              <div className="p-8 bg-profit/5 border border-profit/20 mb-8 flex items-center gap-6">
                <Shield className="w-12 h-12 text-profit" />
                <div>
                  <h4 className="text-lg font-display font-black uppercase text-text-primary">Directly Regulated</h4>
                  <p className="text-xs text-text-secondary">This broker is authorized and regulated by the FCA (Financial Conduct Authority) in the UK.</p>
                </div>
              </div>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed">
                <p className="whitespace-pre-line">{content.regulationSafety}</p>
              </div>
            </section>

            {/* 11. Who Should Use / NOT Use */}
            <section id="audience" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-10 bg-background-surface border border-border-slate">
                <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3">
                  <Check className="w-6 h-6 text-profit" /> Good Fit For
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-text-primary uppercase tracking-tight flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-profit mt-1.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-10 bg-background-surface border border-border-slate">
                <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3">
                  <X className="w-6 h-6 text-loss" /> Not A Good Fit
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldNotUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-text-secondary uppercase tracking-tight flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-loss/30 mt-1.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="who-not" className="scroll-mt-32">
               <h3 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3 text-loss">
                 <AlertTriangle className="w-6 h-6" /> Who Should NOT Use {broker.name}?
               </h3>
               <p className="text-sm text-text-secondary leading-relaxed italic">
                 {content.whoShouldNotUseLong}
               </p>
            </section>

            {/* 12. The Verdict */}
            <section id="verdict" className="scroll-mt-32 border-t border-border-slate pt-24">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-8">The <span className="text-accent italic">Verdict</span></h2>
              <div className="prose prose-invert prose-slate max-w-none text-text-secondary leading-relaxed mb-12">
                <p className="whitespace-pre-line text-lg font-medium">{content.verdict}</p>
              </div>
              <a 
                href={`/go/${broker.slug}`}
                className="inline-flex items-center gap-4 bg-accent text-background-primary px-16 py-6 text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
              >
                Join {broker.name} Today <ExternalLink className="w-4 h-4" />
              </a>
            </section>

            {/* 13. FAQ */}
            <section id="faq" className="scroll-mt-32 pt-24">
              <h2 className="text-3xl font-display font-black uppercase mb-12 flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-accent" /> Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-border-slate pb-8">
                    <h3 className="text-lg font-bold text-text-primary uppercase tracking-tight mb-4">{faq.question}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar / Table of Contents */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-background-surface border border-border-slate">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-text-tertiary mb-6">// ON THIS PAGE</h4>
                <nav className="space-y-4">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "stats", label: "Key Stats" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    { id: "accounts", label: "Account Types" },
                    { id: "platforms", label: "Platforms" },
                    { id: "fees", label: "Fees & Costs" },
                    { id: "regulation", label: "Regulation" },
                    { id: "verdict", label: "Final Verdict" },
                    { id: "faq", label: "FAQs" }
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-accent/5 border border-accent/20">
                <h4 className="text-xl font-display font-black uppercase text-text-primary mb-4">Start Trading</h4>
                <p className="text-xs text-text-secondary mb-8 leading-relaxed">
                  Join {broker.name} via Drawdown and gain professional-grade execution on global markets.
                </p>
                <a 
                  href={`/go/${broker.slug}`}
                  className="w-full py-4 bg-accent text-background-primary text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
                >
                  Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
