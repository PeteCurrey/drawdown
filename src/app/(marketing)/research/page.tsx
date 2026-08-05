import React from "react";
import Metadata from "next";
import Link from "next/link";
import { BookOpen, ShieldCheck, Database, FileText, Activity, AlertCircle, ArrowRight, Download, BarChart2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SAMPLE_RESEARCH_STUDIES, PUBLIC_CORRECTIONS_LOG } from "@/lib/data/research";
import { ContentUpdateHistory } from "@/components/seo/ContentUpdateHistory";

export const metadata = {
  title: "Drawdown Research Centre | Evidence-Led Trading & Broker Intelligence",
  description:
    "Original quantitative research, empirical broker cost audits, risk-of-ruin mathematics, and downloadable datasets. Fully evidence-led and transparent.",
};

export default function ResearchCentrePage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Research Centre", href: "/research" }]} />

        {/* Hero Section */}
        <div className="my-8 text-center sm:text-left border-b border-border-primary/60 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Drawdown Research Centre • Evidence-Led Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
            Independent Trading Research & Empirical Analysis
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed">
            Drawdown does not publish generic hype. We produce empirical broker audits, drawdown recovery mathematics, risk-of-ruin studies, and downloadable datasets to help traders build defensible processes.
          </p>
        </div>

        {/* Supporting Research Sub-Hub Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <Link
            href="/research/methodology"
            className="p-4 rounded-xl bg-background-secondary border border-border-primary/60 hover:border-accent transition group"
          >
            <BookOpen className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-text-primary">Methodology</h3>
            <p className="text-xs text-text-tertiary mt-1">Research standards & sampling</p>
          </Link>
          <Link
            href="/research/datasets"
            className="p-4 rounded-xl bg-background-secondary border border-border-primary/60 hover:border-accent transition group"
          >
            <Database className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-text-primary">Datasets</h3>
            <p className="text-xs text-text-tertiary mt-1">Downloadable CSV data</p>
          </Link>
          <Link
            href="/research/broker-testing"
            className="p-4 rounded-xl bg-background-secondary border border-border-primary/60 hover:border-accent transition group"
          >
            <Activity className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-text-primary">Broker Testing</h3>
            <p className="text-xs text-text-tertiary mt-1">Empirical spread & execution</p>
          </Link>
          <Link
            href="/research/media"
            className="p-4 rounded-xl bg-background-secondary border border-border-primary/60 hover:border-accent transition group"
          >
            <FileText className="w-5 h-5 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-text-primary">Media Centre</h3>
            <p className="text-xs text-text-tertiary mt-1">PR & journalist resources</p>
          </Link>
        </div>

        {/* Active Research Publications */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Published Research Studies</h2>
              <p className="text-xs text-text-tertiary">Peer-reviewed quantitative and empirical reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_RESEARCH_STUDIES.map((study) => (
              <div
                key={study.slug}
                className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 hover:border-accent/60 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-accent/10 text-accent">
                      {study.evidenceClassification.replace("_", " ")}
                    </span>
                    <span className="text-xs text-text-tertiary">{study.publishedAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {study.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-4">
                    {study.subtitle}
                  </p>

                  {/* Research Question */}
                  <div className="bg-background-primary/60 border border-border-primary/40 rounded-xl p-3.5 mb-4 text-xs">
                    <span className="font-semibold text-text-primary block mb-1">Research Question:</span>
                    <p className="text-text-tertiary italic">"{study.researchQuestion}"</p>
                  </div>

                  {/* Key Findings */}
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-semibold text-text-secondary block">Key Findings:</span>
                    <ul className="text-xs text-text-tertiary space-y-1 list-disc list-inside">
                      {study.keyFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Content Version Transparency */}
                  <ContentUpdateHistory
                    versions={study.versionHistory}
                    lastReviewedDate={study.lastReviewedAt}
                    reviewerName={study.reviewers[0]?.name}
                  />
                </div>

                <div className="pt-4 border-t border-border-primary/40 flex items-center justify-between">
                  <span className="text-[11px] text-text-tertiary">
                    Sample: {study.sampleSize}
                  </span>
                  {study.dataset && (
                    <a
                      href={study.dataset.fileUrl}
                      download
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Data ({study.dataset.format})
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Transparency Footer Section */}
        <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              Correction & Editorial Transparency
            </h3>
            <p className="text-xs text-text-tertiary max-w-2xl leading-relaxed">
              We maintain a public corrections log and transparent update history. Spot an error or outdated data point in our research or broker reviews?
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/editorial-policy"
              className="px-4 py-2 rounded-xl bg-background-primary border border-border-primary text-xs font-medium text-text-secondary hover:text-text-primary transition"
            >
              Editorial Policy
            </Link>
            <Link
              href="/report-an-error"
              className="px-4 py-2 rounded-xl bg-accent text-background-primary text-xs font-semibold hover:bg-accent/90 transition"
            >
              Report an Error
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
