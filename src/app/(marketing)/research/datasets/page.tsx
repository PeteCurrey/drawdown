import React from "react";
import Metadata from "next";
import Link from "next/link";
import { Database, Download, FileText, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SAMPLE_RESEARCH_STUDIES } from "@/lib/data/research";

export const metadata = {
  title: "First-Party Datasets & Open Research Downloads | Drawdown Research",
  description:
    "Download open-access quantitative trading datasets, Monte Carlo equity simulations, and broker cost measurement data. CC BY 4.0 Licensed.",
};

export default function ResearchDatasetsPage() {
  const datasets = SAMPLE_RESEARCH_STUDIES.map((s) => s.dataset).filter(Boolean);

  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Datasets", href: "/research/datasets" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Database className="w-3.5 h-3.5" />
            First-Party Datasets
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Open Trading & Broker Datasets
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Download raw CSV and JSON datasets compiled during Drawdown research studies. All datasets are published under Creative Commons Attribution 4.0 (CC BY 4.0).
          </p>
        </div>

        <div className="space-y-6">
          {datasets.map((dataset) => (
            <div
              key={dataset!.id}
              className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 hover:border-accent/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-accent/10 text-accent">
                      {dataset!.format}
                    </span>
                    <span className="text-xs text-text-tertiary">
                      Updated {dataset!.lastUpdated} • {dataset!.rowCount.toLocaleString()} rows
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-text-primary">{dataset!.title}</h2>
                </div>

                <a
                  href={dataset!.fileUrl}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-accent text-background-primary text-xs font-bold hover:bg-accent/90 transition shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download Dataset ({Math.round(dataset!.fileSizeBytes / 1024)} KB)
                </a>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {dataset!.description}
              </p>

              <div className="bg-background-primary/50 border border-border-primary/40 rounded-xl p-3 text-xs space-y-1">
                <span className="font-semibold text-text-primary block">Recommended Citation:</span>
                <p className="text-text-tertiary font-mono text-[11px]">{dataset!.citationFormat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
