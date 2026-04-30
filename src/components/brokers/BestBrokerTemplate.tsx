import React from "react";
import Link from "next/link";
import { Shield, ChevronRight, Check, X, ExternalLink, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AffiliateDisclosure } from "@/components/seo/AffiliateDisclosure";
import { Broker } from "@/data/brokers";

interface FAQItem {
  question: string;
  answer: string;
}

interface BestBrokerTemplateProps {
  title: string;
  intro: string;
  whoIsNotFor: string;
  topPickId: string; // The broker ID for "Pete's Pick"
  brokers: Broker[];
  top3Ids: string[]; // IDs for the quick-pick table
  methodology: string;
  faqs: FAQItem[];
  relatedPages: { title: string; href?: string; slug?: string }[];
  slug: string;
}

export function BestBrokerTemplate({
  title,
  intro,
  whoIsNotFor,
  topPickId,
  brokers,
  top3Ids,
  methodology,
  faqs,
  relatedPages,
  slug
}: BestBrokerTemplateProps) {
  const top3Brokers = brokers.filter(b => top3Ids.includes(b.id));
  
  return (
    <div className="bg-background-primary min-h-screen pb-24">
      {/* 1. Breadcrumb */}
      <div className="border-b border-border-slate/30 py-4 mb-12">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/best" className="hover:text-accent transition-colors">Best</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary italic">{title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* 2. H1 + Intro */}
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-7xl font-display font-black uppercase mb-8 leading-tight">
            {title}
          </h1>
          <div className="space-y-6 text-sm text-text-secondary leading-relaxed">
            <p>{intro}</p>
            <div className="p-6 border-l-2 border-accent bg-accent/5 italic font-medium text-text-primary">
              "{whoIsNotFor}"
            </div>
          </div>
        </div>

        {/* 3. Affiliate Disclosure */}
        <AffiliateDisclosure className="mb-16" />

        {/* 4. Quick-pick Table */}
        <div className="mb-24">
          <h2 className="text-xl font-display font-black uppercase mb-8 flex items-center gap-3">
            <span className="text-accent">//</span> Quick Picks
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border-slate">
              <thead>
                <tr className="bg-background-surface border-b border-border-slate text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-left">
                  <th className="p-6">Broker</th>
                  <th className="p-6">Regulation</th>
                  <th className="p-6">Min Deposit</th>
                  <th className="p-6">Key Feature</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-xs uppercase font-bold tracking-tight">
                {top3Brokers.map((broker) => (
                  <tr key={broker.id} className="border-b border-border-slate/50 hover:bg-background-surface transition-colors">
                    <td className="p-6 flex items-center gap-4">
                      <div className="w-8 h-8 bg-background-elevated border border-border-slate flex items-center justify-center text-[10px] font-black">
                        {broker.name.substring(0, 2).toUpperCase()}
                      </div>
                      {broker.name}
                      {broker.id === topPickId && (
                        <span className="px-2 py-0.5 bg-accent text-background-primary text-[8px] font-black tracking-tighter uppercase">Pete's Pick</span>
                      )}
                    </td>
                    <td className="p-6 text-profit">FCA REGULATED</td>
                    <td className="p-6">{broker.minDeposit}</td>
                    <td className="p-6 text-text-secondary font-mono text-[10px]">{broker.oneLine}</td>
                    <td className="p-6 text-right">
                      <a 
                        href={`/go/${broker.slug}`}
                        className="inline-flex items-center gap-2 bg-accent text-background-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-colors"
                      >
                        Open Account <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Individual Broker Sections */}
        <div className="space-y-32 mb-32">
          {brokers.map((broker) => (
            <section key={broker.id} id={broker.slug} className="scroll-mt-24">
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3">
                  <div className="sticky top-24">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-background-elevated border border-border-slate flex items-center justify-center text-2xl font-black">
                        {broker.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-3xl font-display font-black uppercase leading-none">{broker.name}</h2>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < Math.floor(broker.rating) ? "fill-accent text-accent" : "text-text-tertiary")} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-profit/10 text-profit text-[10px] font-mono font-bold uppercase tracking-widest mb-8 border border-profit/20">
                      <Shield className="w-3 h-3" /> FCA REGULATED
                    </div>
                    {broker.id === topPickId && (
                      <div className="mb-8 p-4 bg-accent/5 border border-accent/20">
                        <span className="text-[10px] font-mono font-black text-accent uppercase tracking-widest block mb-1">Pete's Verdict</span>
                        <p className="text-xs text-text-secondary leading-relaxed italic">
                          "{// @ts-ignore - custom field for SEO
                          broker.verdict || "Our top pick for this category. The execution quality is institutional grade."}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:w-2/3 space-y-12">
                  {/* Custom SEO Description */}
                  <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {// @ts-ignore - custom field for SEO
                      broker.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                        <Check className="w-3 h-3 text-profit" /> Why We Like Them
                      </h3>
                      <ul className="space-y-3">
                        {broker.pros.map((pro, i) => (
                          <li key={i} className="text-xs font-bold text-text-primary uppercase tracking-tight flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-profit mt-1 shrink-0" /> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                        <X className="w-3 h-3 text-loss" /> The Drawbacks
                      </h3>
                      <ul className="space-y-3">
                        {broker.cons.map((con, i) => (
                          <li key={i} className="text-xs font-bold text-text-secondary uppercase tracking-tight flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-loss/30 mt-1 shrink-0" /> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-background-surface border border-border-slate">
                    <div>
                      <span className="text-[8px] font-mono text-text-tertiary uppercase block">Min Deposit</span>
                      <span className="text-xs font-bold text-text-primary uppercase">{broker.minDeposit}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-text-tertiary uppercase block">Spreads From</span>
                      <span className="text-xs font-bold text-accent uppercase">{broker.spreads}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-text-tertiary uppercase block">Platforms</span>
                      <span className="text-[10px] font-bold text-text-primary uppercase leading-tight line-clamp-1">{broker.platforms.join(", ")}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-text-tertiary uppercase block">FCA Status</span>
                      <span className="text-xs font-bold text-profit uppercase">Regulated</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href={`/go/${broker.slug}`}
                      className="flex-1 py-4 bg-accent text-background-primary text-center text-[10px] font-black uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                    >
                      Open Account <ExternalLink className="w-3 h-3" />
                    </a>
                    <Link 
                      href={`/brokers/${broker.slug}`}
                      className="flex-1 py-4 border border-border-slate text-center text-[10px] font-black uppercase tracking-widest hover:border-text-primary transition-colors text-text-tertiary hover:text-text-primary"
                    >
                      Read Full Review
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* 6. Full Feature Comparison */}
        <div className="mb-32">
          <h2 className="text-xl font-display font-black uppercase mb-8 flex items-center gap-3">
            <span className="text-accent">//</span> Deep Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border-slate text-center">
              <thead>
                <tr className="bg-background-surface border-b border-border-slate text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                  <th className="p-6 text-left border-r border-border-slate">Feature</th>
                  {brokers.map(b => (
                    <th key={b.id} className="p-6 min-w-[150px]">{b.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[10px] font-mono uppercase">
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">FCA Regulated</td>
                  {brokers.map(b => (
                    <td key={b.id} className="p-6 text-profit font-bold">YES</td>
                  ))}
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Min Deposit</td>
                  {brokers.map(b => (
                    <td key={b.id} className="p-6">{b.minDeposit}</td>
                  ))}
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">Spreads (EURUSD)</td>
                  {brokers.map(b => (
                    <td key={b.id} className="p-6 text-accent">{b.spreads}</td>
                  ))}
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">TradingView</td>
                  {brokers.map(b => (
                    <td key={b.id} className="p-6">{b.platforms.includes("TradingView") ? <Check className="w-3 h-3 mx-auto text-profit" /> : <X className="w-3 h-3 mx-auto text-loss/30" />}</td>
                  ))}
                </tr>
                <tr className="border-b border-border-slate/50">
                  <td className="p-6 text-left font-bold border-r border-border-slate bg-background-surface/30">MT4/MT5</td>
                  {brokers.map(b => (
                    <td key={b.id} className="p-6">{(b.platforms.includes("MT4") || b.platforms.includes("MT5")) ? <Check className="w-3 h-3 mx-auto text-profit" /> : <X className="w-3 h-3 mx-auto text-loss/30" />}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. Methodology */}
        <div className="mb-32 p-12 bg-background-surface border border-border-slate relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl font-display font-black uppercase mb-6 flex items-center gap-3">
              <span className="text-accent">//</span> How We Chose These Brokers
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-6 italic">
              "We don't accept payment for rankings. Our review methodology is strictly based on data. 
              We evaluate execution speed, regulatory status, fee structures, and proprietary platform 
              stability over a minimum 6-month testing period."
            </p>
            <p className="text-xs text-text-tertiary leading-relaxed">
              {methodology}
            </p>
          </div>
        </div>

        {/* 8. FAQ Block */}
        <div className="mb-32">
          <h2 className="text-xl font-display font-black uppercase mb-12 flex items-center gap-3 text-center justify-center">
            <span className="text-accent">//</span> Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border-slate pb-8">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-4">{faq.question}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Related Pages */}
        <div className="mb-32 pt-24 border-t border-border-slate">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedPages.map((page, i) => (
              <Link 
                key={i} 
                href={page.href || (page.slug ? `/best/${page.slug}` : "#")}
                className="group p-6 bg-background-surface border border-border-slate hover:border-accent transition-premium"
              >
                <span className="text-[10px] font-mono text-accent block mb-2 font-bold uppercase tracking-widest">Internal Link // 0{i+1}</span>
                <h4 className="text-xs font-black uppercase leading-tight group-hover:text-accent transition-colors">{page.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        {/* 10. Final CTA */}
        <div className="p-16 bg-background-elevated border border-border-slate text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-black uppercase mb-6">Still Not Sure?</h2>
            <p className="text-sm text-text-secondary mb-12">
              Choosing a broker is personal. If you need a more granular breakdown of every platform we've evaluated, 
              head to our complete directory.
            </p>
            <Link 
              href="/brokers"
              className="inline-flex items-center gap-3 bg-accent text-background-primary px-12 py-5 text-xs font-black uppercase tracking-widest hover:bg-accent-hover transition-premium"
            >
              Start With Our Full Broker Guide <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
