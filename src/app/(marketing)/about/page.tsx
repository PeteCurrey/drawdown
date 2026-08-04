import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { TrackPageView } from '@/components/admin/TrackPageView';
import { LEGAL_CONFIG } from '@/config/legal';
import { ShieldCheck, Scale, Award, TrendingUp, AlertTriangle, CheckCircle2, History, Compass, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Pete Currey & Drawdown Authority',
  description: 'The honest origin of Drawdown. Pete Currey has been trading live markets since 2016. Discover our founder journey, risk philosophy, and what we do and do not claim.',
  alternates: { canonical: 'https://drawdown.trading/about' },
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24 bg-background-primary min-h-screen">
      <TrackPageView path="/about" />
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Anti-Guru Manifesto */}
        <div className="mb-20">
          <span className="text-accent font-mono tracking-widest uppercase text-xs mb-4 block">
            FOUNDER &amp; PLATFORM AUTHORITY
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase leading-tight mb-8">
            Built from real <br /> 
            market execution. <br /> 
            Zero <span className="text-accent">hype.</span>
          </h1>
          
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed font-sans">
            <p>
              Drawdown was created to solve a widespread problem in trading education: flashy lifestyle marketing, secret "guaranteed" algorithms, and unrealistic expectations sold to retail traders.
            </p>
            <p className="border-l-4 border-accent pl-6 py-3 bg-background-elevated/50 italic text-text-primary">
              "The reality is that retail trading is a high-stakes business of statistical probabilities. Over 75% of retail accounts lose money — not due to a lack of indicators, but due to poor risk management, emotional overexposure, and chasing unvalidated promises."
            </p>
            <p>
              Drawdown provides structured education, quantitative indicator models, signal analysis, and risk-first journaling software. We focus on process, discipline, and capital preservation.
            </p>
          </div>
        </div>

        {/* Founder Timeline */}
        <div className="mb-24 pt-16 border-t border-border-slate space-y-12">
          <div>
            <h2 className="text-3xl font-display font-bold uppercase mb-2">The Founder Chronology</h2>
            <p className="text-text-tertiary font-mono text-xs uppercase tracking-widest">
              Fact-Checked Timeline · Pete Currey
            </p>
          </div>

          <div className="space-y-10 font-sans">
            
            {/* Timeline Item 1: Before 2016 */}
            <div className="p-8 bg-background-elevated/40 border border-border-slate/60 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-accent text-sm font-bold uppercase tracking-widest">
                  BEFORE 2016 — COMMERCIAL &amp; OPERATIONAL EXPERIENCE
                </span>
                <span className="text-xs font-mono text-text-tertiary uppercase">Business Leadership</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Prior to trading live financial markets full-time, Pete's career focused on commercial business leadership, operational risk evaluation, cash flow management, contract negotiation, and running commercial enterprises. This commercial background provided crucial grounding in cash management, risk exposure, and decision-making under uncertainty, but it was not institutional financial market trading.
              </p>
            </div>

            {/* Timeline Item 2: 2016 Live Trading */}
            <div className="p-8 bg-background-elevated/40 border border-accent/40 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-accent text-sm font-bold uppercase tracking-widest">
                  2016 — LIVE TRADING BEGINS
                </span>
                <span className="text-xs font-mono text-accent uppercase">Live Execution Chronology</span>
              </div>
              <p className="text-text-primary text-base font-semibold leading-relaxed">
                Pete began trading live financial markets in 2016.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                This marks the start of Pete's active live-market trading chronology. Moving from simulated analysis to executing real capital across spot FX, index CFDs, and commodities introduced the inescapable reality of real-money trading psychology and execution discipline.
              </p>
            </div>

            {/* Timeline Item 3: Market Experience */}
            <div className="p-8 bg-background-elevated/40 border border-border-slate/60 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-accent text-sm font-bold uppercase tracking-widest">
                  DEVELOPMENT OF MARKET EXPERIENCE
                </span>
                <span className="text-xs font-mono text-text-tertiary uppercase">Multi-Asset Execution</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Over years of active execution, Pete traded major foreign exchange pairs (GBP/USD, EUR/USD, AUD/USD), gold and precious metals, equity index derivatives (FTSE 100, S&amp;P 500, DAX 40), and digital assets. This execution provided first-hand experience with market liquidity cycles, news volatility, spread expansion, slippage, and broker execution mechanics.
              </p>
            </div>

            {/* Timeline Item 4: Losses & Lessons */}
            <div className="p-8 bg-background-elevated/40 border border-border-slate/60 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-accent text-sm font-bold uppercase tracking-widest">
                  LOSSES, DRAWDOWNS &amp; REAL LESSONS
                </span>
                <span className="text-xs font-mono text-text-tertiary uppercase">Transparent Account of Risk</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Drawdown was not built from a pristine, loss-free trading record. Like every genuine active trader, Pete experienced painful drawdowns, execution mistakes, overleveraged setup losses, and the psychological trap of revenge trading during high-volatility events.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-secondary pt-2">
                <div className="p-3 bg-background-primary border border-border-slate/40">
                  <span className="font-bold text-text-primary block mb-1">Leverage Magnifies Error</span>
                  High effective leverage can turn a routine statistical draw into an account emergency.
                </div>
                <div className="p-3 bg-background-primary border border-border-slate/40">
                  <span className="font-bold text-text-primary block mb-1">Free Margin Discipline</span>
                  Maintaining sufficient free margin is essential for surviving unexpected market gaps.
                </div>
                <div className="p-3 bg-background-primary border border-border-slate/40">
                  <span className="font-bold text-text-primary block mb-1">Stop Losses Are Mandatory</span>
                  Discipline is not optional — hard stop-loss limits protect against black-swan movements.
                </div>
                <div className="p-3 bg-background-primary border border-border-slate/40">
                  <span className="font-bold text-text-primary block mb-1">Survival Before Return</span>
                  Staying in the game precedes long-term consistency. Capital preservation comes first.
                </div>
              </div>
            </div>

            {/* Timeline Item 5: Development of Drawdown */}
            <div className="p-8 bg-background-elevated/40 border border-border-slate/60 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-mono text-accent text-sm font-bold uppercase tracking-widest">
                  DEVELOPMENT OF DRAWDOWN
                </span>
                <span className="text-xs font-mono text-text-tertiary uppercase">Platform Origin</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Drawdown was built to combine structured risk education, quantitative indicator models, transparent market analysis, trade journaling, and AI-assisted performance review. It distills real market experience into an objective, data-driven framework.
              </p>
            </div>

          </div>
        </div>

        {/* Current Risk Framework */}
        <div className="mb-24 pt-16 border-t border-border-slate space-y-8">
          <h2 className="text-3xl font-display font-bold uppercase">Current Risk Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-6 bg-background-elevated/40 border border-border-slate space-y-2">
              <h3 className="font-display font-bold text-text-primary uppercase">1. Predefined Risk</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Risk per trade is strictly defined before entry (typically 0.5%–1% of total equity). No trades are opened without calculated stop parameters.
              </p>
            </div>
            <div className="p-6 bg-background-elevated/40 border border-border-slate space-y-2">
              <h3 className="font-display font-bold text-text-primary uppercase">2. Post-Trade Review</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Every trade is recorded in the AI Trade Journal to audit execution quality, emotional factors, and statistical compliance against the trading plan.
              </p>
            </div>
            <div className="p-6 bg-background-elevated/40 border border-border-slate space-y-2">
              <h3 className="font-display font-bold text-text-primary uppercase">3. Objective Confluence</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Decisions rely on multi-factor technical alignment, market data feeds, and quantitative indicators, rejecting single magic indicators or impulse entries.
              </p>
            </div>
          </div>
        </div>

        {/* Explicit Disclosure: What Is NOT Being Claimed */}
        <div className="p-8 bg-background-elevated/60 border border-border-slate space-y-4 mb-20">
          <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase tracking-widest">
            <ShieldAlert size={16} />
            <span>Transparency Notice: What Is Not Being Claimed</span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed italic">
            "Drawdown is built from real experience, including mistakes and losses. It is not presented as a perfect trading record."
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary list-disc pl-5">
            <li>No claim of 20 years or two decades of live market trading (live trading began in 2016).</li>
            <li>No claim of FCA authorisation or regulated financial adviser status.</li>
            <li>No claim of regulated broker, fund manager, or institutional mandate role.</li>
            <li>No claim of secret, guaranteed, or loss-proof trading strategies.</li>
            <li>No claim that past educational results guarantee future performance.</li>
            <li>No claim of audited institutional investment performance.</li>
          </ul>
        </div>

        {/* Footer Authority Box */}
        <div className="p-8 bg-background-surface border border-border-slate text-center space-y-2">
          <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">
            {LEGAL_CONFIG.fullTradingEntity} · {LEGAL_CONFIG.tradingAddress}
          </p>
          <p className="text-xs text-text-secondary">
            Questions about our platform or founder journey? Contact <a href={`mailto:${LEGAL_CONFIG.supportEmail}`} className="text-accent underline">{LEGAL_CONFIG.supportEmail}</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
