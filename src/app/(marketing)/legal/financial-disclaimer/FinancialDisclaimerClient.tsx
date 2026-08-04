"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AlertTriangle, ShieldCheck, Scale, FileText, Globe, CheckCircle2, ChevronRight, Info, Activity } from "lucide-react";
import Link from "next/link";

type RegionKey = "uk" | "us" | "au" | "sg" | "hk" | "eu";

interface RegionInfo {
  id: RegionKey;
  label: string;
  flag: string;
  regulator: string;
  taxBody: string;
}

const REGIONS: RegionInfo[] = [
  { id: "uk", label: "United Kingdom", flag: "🇬🇧", regulator: "FCA (Financial Conduct Authority)", taxBody: "HMRC (HM Revenue & Customs)" },
  { id: "us", label: "United States", flag: "🇺🇸", regulator: "CFTC / SEC / NFA / FINRA", taxBody: "IRS (Internal Revenue Service)" },
  { id: "au", label: "Australia", flag: "🇦🇺", regulator: "ASIC (Australian Securities & Investments Commission)", taxBody: "ATO (Australian Taxation Office)" },
  { id: "sg", label: "Singapore", flag: "🇸🇬", regulator: "MAS (Monetary Authority of Singapore)", taxBody: "IRAS (Inland Revenue Authority of SG)" },
  { id: "hk", label: "Hong Kong", flag: "🇭🇰", regulator: "SFC (Securities & Futures Commission)", taxBody: "IRD (Inland Revenue Department)" },
  { id: "eu", label: "Europe & Global", flag: "🇪🇺", regulator: "ESMA / National Competent Authorities", taxBody: "Local Tax Authorities" },
];

