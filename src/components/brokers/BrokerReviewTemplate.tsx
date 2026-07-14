import React from "react";
import Link from "next/link";
import { Shield, Star, Check, X, ExternalLink, ChevronRight, AlertTriangle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { Broker } from "@/data/brokers";
import { getRelatedLinks } from "@/lib/linking";
import { LeadMagnet } from "@/components/seo/LeadMagnet";

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
  fundingMethods?: string;
  suitabilitySummary?: string;
  alternatives?: { name: string; slug: string; rating: number; bestFor: string }[];
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
    <div className="bg-white min-h-screen pb-24">
      {/* 1. Breadcrumb */}
      <div className="border-b border-mkt-bd/30 py-4 mb-12 pt-32">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/brokers" className="hover:text-accent transition-colors">Brokers</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-mkt-ink italic">{broker.name} Review</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* 2. H1 */}
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase mb-8 leading-tight">
            {broker.name} Review 2026 — <span className="text-accent italic">Is It Worth It?</span>
          </h1>
          <AffiliateDisclosure />
        </div>

        {/* 3. Quick Verdict Box */}
        <div className="bg-white border border-mkt-bd p-8 md:p-12 mb-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-9xl font-sans font-black text-accent/5 select-none uppercase pointer-events-none">VERDICT</div>
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/4 flex flex-col items-center border-b md:border-b-0 md:border-r border-mkt-bd pb-8 md:pb-0 md:pr-12">
              <div className="w-20 h-20 bg-[#F7F7F7] border border-mkt-bd flex items-center justify-center text-3xl font-black mb-4">
                {broker.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1 mb-2 text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < Math.floor(broker.rating) ? "fill-current" : "text-mkt-i4")} />
                ))}
              </div>
              <span className="text-2xl font-sans font-black">{broker.rating} / 5.0</span>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-xl font-sans font-black uppercase mb-4 flex items-center gap-3">
                <span className="text-accent">{"//"}</span> Pete&apos;s Honest Take
              </h3>
              <p className="text-lg text-mkt-i2 leading-relaxed italic mb-0">
                &quot;{broker.oneLine}&quot;
              </p>
            </div>
            <div className="md:w-1/4 w-full">
              <a 
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
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
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">01 //</span> Overview
              </h2>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed space-y-6">
                <p className="whitespace-pre-line">{content.overview}</p>
              </div>
            </section>

            {/* 5. Key Stats Table */}
            <section id="stats" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">02 //</span> Key Stats at a Glance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-mkt-bd">
                  <tbody className="text-[10px] font-mono uppercase">
                    {[
                      { label: "Regulation", value: broker.fcaRegulated ? "FCA (UK) + Global" : "Global/Offshore" },
                      { label: "Min Deposit", value: broker.minDeposit },
                      { label: "Spreads From", value: broker.spreads },
                      { label: "Platforms", value: broker.platforms.join(", ") },
                      { label: "Execution", value: "No Dealing Desk / ECN" },
                      { label: "Assets", value: "Forex, Indices, Stocks, Commodities" }
                    ].map((stat, i) => (
                      <tr key={i} className="border-b border-mkt-bd/50">
                        <td className="p-6 text-left font-bold border-r border-mkt-bd bg-white/30 w-1/3">{stat.label}</td>
                        <td className="p-6 text-mkt-ink">{stat.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. Pros & Cons */}
            <section id="pros-cons" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-mkt-grn">{"//"}</span> What We Like
                </h3>
                <ul className="space-y-4">
                  {broker.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <Check className="w-5 h-5 text-mkt-grn mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-sans font-black uppercase flex items-center gap-3">
                  <span className="text-red-500">{"//"}</span> What We Don&apos;t Like
                </h3>
                <ul className="space-y-4">
                  {broker.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-mkt-i2 leading-relaxed">
                      <X className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 7. Account Types */}
            <section id="accounts" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">03 //</span> Account Types
              </h2>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed">
                <p className="whitespace-pre-line">{content.accountTypes}</p>
              </div>
            </section>

            {/* 8. Platforms & Tools */}
            <section id="platforms" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">04 //</span> Platforms & Tools
              </h2>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed">
                <p className="whitespace-pre-line">{content.platformsTools}</p>
              </div>
            </section>

            {/* 9. Fees & Costs */}
            <section id="fees" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">05 //</span> Fees & Costs
              </h2>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed">
                <p className="whitespace-pre-line">{content.feesCosts}</p>
              </div>
            </section>

            {/* Funding Methods */}
            {content.fundingMethods && (
              <section id="funding" className="scroll-mt-32">
                <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                  <span className="text-accent text-sm font-mono tracking-tighter">06 //</span> Funding & Payments
                </h2>
                <div className="prose max-w-none text-mkt-i2 leading-relaxed">
                  <p className="whitespace-pre-line">{content.fundingMethods}</p>
                </div>
              </section>
            )}

            {/* 10. Regulation & Safety */}
            <section id="regulation" className="scroll-mt-32">
              <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">07 //</span> Regulation & Safety
              </h2>
              <div className="p-8 bg-profit/5 border border-profit/20 mb-8 flex items-center gap-6">
                <Shield className="w-12 h-12 text-mkt-grn" />
                <div>
                  <h4 className="text-lg font-sans font-black uppercase text-mkt-ink">Directly Regulated</h4>
                  <p className="text-xs text-mkt-i2">This broker is authorized and regulated by the FCA (Financial Conduct Authority) in the UK.</p>
                </div>
              </div>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed">
                <p className="whitespace-pre-line">{content.regulationSafety}</p>
              </div>
            </section>

            {/* Suitability Summary */}
            {content.suitabilitySummary && (
              <div className="p-8 bg-[#F7F7F7] border border-mkt-bd">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-accent mb-4">{"//"} Trader Suitability</h4>
                <p className="text-sm text-mkt-i2 leading-relaxed italic m-0">
                  {content.suitabilitySummary}
                </p>
              </div>
            )}

            {/* 11. Who Should Use / NOT Use */}
            <section id="audience" className="scroll-mt-32 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-10 bg-white border border-mkt-bd">
                <h3 className="text-xl font-sans font-black uppercase mb-6 flex items-center gap-3">
                  <Check className="w-6 h-6 text-mkt-grn" /> Good Fit For
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-mkt-ink uppercase tracking-tight flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-profit mt-1.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-10 bg-white border border-mkt-bd">
                <h3 className="text-xl font-sans font-black uppercase mb-6 flex items-center gap-3">
                  <X className="w-6 h-6 text-red-500" /> Not A Good Fit
                </h3>
                <ul className="space-y-4">
                  {content.whoShouldNotUse.map((item, i) => (
                    <li key={i} className="text-xs font-bold text-mkt-i2 uppercase tracking-tight flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-loss/30 mt-1.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="who-not" className="scroll-mt-32">
               <h3 className="text-xl font-sans font-black uppercase mb-6 flex items-center gap-3 text-red-500">
                 <AlertTriangle className="w-6 h-6" /> Who Should NOT Use {broker.name}?
               </h3>
               <p className="text-sm text-mkt-i2 leading-relaxed italic">
                 {content.whoShouldNotUseLong}
               </p>
            </section>

            {/* Alternatives */}
            {content.alternatives && content.alternatives.length > 0 && (
              <section id="alternatives" className="scroll-mt-32 border-t border-mkt-bd pt-24">
                <h2 className="text-3xl font-sans font-black uppercase mb-8 flex items-center gap-4">
                  <span className="text-accent text-sm font-mono tracking-tighter">08 //</span> Top Alternatives
                </h2>
                <p className="text-sm text-mkt-i2 mb-8 leading-relaxed">
                  If {broker.name} doesn&apos;t fit your trading style, consider these highly-rated alternatives:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.alternatives.map((alt) => (
                    <div key={alt.slug} className="p-8 bg-white border border-mkt-bd flex flex-col justify-between hover:border-accent transition-colors">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-sans font-black uppercase tracking-tight text-mkt-ink">{alt.name}</h4>
                          <span className="text-xs font-mono font-bold text-accent">★ {alt.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-mkt-i2 leading-relaxed">{alt.bestFor}</p>
                      </div>
                      <div className="pt-6">
                        <Link
                          href={`/brokers/${alt.slug}`}
                          className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent hover:text-mkt-ink transition-colors flex items-center gap-1 inline-flex"
                        >
                          Read Review <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 12. The Verdict */}
            <section id="verdict" className="scroll-mt-32 border-t border-mkt-bd pt-24">
              <h2 className="text-4xl md:text-6xl font-sans font-black uppercase mb-8">The <span className="text-accent italic">Verdict</span></h2>
              <div className="prose max-w-none text-mkt-i2 leading-relaxed mb-12">
                <p className="whitespace-pre-line text-lg font-medium">{content.verdict}</p>
              </div>
              <a 
                href={`/go/${broker.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-mkt-ink text-white px-16 py-6 text-sm font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
              >
                Join {broker.name} Today <ExternalLink className="w-4 h-4" />
              </a>
            </section>

            {/* 13. FAQ */}
            <section id="faq" className="scroll-mt-32 pt-24">
              <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
                <HelpCircle className="w-8 h-8 text-accent" /> Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-mkt-bd pb-8">
                    <h3 className="text-lg font-bold text-mkt-ink uppercase tracking-tight mb-4">{faq.question}</h3>
                    <p className="text-sm text-mkt-i2 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related items / Topic clusters */}
            <section id="related" className="scroll-mt-32 pt-24 border-t border-mkt-bd">
              <h2 className="text-3xl font-sans font-black uppercase mb-12 flex items-center gap-4">
                <span className="text-accent text-sm font-mono tracking-tighter">09 //</span> Related Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getRelatedLinks(`/brokers/${slug}`).map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href}
                    className="p-6 border border-mkt-bd hover:border-accent bg-white flex flex-col justify-between group transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-accent font-bold">[{link.category}]</span>
                      <h4 className="text-sm font-black uppercase text-mkt-ink group-hover:text-accent transition-colors leading-tight">{link.title}</h4>
                    </div>
                    <div className="pt-4 text-[8px] font-mono font-bold uppercase tracking-widest text-mkt-i4 flex items-center gap-1 inline-flex">
                      Explore <ChevronRight className="w-3.5 h-3.5 text-accent" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Lead Magnet box */}
            <div className="pt-24 border-t border-mkt-bd">
              <LeadMagnet 
                resourceId="risk-guide"
                title="Download Pete's Risk Management PDF Guide"
                description="Equip yourself with the same risk management sheet and volatility boundaries that our trading desk utilizes daily."
              />
            </div>
          </div>

          {/* Sidebar / Table of Contents */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-white border border-mkt-bd">
                <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-mkt-i4 mb-6">{"//"} ON THIS PAGE</h4>
                <nav className="space-y-4">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "stats", label: "Key Stats" },
                    { id: "pros-cons", label: "Pros & Cons" },
                    { id: "accounts", label: "Account Types" },
                    { id: "platforms", label: "Platforms" },
                    { id: "fees", label: "Fees & Costs" },
                    ...(content.fundingMethods ? [{ id: "funding", label: "Funding & Payments" }] : []),
                    { id: "regulation", label: "Regulation" },
                    ...(content.alternatives && content.alternatives.length > 0 ? [{ id: "alternatives", label: "Alternatives" }] : []),
                    { id: "verdict", label: "Final Verdict" },
                    { id: "faq", label: "FAQs" },
                    { id: "related", label: "Related Resources" }
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="block text-[10px] font-bold uppercase tracking-widest text-mkt-i2 hover:text-accent transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="p-8 bg-accent/5 border border-accent/20">
                <h4 className="text-xl font-display font-black uppercase text-mkt-ink mb-4">Start Trading</h4>
                <p className="text-xs text-mkt-i2 mb-8 leading-relaxed">
                  Join {broker.name} via Drawdown and gain professional-grade execution on global markets.
                </p>
                <a 
                  href={`/go/${broker.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-mkt-ink text-white text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-2"
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
