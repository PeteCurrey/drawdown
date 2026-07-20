"use client";

import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const comparisonRows = [
  { label: "Profit Target", ftmo: "10% (Phase 1)", the5ers: "10% (High Stakes)" },
  { label: "Max Drawdown", ftmo: "10% (static)", the5ers: "10% (static)", highlight: "even" },
  { label: "Daily Drawdown", ftmo: "5% (hard rule)", the5ers: "5% (hard rule)", highlight: "even" },
  { label: "Time Limit", ftmo: "Unlimited (Calendar)", the5ers: "Unlimited", highlight: "5ers" },
  { label: "News Trading", ftmo: "Allowed (30min rule)", the5ers: "Allowed" , highlight: "5ers" },
  { label: "Weekend Holding", ftmo: "Allowed", the5ers: "Allowed", highlight: "even" },
  { label: "Scaling Plan", ftmo: "Up to $2M", the5ers: "Unlimited (100% profit split)", highlight: "5ers" },
  { label: "Payout Split", ftmo: "Up to 90%", the5ers: "Up to 100%", highlight: "5ers" },
  { label: "Payout Frequency", ftmo: "Monthly (14-day min)", the5ers: "Bi-weekly", highlight: "5ers" },
  { label: "Platform", ftmo: "MT4, MT5, cTrader", the5ers: "MT5, cTrader" },
  { label: "Trust / Track Record", ftmo: "Established since 2015", the5ers: "Established since 2016", highlight: "ftmo" },
];

export default function FtmoVsThe5ersPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto px-6 relative z-10 max-w-5xl">
          <div className="flex items-center gap-3 text-text-tertiary text-[10px] font-mono uppercase tracking-widest mb-6">
            <Link href="/prop-firms" className="hover:text-text-primary transition-colors">Prop Firms</Link>
            <span>/</span>
            <span className="text-accent">FTMO vs The5%ers</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-sans font-extrabold uppercase tracking-tight leading-[0.9]">
                FTMO vs <br />
                <span className="text-text-primary">The5%ers.</span> <br />
                <span className="text-text-secondary text-2xl">The Data-Driven <br className="hidden md:block"/>Verdict (2026).</span>
              </h1>
              <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-medium">
                Two industry giants. Two completely different philosophies on scaling. We broke down every rule, payout condition, and hidden restriction to give you the clearest comparison online.
              </p>
            </div>

            {/* TL;DR Verdict Card */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5/40 p-8 space-y-6">
              <p className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">// TL;DR VERDICT</p>
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-profit shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">Choose FTMO if:</p>
                    <p className="text-xs text-text-secondary">You are an aggressive intraday trader or scalper who wants an established, high-trust firm with a large funded account ceiling.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-wider mb-1">Choose The5%ers if:</p>
                    <p className="text-xs text-text-secondary">You are a consistent swing trader who wants an aggressive scaling plan and are willing to work toward a 100% profit split.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border-slate/30">
                <a href="/go/ftmo" className="flex-1 py-3 bg-accent text-[#08090D] text-center text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors" rel="sponsored">
                  Start FTMO
                </a>
                <a href="/go/the5ers" className="flex-1 py-3 border border-border-slate/50 hover:border-text-primary text-text-primary text-center text-[10px] font-bold uppercase tracking-widest transition-colors" rel="sponsored">
                  Join The5%ers
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 max-w-5xl">
          <div className="mb-10">
            <h2 className="text-3xl font-sans font-bold uppercase mb-2">Side-by-Side Comparison</h2>
            <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest">Verified as of April 2026 — always confirm with the firm's official T&Cs</p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <div className="border border-border-slate/50 overflow-hidden min-w-[600px] md:min-w-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 border-b border-border-slate/50">
                <div className="p-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Rule</div>
                <div className="p-4 text-sm font-sans font-bold uppercase text-text-primary text-center border-l border-border-slate/50">FTMO</div>
                <div className="p-4 text-sm font-sans font-bold uppercase text-accent text-center border-l border-border-slate/50">The5%ers</div>
              </div>

              {comparisonRows.map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-border-slate/50/40 last:border-none ${row.highlight === "5ers" ? "bg-accent/3" : ""}`}>
                  <div className="p-4 text-xs font-mono uppercase tracking-wider text-text-tertiary">{row.label}</div>
                  <div className={`p-4 text-xs font-bold text-center border-l border-border-slate/50/40 ${row.highlight === "ftmo" ? "text-text-primary" : "text-text-secondary"}`}>
                    {row.ftmo}
                  </div>
                  <div className={`p-4 text-xs font-bold text-center border-l border-border-slate/50/40 ${row.highlight === "5ers" ? "text-accent" : "text-text-secondary"}`}>
                    {row.the5ers}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive */}
      <section className="py-16 border-t border-border-slate/50">
        <div className="max-w-7xl mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4">// WHERE FTMO WINS</h3>
              <h4 className="text-2xl font-sans font-bold uppercase mb-4">Trust & Scale.</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                FTMO has been operating since 2015 and has a massive, transparent track record of payouts. For traders who want a high initial allocation and a proven institution behind them, FTMO remains the gold standard. Their $2M maximum funded account is also significantly higher than most competitors.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4">// WHERE THE5%ERS WINS</h3>
              <h4 className="text-2xl font-sans font-bold uppercase mb-4">Long-Term Scaling.</h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                The5%ers' scaling plan is genuinely unique. Consistent traders can work toward a 100% profit split and access theoretically unlimited capital. For swing traders who build edge over months and years (not days), this is a fundamentally superior business model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar CTA */}
      <div className="sticky bottom-0 /95 border-t border-border-slate/50 backdrop-blur-sm z-50 py-4 px-6">
        <div className="max-w-7xl mx-auto max-w-5xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-text-secondary hidden md:block">
            Ready to choose? Start your evaluation today.
          </p>
          <div className="flex gap-4 w-full md:w-auto">
            <a href="/go/ftmo" className="flex-1 md:flex-none px-8 py-3 bg-accent text-[#08090D] text-center text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors" rel="sponsored">
              Start FTMO Challenge
            </a>
            <a href="/go/the5ers" className="flex-1 md:flex-none px-8 py-3 border border-border-slate/50 hover:border-text-primary text-text-primary text-center text-xs font-bold uppercase tracking-widest transition-colors" rel="sponsored">
              Get Funded with The5%ers
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
