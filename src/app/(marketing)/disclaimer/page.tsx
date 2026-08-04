import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { AlertTriangle, ShieldAlert, FileText, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Risk Disclaimer | Drawdown",
  description: "Important risk warnings, quantitative market signal disclosures, and financial perimeter notices for Drawdown users.",
  alternates: { canonical: "https://drawdown.trading/disclaimer" },
});

export default function DisclaimerPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/terms' },
              { label: 'Risk Disclaimer', href: '/disclaimer' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--risk-amber)" }}>
                <AlertTriangle size={14} />
                Regulatory Compliance Notice
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Risk <span style={{ color: "var(--graphite-600)" }}>Disclaimer</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Last updated: {LEGAL_CONFIG.effectiveDate} · Operational Standards &amp; Risk Parameters
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">
          
          {/* Main Risk Warning Card */}
          <div className="p-8 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2.5 mb-2" style={{ color: "var(--risk-amber)" }}>
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h2 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em] m-0">
                Extremely Important: High-Risk Capital Disclosure
              </h2>
            </div>
            <p className="text-[14px] leading-relaxed italic" style={{ color: "var(--graphite-600)" }}>
              Trading financial instruments — including foreign exchange (forex), contracts for difference (CFDs), financial spread bets, equities, options, and cryptocurrencies — carries a high level of risk and may not be suitable for all investors. Leverage amplifies both gains and losses. Before entering any trade, evaluate your financial goals, trading experience, and appetite for risk.
            </p>
            <p className="text-[13px] font-semibold border-t pt-4 font-mono uppercase tracking-[0.05em]" style={{ borderColor: "var(--line-200)", color: "var(--ink-950)" }}>
              You may lose some or all of your invested capital. Never trade with money you cannot afford to lose.
            </p>
          </div>

          {/* Section 1: Non-Advisory Status & Quantitative Market Signals */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Activity size={16} />
              <span>Section 01</span>
            </div>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. Non-Advisory Status &amp; Market Signal Scope
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <strong>{LEGAL_CONFIG.fullTradingEntity} does not provide financial advice.</strong> Pete Currey and the Drawdown team are not licensed financial advisers, wealth managers, or registered brokers. No content on the platform should be construed as individualized investment recommendations.
            </p>
            <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <h3 className="text-[12px] font-mono font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                Quantitative Market Signals &amp; Model Indicators
              </h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Drawdown publishes general, non-personalised quantitative market signals, technical alerts, and algorithmic pattern indicators across our Signal Centre and analytical tools. These outputs represent data-driven calculations derived from processing market feeds, technical indicators, and statistical risk models.
              </p>
              <p className="text-[13px] leading-relaxed font-semibold" style={{ color: "var(--ink-950)" }}>
                Market signals do not constitute guaranteed outcomes or financial recommendations. They reflect statistical probability models derived from historical data. Any trade executed based on these signals remains entirely your responsibility.
              </p>
            </div>
          </section>

          {/* Section 2: Market Probabilities & Data Integrity */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <ShieldCheck size={16} />
              <span>Section 02</span>
            </div>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Data Feeds &amp; Market Probabilities
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              While Drawdown sources pricing data, economic metrics, and market sentiment from reputable tier-1 feeds and trading networks (such as TradingView), we make no warranties regarding uninterrupted availability, timing, or absolute accuracy of live feeds. Financial markets are dynamic, volatile, and subject to unexpected liquidity gaps or slippage. Past performance, backtest calculations, and trade journal records are not guarantees of future trading performance.
            </p>
          </section>

          {/* Section 3: AI & Algorithmic Tool Scope */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <FileText size={16} />
              <span>Section 03</span>
            </div>
            <h2 className="font-display text-[24px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. AI Tool Limitations &amp; Strategy Backtesting
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              Our AI Trade Journal, Market Scanner, and Strategy Backtester use quantitative algorithms to assist in pattern discovery and trade journaling. Algorithmic outputs are calculated tools, not absolute predictors of future price movement. You are responsible for validating backtest assumptions and stress-testing strategy logic in demo environments prior to allocating real capital.
            </p>
          </section>

          {/* Section 4: Regional Legal & Tax Link Card */}
          <div className="p-8 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.08em] block mb-1" style={{ color: "var(--graphite-600)" }}>
                  Need Region-Specific Legal &amp; Tax Information?
                </span>
                <h3 className="font-display text-[20px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  Legal, Financial &amp; Tax Disclaimer Hub
                </h3>
              </div>
              <Link 
                href="/legal/financial-disclaimer" 
                className="inline-flex items-center gap-2 px-5 py-3 border text-[12px] font-medium transition-colors"
                style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
              >
                View Regional Tax &amp; Legal Disclaimers
                <ArrowRight size={14} />
              </Link>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              Explore detailed regional tax treatment (including UK Spread Betting vs CFD rules, US CFTC 4.41 disclosures, Australian ASIC leverage limits, Singapore MAS regulations, and HK SFC rules) tailored to your jurisdiction.
            </p>
          </div>

          {/* User Acknowledgment Footer */}
          <div className="p-6 border text-center space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <p className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              By accessing Drawdown, you confirm that you have read, understood, and agreed to these risk warnings and accept full responsibility for your financial decisions.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
