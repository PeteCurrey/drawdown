"use client";

import { ShieldCheck, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  tier: string | null;
};

export default function PeteMemoPage({ tier }: Props) {
  const isMember = tier !== null;

  return (
    <div className="flex flex-col bg-background-primary min-h-screen">

      {/* Editorial Hero */}
      <section className="pt-32 pb-16 border-b border-border-slate">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
              <span>Sunday, 27 April 2026</span>
              <div className="w-8 h-[1px] bg-border-slate" />
              <span className="text-accent font-bold">Vol. 042</span>
              {isMember && (
                <span className="text-profit font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Full Access
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Sunday Prep: <br />
              <span className="text-text-primary">Navigating the <br /> Liquidity Trap.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl pt-4 font-medium">
              The Fed is trapped, yields are at multi-year highs, and the market has been trained to buy every dip. Here's what our desk is watching this week — and why we are being extremely selective.
            </p>
          </div>

          <div className="flex items-center gap-5 pb-12 border-b border-border-slate/50">
            <div className="w-14 h-14 rounded-full bg-border-slate border border-accent/20 overflow-hidden shrink-0 flex items-center justify-center font-display font-black text-accent text-xl">
              P
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-text-primary tracking-widest">Pete Currey</p>
              <p className="text-[10px] font-mono text-accent uppercase tracking-widest mt-1">Head of Trading, Drawdown</p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-10">

              {/* Section 1 — Always visible */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2">
                  <span className="text-text-tertiary">01 /</span> The Macro Reality
                </h2>
                <h3 className="text-2xl font-display font-bold uppercase mb-6">The Fed Is Trapped. Here's What That Means.</h3>
                <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
                  <p>
                    Inflation is still sticky. Growth is slowing. And Jerome Powell has exactly zero attractive options. This week's PCE print will be critical — if it comes in hot, we expect a risk-off flush across equities and a renewed DXY bid. If it misses, the market will price in rate cuts it probably won't get.
                  </p>
                  <p>
                    Either way, <span className="text-text-primary font-bold">we are not chasing either move.</span> The asymmetric risk is to the downside in equities and to the upside in USD until we see genuine evidence of disinflation in services.
                  </p>
                </div>
              </div>

              {/* Section 2 — Gated */}
              <div className="relative">
                <div className={isMember ? "" : "pointer-events-none select-none"}>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2">
                    <span className="text-text-tertiary">02 /</span> Levels That Matter
                  </h2>
                  <h3 className="text-2xl font-display font-bold uppercase mb-6">The Exact Levels Our Desk Is Watching.</h3>
                  <div className={`space-y-4 text-text-secondary leading-relaxed text-sm ${!isMember ? "blur-sm opacity-40" : ""}`}>
                    <p>
                      On the S&P 500, the key level to watch is the weekly open at 5,342. A clean break and hold below this level confirms the bearish momentum. Our target for the first push lower is 5,248, a prior weekly high that should now act as support/resistance.
                    </p>
                    <p>
                      On EUR/USD, the 1.0850 level is the make-or-break. A daily close below here will open up a move toward parity territory by end of Q2, consistent with our macro thesis of prolonged USD strength.
                    </p>
                  </div>
                </div>

                {/* Paywall Overlay — only for non-members */}
                {!isMember && (
                  <div className="absolute inset-0 flex items-end justify-center pb-0">
                    <div className="w-full bg-gradient-to-t from-background-primary via-background-primary/90 to-transparent pt-16 text-center pb-4">
                      <Lock className="w-10 h-10 text-accent mx-auto mb-4" />
                      <h4 className="text-2xl font-display font-black uppercase mb-3 text-text-primary">Continue Reading</h4>
                      <p className="text-text-secondary mb-6 text-sm leading-relaxed max-w-sm mx-auto">
                        Levels, Bias, and Behavioural Nudge sections are available to Foundation members and above.
                      </p>
                      <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors mb-3">
                        Unlock Full Access <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                        From £29/mo. Cancel anytime.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3 — Only for members */}
              {isMember && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-4 flex items-center gap-2">
                    <span className="text-text-tertiary">03 /</span> The Behavioural Nudge
                  </h2>
                  <h3 className="text-2xl font-display font-bold uppercase mb-6">Stop Trying to Catch Falling Knives.</h3>
                  <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
                    <p>
                      The most dangerous thing you can do this week is be a hero. The market rewards patience during macro uncertainty, not bravery. Sit on your hands until the data is out, let the dust settle, and wait for a clean structure to trade.
                    </p>
                    <p>
                      Your edge is not in predicting the Fed. Your edge is in executing flawlessly once the market shows you its hand.
                    </p>
                  </div>
                  <div className="mt-8 p-6 border border-accent/20 bg-accent/5">
                    <p className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-2">Action This Week</p>
                    <p className="text-sm text-text-secondary">Log every trade with a pre-trade bias note in the AI Journal. Review your Friday performance from last month — it's where most members are leaking their R.</p>
                    <Link href="/tools/ai-trade-journal" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
                      Open Trade Journal →
                    </Link>
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {!isMember ? (
                <div className="bg-background-surface border border-border-slate p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6">What's Inside Full Access</h3>
                  <ul className="space-y-3 mb-6">
                    {[
                      "Full macro reality breakdown",
                      "Exact price levels (Charts)",
                      "Instruments we're watching",
                      "The behavioural nudge",
                      "Post-session debrief (Friday)"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs font-mono text-text-secondary uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-profit shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/pricing" className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 block text-center">
                    Start Foundation — £29/mo
                  </Link>
                </div>
              ) : (
                <div className="bg-background-surface border border-profit/20 p-6">
                  <div className="flex items-center gap-2 text-profit mb-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">{tier?.toUpperCase()} Member</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    You have full access to Pete's Memo including all levels, bias reports, and behavioural nudges.
                  </p>
                  <Link href="/dashboard-preview" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
                    Back to Dashboard →
                  </Link>
                </div>
              )}

              <div className="bg-background-surface border border-border-slate p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-premium shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-2">Not Financial Advice</h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      Pete's Memo is framed as market perspective, process, and structured thinking. It is explicitly not a signal service or financial advice. Trading involves significant risk. You are responsible for your own capital.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
