import React from "react";
import Metadata from "next";
import Link from "next/link";
import { ShieldCheck, BookOpen, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LEGAL_CONFIG } from "@/config/legal";

export const metadata = {
  title: "Editorial Policy & Standards | Drawdown Trading",
  description:
    "The official editorial independence, AI content policy, source verification, financial disclaimer, and correction standards of Drawdown Trading.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Editorial Policy", href: "/editorial-policy" }]} />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            E-E-A-T Editorial Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Editorial Policy & Independence Standards
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Published by <strong>{LEGAL_CONFIG.fullTradingEntity}</strong>. Our commitment to evidence-led trading education, transparent commercial disclosures, human-in-the-loop review, and public corrections.
          </p>
        </div>

        <div className="space-y-8 text-xs text-text-secondary leading-relaxed">
          {/* Section 1: Independence */}
          <section className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. Editorial Independence & Commercial Relationships
            </h2>
            <p>
              Drawdown Trading accepts commercial commissions and referral compensation from select broker and software providers. However, affiliate revenue never dictates our numerical rating models, broker test records, or risk research conclusions.
            </p>
            <p>
              Where commercial partner links are included, they are clearly tagged with affiliate disclosures. Brokers cannot pay for favorable reviews or deletion of verified negative findings.
            </p>
          </section>

          {/* Section 2: AI Assistance */}
          <section className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2. Generative AI Disclosure & Human Review
            </h2>
            <p>
              Drawdown utilizes generative artificial intelligence tools for text summarization, data formatting, and code generation. However:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-tertiary">
              <li>No article or research paper is published without human domain expert review.</li>
              <li>AI models do not determine trading recommendations, regulatory classifications, or financial risk guidance.</li>
              <li>Every quantitative claim is cross-referenced against primary data sources.</li>
            </ul>
          </section>

          {/* Section 3: Corrections */}
          <section className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Public Corrections & Revision Standards
            </h2>
            <p>
              When a factual error, outdated fee schedule, or broken formula is identified, Drawdown logs a transparent entry in our <Link href="/research/corrections" className="text-accent hover:underline">Public Corrections Log</Link>.
            </p>
            <p>
              We distinguish between minor typos and material content revisions. Where conclusions or broker ratings change, a clear notice is appended to the affected article.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
