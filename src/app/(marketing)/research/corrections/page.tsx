import React from "react";
import Metadata from "next";
import Link from "next/link";
import { History, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PUBLIC_CORRECTIONS_LOG } from "@/lib/data/research";

export const metadata = {
  title: "Public Corrections Log & Editorial Transparencies | Drawdown Research",
  description:
    "Public record of factual corrections, methodology updates, and data revisions across Drawdown Trading content and reviews.",
};

export default function PublicCorrectionsPage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Public Corrections Log", href: "/research/corrections" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <History className="w-3.5 h-3.5" />
            Editorial Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Public Corrections & Revision Log
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            In accordance with our editorial standards, Drawdown maintains a public log of all material factual corrections, methodology updates, and broker data revisions.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {PUBLIC_CORRECTIONS_LOG.map((item) => (
            <div
              key={item.id}
              className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-text-primary">{item.id}</span>
                </div>
                <span className="text-xs text-text-tertiary">
                  Reported: {item.reportedDate} • Corrected: {item.correctedDate}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-text-primary mb-1">
                  Target Page: <Link href={item.pageUrl} className="text-accent hover:underline">{item.pageTitle}</Link>
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
              </div>

              <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-xs">
                <span className="font-semibold text-text-primary block mb-0.5">Action Taken & Correction:</span>
                <p className="text-text-tertiary">{item.natureOfCorrection}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 text-center space-y-3">
          <h2 className="text-lg font-bold text-text-primary">Spot an error or outdated data point?</h2>
          <p className="text-xs text-text-tertiary max-w-lg mx-auto leading-relaxed">
            Our editorial team reviews error reports within 48 business hours. Complainants receive transparent feedback and tracking.
          </p>
          <Link
            href="/report-an-error"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-background-primary text-xs font-bold hover:bg-accent/90 transition"
          >
            Submit an Error Report
          </Link>
        </div>
      </div>
    </div>
  );
}
