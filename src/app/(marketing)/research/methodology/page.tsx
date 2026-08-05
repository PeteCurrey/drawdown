import React from "react";
import Metadata from "next";
import Link from "next/link";
import { BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = {
  title: "Research Methodology & Sampling Standards | Drawdown Research",
  description:
    "The empirical sampling standards, evidence classifications, data verification protocols, and editorial peer-review workflows of Drawdown Trading.",
};

export default function ResearchMethodologyPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Methodology", href: "/research/methodology" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Research Methodology Standards
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Empirical Standards & Data Protocols
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Every study, calculator model, and broker cost audit published by Drawdown Trading must adhere to strict evidence classifications, minimum sampling sizes, and transparent peer review.
          </p>
        </div>

        {/* 5 Evidence Classifications */}
        <div className="space-y-6 mb-12">
          <h2 className="text-xl font-bold text-text-primary">Evidence Classification System</h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                code: "REGULATOR_VERIFIED",
                title: "Regulator Verified",
                desc: "Data sourced directly from statutory regulator public registers (FCA, ASIC, CySEC, CFTC) or Companies House official filings.",
                badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              },
              {
                code: "DRAWDOWN_OBSERVED",
                title: "Drawdown Observed",
                desc: "First-party empirical observations captured via our VPS automated logging system, order execution tests, or tick data scrapers.",
                badgeColor: "bg-accent/10 text-accent border-accent/20",
              },
              {
                code: "BROKER_SUPPLIED",
                title: "Broker Supplied",
                desc: "Information provided directly by broker representatives or published in official customer legal agreements and fee schedules.",
                badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              },
              {
                code: "THIRD_PARTY_SOURCE",
                title: "Third-Party Source",
                desc: "Academic literature, economic data feeds (FRED, EIA, BIS), or verified third-party API benchmarks.",
                badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
              },
              {
                code: "UNVERIFIED",
                title: "Unverified / Draft",
                desc: "Marketing claims, unconfirmed forum reports, or incomplete datasets. Unverified items are strictly flagged and excluded from published rankings.",
                badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              },
            ].map((item) => (
              <div key={item.code} className="bg-background-secondary border border-border-primary/60 rounded-xl p-4 flex items-start gap-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-mono font-bold border shrink-0 ${item.badgeColor}`}>
                  {item.code}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Review & Standards */}
        <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-4 mb-12">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Minimum Publication Criteria
          </h2>
          <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside leading-relaxed">
            <li><strong>Minimum Sample Size:</strong> Broker spread audits require at least 500 tick observations across 3 separate trading sessions.</li>
            <li><strong>Reproducibility:</strong> All mathematical models must include full formulas and downloadable raw CSV datasets.</li>
            <li><strong>Noindex Draft Policy:</strong> Research pages with pending evidence remain flagged `noindex` and excluded from `sitemap.xml`.</li>
            <li><strong>Conflict Disclosure:</strong> Commercial partner connections are disclosed on every individual study.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
