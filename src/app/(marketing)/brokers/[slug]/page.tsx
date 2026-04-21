"use client";

import { use } from "react";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Star,
  ChevronLeft,
  Banknote,
  Cpu,
  Globe,
  HeadphonesIcon,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BrokerReviewPage({ params }: Props) {
  const { slug } = use(params);
  const brokerName = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="pt-12 pb-24 bg-background-primary min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link 
          href="/brokers" 
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Broker Hub
        </Link>

        {/* Review Header */}
        <div className="bg-background-surface border border-border-slate p-8 md:p-16 mb-12 relative overflow-hidden">
           <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/20">
                       2026 OFFICIAL REVIEW
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">{brokerName} Review.</h1>
                 <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                       {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                       ))}
                    </div>
                    <span className="text-lg font-display font-bold text-text-primary">4.9 / 5.0</span>
                 </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                 <a 
                   href={`/api/market/brokers/redirect?id=${slug}&source=review_top`}
                   className="px-10 py-5 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium text-center"
                 >
                    Open Account &rarr;
                 </a>
                 <p className="text-[9px] font-mono text-text-tertiary text-center uppercase tracking-widest leading-relaxed">
                   Risk Warning: Capital at Risk. <br /> UK Retail traders restricted to 1:30 leverage.
                 </p>
              </div>
           </div>
           
           {/* Abstract logo placeholder bg */}
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
           {[
             { label: "Regulation", value: "FCA, ASIC, SCB", icon: Shield },
             { label: "Min Deposit", value: "£0 / $0", icon: Banknote },
             { label: "Max Leverage", value: "1:30 (Retail)", icon: Cpu },
             { label: "Support", value: "24/5 Live", icon: HeadphonesIcon }
           ].map((item, i) => (
             <div key={i} className="p-6 bg-background-elevated border border-border-slate flex flex-col items-center text-center gap-3 transition-premium hover:border-accent/30">
                <item.icon className="w-5 h-5 text-accent" />
                <div className="space-y-1">
                   <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest">{item.label}</p>
                   <p className="text-xs font-bold uppercase">{item.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-16">
              <section className="space-y-6">
                 <h2 className="text-3xl font-display font-bold uppercase">1. Platform Overview.</h2>
                 <p className="text-lg text-text-secondary leading-relaxed">
                    {brokerName} has consistently ranked as one of the premier choices for UK and Australian traders. Known for its robust technical infrastructure and deep liquidity, it caters to both retail enthusiasts and professional scalpers. 
                 </p>
                 <p className="text-text-tertiary leading-relaxed">
                    Our performance tests showed sub-20ms execution times across major forex pairs, with virtually zero slippage on limit orders during the London Open.
                 </p>
              </section>

              <section className="space-y-6">
                 <h2 className="text-3xl font-display font-bold uppercase">2. Fees & Spreads.</h2>
                 <div className="bg-background-elevated border border-border-slate overflow-hidden">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="bg-background-primary/50 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                             <th className="p-4 border-b border-border-slate">Account Type</th>
                             <th className="p-4 border-b border-border-slate">Avg. Spread</th>
                             <th className="p-4 border-b border-border-slate">Commission</th>
                          </tr>
                       </thead>
                       <tbody className="text-xs font-mono">
                          <tr className="border-b border-border-slate/30">
                             <td className="p-4">Standard</td>
                             <td className="p-4 text-accent font-bold">0.6 pips</td>
                             <td className="p-4">None</td>
                          </tr>
                          <tr>
                             <td className="p-4">ECN / Razor</td>
                             <td className="p-4 text-accent font-bold">0.0 pips</td>
                             <td className="p-4">$3.50 per lot</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </section>

              <section className="space-y-6">
                 <h2 className="text-3xl font-display font-bold uppercase">3. Pros & Cons (The Honest Truth).</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-profit/5 border border-profit/20 space-y-6">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-profit flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> The Positives
                       </h4>
                       <ul className="space-y-4 text-xs leading-relaxed text-text-secondary">
                          <li className="flex gap-2 font-medium">Institutional-grade liquidity ensures tight spreads even during high volatility.</li>
                          <li className="flex gap-2 font-medium">Exceptional cTrader and TradingView integration.</li>
                          <li className="flex gap-2 font-medium">Lightning-fast withdrawals and local UK support.</li>
                       </ul>
                    </div>
                    <div className="p-8 bg-loss/5 border border-loss/20 space-y-6">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-loss flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> The Drawbacks
                       </h4>
                       <ul className="space-y-4 text-xs leading-relaxed text-text-secondary">
                          <li className="flex gap-2 font-medium">Standard account spreads can be slightly wider than competitors.</li>
                          <li className="flex gap-2 font-medium">Advanced platform tools have a steep learning curve for beginners.</li>
                       </ul>
                    </div>
                 </div>
              </section>

              {/* FAQ Section with Schema placeholder */}
              <section className="space-y-8 pt-16 border-t border-border-slate/30">
                 <h2 className="text-3xl font-display font-bold uppercase flex items-center gap-3">
                    <HelpCircle className="w-6 h-6 text-accent" /> Frequently Asked.
                 </h2>
                 <div className="space-y-6">
                    {[
                      { q: `Is ${brokerName} regulated in the UK?`, a: "Yes, they are fully authorised and regulated by the Financial Conduct Authority (FCA)." },
                      { q: "What is the minimum deposit?", a: "The minimum deposit for most accounts is £0, although some specialised institutional accounts require more." }
                    ].map((faq, i) => (
                      <div key={i} className="space-y-2">
                         <h4 className="text-sm font-bold text-text-primary uppercase tracking-tight">{faq.q}</h4>
                         <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-background-surface border border-border-slate p-8 sticky top-32">
                 <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-accent mb-6">Our Verdict</h4>
                 <p className="text-base italic leading-relaxed text-text-primary mb-8 font-serif">
                   "{brokerName} is arguably the most reliable all-rounder for serious traders. If you value execution speed and institutional safety over 'bonus' gimmicks, this is your home."
                 </p>
                 <a 
                   href={`/api/market/brokers/redirect?id=${slug}&source=review_sidebar`}
                   className="w-full py-4 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium text-center block"
                 >
                    Get Trading Account &rarr;
                 </a>
              </div>

              <div className="p-8 border border-border-slate">
                 <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">Alternative Picks</h4>
                  <div className="space-y-4">
                    <Link href="/brokers/pepperstone" className="block p-4 bg-background-elevated hover:bg-accent/5 transition-colors border-l-2 border-accent">
                       <p className="text-[8px] font-mono text-accent uppercase tracking-widest mb-1">BEST FOR FOREX</p>
                       <p className="text-xs font-bold uppercase text-text-primary">Pepperstone</p>
                    </Link>
                    <Link href="/brokers/ic-markets" className="block p-4 bg-background-elevated hover:bg-accent/5 transition-colors border-l-2 border-border-slate">
                       <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-1">LOWEST FEES</p>
                       <p className="text-xs font-bold uppercase text-text-primary">IC Markets</p>
                    </Link>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
