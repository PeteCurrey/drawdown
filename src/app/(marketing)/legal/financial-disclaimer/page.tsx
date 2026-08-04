import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";
import { AlertTriangle, Scale, Activity, Globe, FileText, ShieldCheck, CheckCircle2, Info } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "Legal, Financial & Tax Disclaimer | Drawdown",
  description: "Comprehensive multi-region legal, financial non-advisory perimeter, trade signals disclosure, and regional tax disclaimers (UK, US, AU, SG, HK, EU).",
  path: "/legal/financial-disclaimer",
});

export default function FinancialDisclaimerPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Breadcrumbs 
            items={[
              { label: 'Legal', href: '/legal/financial-disclaimer' },
              { label: 'Financial & Tax Disclaimer', href: '/legal/financial-disclaimer' }
            ]} 
          />
          
          <div className="mt-8 space-y-4 border-b pb-12" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--signal-navy)" }}>
                <Scale size={14} />
                Substantial Legal &amp; Financial Framework
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              Legal, Financial <br />
              <span style={{ color: "var(--graphite-600)" }}>&amp; Tax Disclaimer</span>
            </h1>
            
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Regulatory Perimeter · Quantitative Trade Signal Scope · Regional Tax Disclosures
            </p>
          </div>
        </div>

        {/* Core Non-Advisory Statement Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-8 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--risk-amber)" }}>
              <AlertTriangle size={16} />
              <span>Core Operational Perimeter Notice</span>
            </div>
            <p className="text-[15px] leading-relaxed font-sans font-semibold" style={{ color: "var(--ink-950)" }}>
              {LEGAL_CONFIG.fullTradingEntity} does not provide financial advice. All content, quantitative models, trade signals, AI trade journal analyses, and educational modules provided across the platform are published for general informational and educational context only.
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              Drawdown is not a financial adviser, broker-dealer, commodity trading adviser, asset manager, or tax consultant. We do not handle client investment funds or execute trades on behalf of users.
            </p>
          </div>
        </div>

        {/* Main Disclaimer Document Body (Fully Server-Rendered) */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* Section 1: Financial Advice & Regulatory Perimeter */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Scale size={16} />
              <span>Section 01</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              1. Financial Advice &amp; Regulatory Perimeter
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                No information or tool provided on Drawdown constitutes a recommendation, endorsement, or solicitation to buy, sell, or hold any security, currency pair, futures contract, contract for difference (CFD), spread bet, or digital asset. 
              </p>
              <p>
                Financial decisions require independent evaluation of your financial condition, risk tolerance, and investment objectives. If you require financial advice, you must consult a licensed independent financial advisor (IFA) registered with your local financial regulator.
              </p>
            </div>
          </section>

          {/* Section 2: Trade Signals & Algorithmic Model Disclosures */}
          <section className="space-y-6 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Activity size={16} />
              <span>Section 02</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Trade Signals &amp; Algorithmic Model Scope
            </h2>
            
            <div className="space-y-4 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown offers quantitative trade signals, market alerts, automated pattern discovery scanners, and institutional sentiment tracking tools across our platform and Signal Centre.
              </p>

              <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                  Nature of General Market Signals:
                </h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                    <span><strong>Impersonal Quantitative Calculations:</strong> All trade signals are automated conclusions generated from market data feeds, technical indicators, order flow matrices, and risk models. They are provided to subscribers on substantially the same basis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                    <span><strong>No Guaranteed Outcomes:</strong> Trade signals represent probabilistic market scenarios derived from historical statistical patterns. <strong>Trade signals are not guaranteed outcomes or promises of profit.</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                    <span><strong>User Execution Discretion:</strong> You retain 100% control and responsibility for determining whether to act on any signal, selecting entry levels, setting stop-loss parameters, managing leverage, and closing positions.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Regional Tax & Legal Disclosures (All Server Rendered) */}
          <section className="space-y-6 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Globe size={16} />
              <span>Section 03</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              3. Regional Tax &amp; Regulatory Contexts
            </h2>

            <div className="p-4 border text-[13px] font-mono mb-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <span className="font-bold text-slate-900">Tax Advice Disclaimer:</span> Tax treatment depends on individual circumstances and may change. Drawdown does not provide tax, legal, or accounting advice. Consult a qualified accountant or tax adviser.
            </div>

            <div className="space-y-8">
              {/* UK Context */}
              <div id="uk-tax" className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                  <span>🇬🇧</span> United Kingdom (FCA &amp; HMRC Context)
                </h3>
                <div className="space-y-2 text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  <p>
                    <strong>FCA Perimeter:</strong> {LEGAL_CONFIG.fullTradingEntity} operates strictly within the UK publisher and technology vendor exemption under the Financial Services and Markets Act 2000 (FSMA). We do not provide regulated investment advice or manage client investments.
                  </p>
                  <p>
                    <strong>HMRC Tax Context:</strong> Under current UK tax rules, profits from financial spread betting are exempt from Capital Gains Tax (CGT) and Stamp Duty for UK tax residents, provided trading does not constitute a commercial business trade. CFD trading profits remain subject to CGT (and losses can generally be offset against allowable capital gains). Tax laws may change.
                  </p>
                </div>
              </div>

              {/* US Context */}
              <div id="us-tax" className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                  <span>🇺🇸</span> United States (CFTC / SEC / IRS Context)
                </h3>
                <div className="space-y-2 text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  <p>
                    <strong>CFTC / SEC Perimeter:</strong> Drawdown is not registered as a Commodity Trading Advisor (CTA) with the CFTC or an Investment Advisor with the SEC. CFTC RULE 4.41 applies to hypothetical or simulated performance results.
                  </p>
                  <p>
                    <strong>IRS Tax Rules:</strong> Section 1256 contracts (e.g. regulated futures) qualify for 60% long-term / 40% short-term capital gains tax treatment. Wash-sale rules (Sec 1091) and Pattern Day Trader (PDT) rules apply under US jurisdiction.
                  </p>
                </div>
              </div>

              {/* AU, SG, HK, EU Contexts */}
              <div id="global-tax" className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                  <span>🌏</span> Australia, Singapore, Hong Kong &amp; Europe
                </h3>
                <div className="space-y-2 text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  <p>
                    Drawdown does not hold AFSL (Australia), MAS (Singapore), SFC (Hong Kong), or MiFID (Europe) financial advisory licences. All materials are educational. International clients are responsible for complying with local regulations and tax reporting rules.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Brokerage & Execution Disclaimers */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <FileText size={16} />
              <span>Section 04</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. Brokerage &amp; Third-Party Execution Disclaimers
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown is an independent educational platform and does not operate as a broker or clearing agent. References to third-party brokers or prop trading firms are provided for convenience. Drawdown may receive affiliate compensation from partner brokers. Drawdown is not responsible for broker trade execution, slippage, platform downtime, or third-party account losses.
              </p>
            </div>
          </section>

          {/* Section 5: AI & Technical Limitations */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <ShieldCheck size={16} />
              <span>Section 05</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              5. AI &amp; Technical Limitations
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Our AI Trade Journal, strategy backtesters, and scanners rely on machine learning models. Algorithmic outputs are calculated tools, not absolute predictors. Verify AI analysis independently before taking trading actions.
              </p>
            </div>
          </section>

          {/* Bottom Document Reference Strip */}
          <div className="p-6 border text-center space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <p className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              {LEGAL_CONFIG.fullTradingEntity} · {LEGAL_CONFIG.tradingAddress} · Document Reference: {LEGAL_CONFIG.documentVersion}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
