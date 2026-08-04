import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlertTriangle, Shield, Activity, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = getMetadata({
  title: "US Regulatory Risk Disclaimer",
  description: "Mandatory CFTC Rule 4.41 and US regulatory disclosures for Drawdown users.",
});

export default function UnitedStatesDisclaimerPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen select-none" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <Breadcrumbs 
          items={[
            { label: 'United States', href: '/us' },
            { label: 'Regulatory Disclaimer', href: '/us/disclaimer' }
          ]} 
        />
        
        <div className="max-w-4xl mx-auto mt-8 space-y-12">
          {/* Title Banner */}
          <div className="space-y-4 border-b pb-10" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em] px-2.5 py-1 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--risk-amber)" }}>
                <AlertTriangle size={14} />
                CFTC RULE 4.41 MANDATORY DISCLOSURE
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] font-semibold">
              US Risk <span style={{ color: "var(--graphite-600)" }}>Disclosure</span>
            </h1>
            <p className="text-[13px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Regulatory Perimeter &amp; CFTC / NFA Compliance Statements
            </p>
          </div>

          {/* CFTC Rule 4.41 Box */}
          <div className="p-8 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <h2 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--risk-amber)" }}>
              Mandatory CFTC Rule 4.41 Disclosure
            </h2>
            <p className="text-[11px] font-mono uppercase leading-relaxed text-justify" style={{ color: "var(--graphite-600)" }}>
              HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS, SOME OF WHICH ARE DESCRIBED BELOW. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. IN FACT, THERE ARE FREQUENTLY SHARP DIFFERENCES BETWEEN HYPOTHETICAL PERFORMANCE RESULTS AND THE ACTUAL RESULTS SUBSEQUENTLY ACHIEVED BY ANY PARTICULAR TRADING PROGRAM.
            </p>
            <p className="text-[11px] font-mono uppercase leading-relaxed text-justify" style={{ color: "var(--graphite-600)" }}>
              ONE OF THE LIMITATIONS OF HYPOTHETICAL PERFORMANCE RESULTS IS THAT THEY ARE GENERALLY PREPARED WITH THE BENEFIT OF HINDSIGHT. IN ADDITION, HYPOTHETICAL TRADING DOES NOT INVOLVE FINANCIAL RISK, AND NO HYPOTHETICAL TRADING RECORD CAN COMPLETELY ACCOUNT FOR THE IMPACT OF FINANCIAL RISK IN ACTUAL TRADING.
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-8 font-sans">
            <section className="space-y-3 border-b pb-8" style={{ borderColor: "var(--line-200)" }}>
              <h2 className="font-display text-[24px] font-semibold" style={{ color: "var(--ink-950)" }}>
                No Income Guarantees or Financial Advice
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Drawdown does not make any promises, guarantees, or income representations regarding your potential results in financial markets. Trading foreign exchange, futures, and derivatives involves high risk. Most retail market participants lose capital. All materials are for educational and analytical context only and do not constitute financial advice.
              </p>
            </section>

            <section className="space-y-3 border-b pb-8" style={{ borderColor: "var(--line-200)" }}>
              <h2 className="font-display text-[24px] font-semibold" style={{ color: "var(--ink-950)" }}>
                Non-Advisor Status &amp; Trade Signal Disclosures
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                Drawdown is an educational platform and quantitative software provider. We are not a registered investment advisor (RIA) with the SEC or a Commodity Trading Advisor (CTA) with the CFTC. Drawdown does not manage client funds or provide personalized investment advice.
              </p>
              <p className="text-[14px] leading-relaxed font-semibold p-4 border" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)", color: "var(--ink-950)" }}>
                Trade signals, indicators, and scanner alerts on Drawdown are automated quantitative conclusions generated from data feeds and risk parameters. They are not guaranteed outcomes or tailored commodity advice. You are solely responsible for your execution decisions.
              </p>
            </section>

            {/* Grid for SEC / CFTC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                    SEC / FINRA Alignment
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  We adhere to US publishing boundaries regarding educational commentary on equities and options markets.
                </p>
              </div>

              <div className="p-6 border space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                    CFTC / NFA Guidelines
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                  Forex and futures content strictly complies with NFA publisher exemption standards for general education.
                </p>
              </div>
            </div>

            {/* Link to Legal & Tax Disclaimer page */}
            <div className="p-6 border flex items-center justify-between flex-wrap gap-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.08em] block" style={{ color: "var(--graphite-600)" }}>
                  Detailed US Legal &amp; Tax Overview (IRS Sec 1256 &amp; PDT)
                </span>
                <h4 className="font-display text-[18px] font-semibold" style={{ color: "var(--ink-950)" }}>
                  US Tax &amp; Financial Disclaimer Breakdown
                </h4>
              </div>
              <Link 
                href="/legal/financial-disclaimer?region=us" 
                className="px-4 py-2.5 border text-[12px] font-medium font-sans hover:underline"
                style={{ backgroundColor: "var(--signal-navy)", borderColor: "var(--signal-navy)", color: "#FAFAF9" }}
              >
                Read US Tax Disclaimer
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
