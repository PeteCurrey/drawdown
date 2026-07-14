import { Check, X, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SectionA() {
  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
          // UK TRADERS
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-12">
          Why UK Spread Betting Changes Everything.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-lg text-text-secondary leading-relaxed font-sans">
              Most trading education is written for American or Australian audiences. UK residents have a significant structural advantage that almost nobody talks about properly: spread betting profits are completely exempt from Capital Gains Tax and Stamp Duty.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed font-sans">
              This isn't a loophole. It's how UK financial spread betting has worked since it was introduced. HMRC classifies spread betting as gambling, which means profits are not taxable income. You keep everything you make.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed font-sans">
              The practical implication: a UK trader using a spread betting account has a materially lower effective cost of trading than a US trader using a futures account or an EU trader using CFDs. This advantage compounds significantly over time.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed font-sans font-bold">
              Every broker we recommend offers FCA-regulated spread betting accounts. We verify this before listing them.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 border border-border-slate/50 rounded-[14px] bg-background-surface flex items-center gap-6">
                <span className="text-4xl font-sans font-black text-profit w-20 text-center">0%</span>
                <span className="font-sans text-sm font-bold text-text-secondary uppercase tracking-widest">CGT on spread betting profits for UK residents</span>
              </div>
              <div className="p-6 border border-border-slate/50 rounded-[14px] bg-background-surface flex items-center gap-6">
                <span className="text-4xl font-sans font-black text-profit w-20 text-center">0%</span>
                <span className="font-sans text-sm font-bold text-text-secondary uppercase tracking-widest">Stamp Duty on spread betting positions</span>
              </div>
              <div className="p-6 border border-border-slate/50 rounded-[14px] bg-background-surface flex items-center gap-6">
                <span className="text-4xl font-sans font-black text-accent w-20 text-center">FCA</span>
                <span className="font-sans text-sm font-bold text-text-secondary uppercase tracking-widest">Regulation standard for all listed brokers</span>
              </div>
            </div>
            <p className="text-xs text-text-tertiary italic font-sans px-4">
              Tax treatment depends on individual circumstances. This is not tax advice. Consult a qualified tax adviser for your specific situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionB() {
  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4 text-center md:text-left">
          // HOW WE TEST
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary mb-12 text-center md:text-left">
          Our Review Methodology.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center text-xs">1</span>
              Real Capital Testing
            </h3>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              We open real funded accounts with every broker we review. Not demo accounts. Real money, real execution, real withdrawal requests. We test during standard sessions and during high-impact news events (NFP, CPI, BoE rate decisions) when spreads widen and conditions get real.
            </p>
          </div>
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center text-xs">2</span>
              Latency Benchmarking
            </h3>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              We run automated execution scripts that measure order fill speed across multiple servers and times of day. We compare quoted spreads to actual fill prices to detect slippage. A broker quoting 0.6 pip spreads that consistently fills at 1.1 pips is worse than a broker quoting 1.0 with clean fills.
            </p>
          </div>
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center text-xs">3</span>
              Withdrawal Verification
            </h3>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              We make withdrawal requests and document the exact time from request to cleared funds. We test multiple withdrawal methods — bank transfer, card, and where available, faster payment. A broker that takes 7 working days to process a withdrawal is storing your money longer than necessary.
            </p>
          </div>
          <div className="p-8 border border-border-slate/50 rounded-[14px] bg-background-surface">
            <h3 className="text-xl font-sans font-bold mb-4 text-text-primary flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-mkt-ink text-white flex items-center justify-center text-xs">4</span>
              Regulatory Verification
            </h3>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              We verify FCA registration numbers directly on the FCA register (register.fca.org.uk) — not from the broker's own website. We check FSCS protection eligibility (up to £85,000 per eligible claimant) and client money segregation practices.
            </p>
          </div>
        </div>
        
        <hr className="border-border-slate/50 mb-6" />
        <p className="text-xs text-text-tertiary italic font-sans text-center md:text-left">
          Affiliate disclosure: we may earn a commission if you open an account via our links. This never influences our ratings — we have removed brokers from our list after testing revealed execution issues regardless of affiliate relationship.
        </p>
      </div>
    </section>
  );
}

export function SectionC() {
  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0A0A] text-white">
              <th className="p-4 font-sans font-bold">Feature</th>
              <th className="p-4 font-sans font-bold">IG Markets</th>
              <th className="p-4 font-sans font-bold">Pepperstone</th>
              <th className="p-4 font-sans font-bold">IC Markets</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm text-text-primary">
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">Minimum Deposit</td>
              <td className="p-4">£0</td>
              <td className="p-4">£200</td>
              <td className="p-4">$200</td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">Spread Betting</td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><X className="w-5 h-5 text-loss/50" /></td>
            </tr>
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">CFDs</td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">Forex Pairs</td>
              <td className="p-4">80+</td>
              <td className="p-4">60+</td>
              <td className="p-4">60+</td>
            </tr>
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">FTSE Spread (typical)</td>
              <td className="p-4">1pt</td>
              <td className="p-4">N/A</td>
              <td className="p-4">N/A</td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">GBP/USD Spread (typical)</td>
              <td className="p-4">0.6 pip</td>
              <td className="p-4">0.0 pip (raw)</td>
              <td className="p-4">0.0 pip (raw)</td>
            </tr>
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">Platforms</td>
              <td className="p-4">MT4, ProRealTime, Web</td>
              <td className="p-4">cTrader, MT4, MT5, TV</td>
              <td className="p-4">MT4, MT5, cTrader</td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">FCA Regulated</td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4 flex items-center gap-2"><X className="w-5 h-5 text-loss/50" /> (ASIC)</td>
            </tr>
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">FSCS Protected</td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><X className="w-5 h-5 text-loss/50" /></td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">Prop Firm Compatible</td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
              <td className="p-4"><Check className="w-5 h-5 text-profit" /></td>
            </tr>
            <tr className="border-b border-border-slate/50 bg-background-surface/30">
              <td className="p-4 font-bold">Best For</td>
              <td className="p-4">UK Spread Betting</td>
              <td className="p-4">Active Forex</td>
              <td className="p-4">Scalping/Algo</td>
            </tr>
            <tr className="border-b border-border-slate/50">
              <td className="p-4 font-bold">Our Rating</td>
              <td className="p-4 text-profit font-black">4.8/5</td>
              <td className="p-4 text-profit font-black">4.7/5</td>
              <td className="p-4 text-profit font-black">4.6/5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SectionD() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which broker is best for complete beginners?",
      a: "IG Markets for UK beginners. Zero minimum deposit, the most educational resources of the three, and their spread betting account is the cleanest introduction to leveraged trading for UK residents. Their customer support is also the most responsive of the three in our testing."
    },
    {
      q: "What's the difference between spread betting and CFDs?",
      a: "For UK residents, the practical difference is tax. Spread betting profits are free from CGT and Stamp Duty. CFD profits are subject to CGT above the annual allowance. The trading mechanics are nearly identical — you're speculating on price movement in both cases. Almost every UK trader should use a spread betting account unless they have a specific reason not to."
    },
    {
      q: "Is my money safe with these brokers?",
      a: "IG Markets and Pepperstone are FCA regulated, which means eligible client funds are protected by the FSCS up to £85,000. Client money is also required to be held in segregated accounts separate from the broker's operating capital. IC Markets is regulated by ASIC (Australia) — strong regulation but without FSCS protection for UK clients."
    },
    {
      q: "Can I use these brokers for prop firm practice?",
      a: "All three support the same instruments and order types used in prop firm evaluations. Pepperstone and IC Markets are particularly popular for prop preparation because their raw spread accounts closely mirror the conditions of funded accounts at FTMO and similar firms."
    },
    {
      q: "Do these brokers offer demo accounts?",
      a: "Yes — all three offer unlimited demo accounts with real market data. We recommend using a demo account for at least 3 months before trading real capital. However, be aware that demo trading doesn't replicate the emotional experience of real money — use it to test strategy mechanics, not psychological readiness."
    },
    {
      q: "What is the FSCS and does it protect me?",
      a: "The Financial Services Compensation Scheme protects eligible UK clients up to £85,000 per firm if an FCA-regulated broker becomes insolvent. It does not protect you against trading losses — only against broker insolvency. Both IG Markets and Pepperstone participate in the FSCS scheme."
    }
  ];

  return (
    <section className="py-24 border-t border-border-slate/50">
      <div className="max-w-7xl mx-auto px-6">
        <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
          // FAQ
        </span>
        <h2 className="text-3xl font-sans font-extrabold tracking-tight text-text-primary mb-10">Frequently Asked Questions</h2>
        <div className="border-t border-border-slate/50">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border-slate/50">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left py-6 flex items-center justify-between group"
              >
                <span className="font-sans font-bold text-text-primary group-hover:text-accent transition-colors pr-8">
                  {faq.q}
                </span>
                <ChevronDown 
                  className={cn("w-5 h-5 text-text-tertiary transition-transform duration-300 shrink-0", openIdx === i ? "rotate-180" : "")} 
                />
              </button>
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIdx === i ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
                )}
              >
                <p className="font-sans text-sm text-text-secondary leading-relaxed pr-12">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