export function FinancialDisclaimerClient() {
  const searchParams = useSearchParams();
  const [activeRegion, setActiveRegion] = useState<RegionKey>("uk");

  useEffect(() => {
    const r = searchParams.get("region")?.toLowerCase();
    if (r && (REGIONS.some((reg) => reg.id === r))) {
      setActiveRegion(r as RegionKey);
    }
  }, [searchParams]);

  const currentRegion = REGIONS.find((r) => r.id === activeRegion) || REGIONS[0];

  return (
    <div className="pt-28 pb-24 min-h-screen select-none" style={{ backgroundColor: "var(--paper-0)", color: "var(--ink-950)" }}>
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

        {/* Region Selector Component */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="p-6 border space-y-4" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.08em] flex items-center gap-2" style={{ color: "var(--ink-950)" }}>
                <Globe size={14} />
                Select Jurisdiction / User Region:
              </span>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.05em]">
                Regulator: {currentRegion.regulator}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {REGIONS.map((reg) => {
                const isActive = activeRegion === reg.id;
                return (
                  <button
                    key={reg.id}
                    onClick={() => setActiveRegion(reg.id)}
                    className="px-3 py-2.5 border text-center transition-colors flex flex-col items-center gap-1 text-[12px] font-mono"
                    style={{
                      backgroundColor: isActive ? "var(--signal-navy)" : "var(--paper-0)",
                      borderColor: isActive ? "var(--signal-navy)" : "var(--line-200)",
                      color: isActive ? "#FAFAF9" : "var(--ink-950)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <span className="text-base">{reg.flag}</span>
                    <span className="truncate w-full text-[11px]">{reg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Disclaimer Document */}
        <div className="max-w-4xl mx-auto space-y-12 font-sans">

          {/* Core Non-Advisory Statement Banner */}
          <div className="p-8 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--risk-amber)" }}>
              <AlertTriangle size={16} />
              <span>Core Operational Perimeter Notice</span>
            </div>
            <p className="text-[15px] leading-relaxed font-sans" style={{ color: "var(--ink-950)" }}>
              <strong>Drawdown Trading Ltd does not provide financial advice.</strong> All content, quantitative models, trade signals, AI trade journal analyses, and educational modules provided across the platform are published for general informational and educational context only.
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              Drawdown is not a financial adviser, broker-dealer, commodity trading adviser, asset manager, or tax consultant. We do not handle client investment funds or execute trades on behalf of users.
            </p>
          </div>

          {/* Section 1: Non-Advisory Status & Financial Perimeter */}
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

          {/* Section 2: Trade Signals & Quantitative Analysis Disclosure */}
          <section className="space-y-6 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Activity size={16} />
              <span>Section 02</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              2. Trade Signals &amp; Algorithmic Model Disclosures
            </h2>
            
            <div className="space-y-4 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown offers quantitative trade signals, market alerts, automated pattern discovery scanners, and institutional sentiment tracking tools across our platform and Signal Centre.
              </p>

              <div className="p-6 border space-y-3" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
                <h3 className="text-[13px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--ink-950)" }}>
                  Nature of Trade Signals &amp; Data Analysis
                </h3>
                <ul className="space-y-2 text-[13px]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" style={{ color: "var(--signal-navy)" }} />
                    <span><strong>Data-Driven Calculations:</strong> All trade signals are automated conclusions generated following quantitative data analysis from third-party price feeds, technical indicators, order flow matrices, and risk models.</span>
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

          {/* Section 3: Region-Specific Tax & Legal Disclosures */}
          <section className="space-y-6 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <Globe size={16} />
              <span>Section 03</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
                3. Region-Specific Tax &amp; Regulatory Disclosures ({currentRegion.flag} {currentRegion.label})
              </h2>
            </div>

            {/* Dynamic Region Content Panel */}
            <div className="p-8 border space-y-6" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
              
              {/* UK Specifics */}
              {activeRegion === "uk" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>UK Jurisdiction: FCA &amp; HMRC Regulatory Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>FCA Perimeter:</strong> Drawdown Trading Ltd operates strictly within the UK publisher and technology vendor exemption under the Financial Services and Markets Act 2000 (FSMA) and FCA PERG guidance. We do not provide regulated investment advice or manage client investments.
                    </p>
                    
                    <h4 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: "var(--ink-950)" }}>
                      HMRC Tax Treatment Disclosures:
                    </h4>
                    <ul className="space-y-2 text-[13px] pl-4 list-disc">
                      <li>
                        <strong>Financial Spread Betting:</strong> Under current UK tax legislation (HMRC rules), profits from financial spread betting are exempt from Capital Gains Tax (CGT) and Stamp Duty for UK tax residents, provided trading does not constitute a primary business trade. Tax law is subject to individual circumstances and change.
                      </li>
                      <li>
                        <strong>Contracts for Difference (CFDs):</strong> Profits from CFD trading are subject to UK Capital Gains Tax (CGT). Losses incurred in CFD trading can generally be offset against allowable capital gains in the same or subsequent tax years.
                      </li>
                      <li>
                        <strong>Educational Disclaimer:</strong> Statements regarding UK tax treatment cite general HMRC guidelines. Drawdown does not provide tax advice. Consult a Chartered Tax Adviser (CTA) or qualified accountant regarding your personal tax liabilities.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* US Specifics */}
              {activeRegion === "us" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>US Jurisdiction: CFTC / SEC / IRS Regulatory Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>CFTC / SEC Perimeter:</strong> Drawdown is not a Commodity Trading Advisor (CTA) registered with the Commodity Futures Trading Commission (CFTC) or an Investment Advisor registered with the Securities and Exchange Commission (SEC).
                    </p>
                    
                    <h4 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: "var(--ink-950)" }}>
                      US Tax &amp; Trading Rules Disclosures:
                    </h4>
                    <ul className="space-y-2 text-[13px] pl-4 list-disc">
                      <li>
                        <strong>IRS Section 1256 Contracts:</strong> Regulated futures contracts and broad-based index options qualify for 60% long-term / 40% short-term capital gains tax treatment under IRS Code Section 1256.
                      </li>
                      <li>
                        <strong>Wash Sale Rule (IRS Sec 1091):</strong> Disallows claiming a loss on a stock or security if you acquire substantially identical stock or securities within a 60-day window (30 days before or after the sale).
                      </li>
                      <li>
                        <strong>Pattern Day Trader (PDT) Rule:</strong> Under FINRA Rule 4210, US residents executing 4 or more day trades within 5 business days using a margin account must maintain a minimum equity balance of $25,000.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* AU Specifics */}
              {activeRegion === "au" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>Australia Jurisdiction: ASIC &amp; ATO Regulatory Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>ASIC Perimeter:</strong> Drawdown does not hold an Australian Financial Services Licence (AFSL) to provide general or personal financial product advice. All materials are educational.
                    </p>
                    
                    <h4 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: "var(--ink-950)" }}>
                      ATO Tax Disclosures:
                    </h4>
                    <ul className="space-y-2 text-[13px] pl-4 list-disc">
                      <li>
                        <strong>Trader vs. Investor Status:</strong> The Australian Taxation Office (ATO) distinguishes between individuals carrying on a business of trading (revenue account treatment where losses offset income) and passive investors (Capital Gains Tax rules with potential 50% CGT discount for assets held over 12 months).
                      </li>
                      <li>
                        <strong>ASIC RG 227 Leverage Limits:</strong> ASIC leverage caps apply to retail CFD accounts (1:30 for major FX pairs, 1:20 for minor FX/gold, 1:10 for stocks).
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* SG Specifics */}
              {activeRegion === "sg" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>Singapore Jurisdiction: MAS &amp; IRAS Regulatory Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>MAS Perimeter:</strong> Drawdown is not licensed under the Financial Advisers Act (FAA) by the Monetary Authority of Singapore (MAS). Content provided does not constitute financial advisory services or an offer of financial products.
                    </p>
                    
                    <h4 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: "var(--ink-950)" }}>
                      IRAS Tax Disclosures:
                    </h4>
                    <ul className="space-y-2 text-[13px] pl-4 list-disc">
                      <li>
                        <strong>No Capital Gains Tax:</strong> Singapore does not impose capital gains tax on investment gains. However, if IRAS determines that an individual is carrying on a trade or business of active trading (evaluated via Badges of Trade), trading profits may be assessed as income tax.
                      </li>
                      <li>
                        <strong>MAS Retail Leverage Caps:</strong> MAS regulations cap leverage for retail CFD clients at 1:20 for forex.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* HK Specifics */}
              {activeRegion === "hk" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>Hong Kong Jurisdiction: SFC &amp; IRD Regulatory Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>SFC Perimeter:</strong> Drawdown does not hold a license with the Securities and Futures Commission (SFC) under the Securities and Futures Ordinance (SFO) for Type 1, 3, 4, 5, or 9 regulated activities.
                    </p>
                    
                    <h4 className="font-mono text-[13px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: "var(--ink-950)" }}>
                      IRD Tax Disclosures:
                    </h4>
                    <ul className="space-y-2 text-[13px] pl-4 list-disc">
                      <li>
                        <strong>Capital Gains &amp; Profits Tax:</strong> Hong Kong does not levy capital gains tax. However, gains derived from a trade, profession, or business carried on in HK are subject to HK Profits Tax under the Inland Revenue Department (IRD).
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* EU Specifics */}
              {activeRegion === "eu" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-mono font-bold uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
                    <Info size={16} />
                    <span>Europe &amp; Global Jurisdiction: ESMA &amp; MiFID II Context</span>
                  </div>
                  
                  <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
                    <p>
                      <strong>ESMA Perimeter:</strong> European Securities and Markets Authority (ESMA) rules mandate that retail clients trading CFDs are protected by negative balance protection and leverage caps (1:30 major FX, 1:20 minor FX/indices). Between 74% and 89% of retail investor accounts lose money when trading CFDs.
                    </p>
                    <p>
                      <strong>Global Users:</strong> Users outside the UK, US, AU, SG, and HK are responsible for ensuring compliance with their local jurisdiction's financial, tax, and exchange rules before opening trading accounts or executing transactions.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </section>

          {/* Section 4: Third-Party Brokerage & Execution Disclaimers */}
          <section className="space-y-4 pb-8 border-b" style={{ borderColor: "var(--line-200)" }}>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--signal-navy)" }}>
              <FileText size={16} />
              <span>Section 04</span>
            </div>
            <h2 className="font-display text-[26px] font-semibold tracking-[-0.02em]" style={{ color: "var(--ink-950)" }}>
              4. Brokerage &amp; Execution Disclaimers
            </h2>
            <div className="space-y-3 text-[14px] leading-relaxed" style={{ color: "var(--graphite-600)" }}>
              <p>
                Drawdown is an independent technology platform and does not operate as a broker, dealer, liquidity provider, or clearing house. Any links or references to third-party brokers, prop trading firms, or trading software on Drawdown are provided for user convenience.
              </p>
              <p>
                Drawdown may receive compensation or affiliate commission from featured brokers or prop firms when users register via our platform links. This affiliate relationship does not influence our objective broker evaluations or increase client costs. Drawdown is not responsible for broker trade execution, slippage, platform outages, or capital loss with third-party providers.
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
                Our AI Trade Journal, strategy backtesters, and market scanners rely on complex machine learning, natural language processing, and statistical models. Algorithmic outputs are subject to technological limitations, latency, data gaps, or model hallucinations. Always verify AI-generated trade context independently before making trading decisions.
              </p>
            </div>
          </section>

          {/* Bottom Confirmation Strip */}
          <div className="p-6 border text-center space-y-2" style={{ backgroundColor: "var(--paper-100)", borderColor: "var(--line-200)" }}>
            <p className="text-[12px] font-mono uppercase tracking-[0.08em]" style={{ color: "var(--graphite-600)" }}>
              Drawdown Trading Ltd · Chesterfield, UK · Document Reference: LEG-TAX-2026-V1
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
