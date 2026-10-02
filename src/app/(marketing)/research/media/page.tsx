import React from "react";
import Metadata from "next";
import Link from "next/link";
import { FileText, Download, Mail, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EXPERT_AUTHORS } from "@/data/experts";
import { getMetadata } from "@/lib/metadata";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = getMetadata({
  title: "Media & Journalist Resource Centre | Drawdown Research",
  description:
    "Press resources, spokesperson biographies, citation guidelines, embeddable calculators, and verified data benchmarks for financial journalists and researchers.",
  path: "/research/media",
});

export default function MediaCentrePage() {
  return (
    <div className="min-h-screen bg-background-primary text-text-primary pt-24 pb-16">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Drawdown Media & Journalist Resource Centre",
            "url": "https://drawdown.trading/research/media",
            "description": "Press resources, spokesperson biographies, citation guidelines, embeddable calculators, and verified data benchmarks for financial journalists and researchers.",
            "publisher": {
              "@type": "Organization",
              "name": "Drawdown Trading",
              "url": "https://drawdown.trading",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Press",
                "email": "press@drawdown.trading",
              },
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
                { "@type": "ListItem", "position": 2, "name": "Research Centre", "item": "https://drawdown.trading/research" },
                { "@type": "ListItem", "position": 3, "name": "Media Centre", "item": "https://drawdown.trading/research/media" },
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://drawdown.trading" },
              { "@type": "ListItem", "position": 2, "name": "Research Centre", "item": "https://drawdown.trading/research" },
              { "@type": "ListItem", "position": 3, "name": "Media Centre", "item": "https://drawdown.trading/research/media" },
            ],
          },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Research Centre", href: "/research" },
            { label: "Media Centre", href: "/research/media" },
          ]}
        />

        <div className="my-8 border-b border-border-primary/60 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5" />
            Journalist & Press Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-4">
            Drawdown Media & Research Centre
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Verified trading research, spokesperson commentaries, high-resolution brand assets, and citation guidelines for financial media publications.
          </p>
        </div>

        {/* Spokespersons */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent" />
            Approved Spokespersons & Analysts
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXPERT_AUTHORS.map((author) => (
              <div
                key={author.id}
                className="bg-background-secondary border border-border-primary/70 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-4">
                  {author.avatarUrl && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-border-primary shrink-0 relative bg-background-elevated">
                      <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{author.name}</h3>
                    <p className="text-xs text-accent font-mono font-semibold">{author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{author.bio}</p>
                {author.linkedinUrl && (
                  <a
                    href={author.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-accent transition"
                  >
                    LinkedIn Profile
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Citation Guidelines */}
        <div className="bg-background-secondary border border-border-primary rounded-2xl p-6 sm:p-8 space-y-4 mb-12">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" />
            Citation & Attribution Guidance
          </h2>
          <div className="text-xs text-text-secondary space-y-2 leading-relaxed">
            <p>
              When referencing Drawdown studies, calculators, or datasets in press coverage:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-tertiary">
              <li>Attribute findings to <strong>Drawdown Trading Research Group</strong>.</li>
              <li>Include a direct hypertext link to the canonical research URL (e.g. <code className="text-accent">https://drawdown.trading/research/[slug]</code>).</li>
              <li>Avoid quoting unverified placeholder metrics or unreviewed draft pages.</li>
            </ul>
          </div>
        </div>

        {/* Media Contact */}
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center space-y-2">
          <h3 className="text-base font-bold text-text-primary">Press & Media Inquiries</h3>
          <p className="text-xs text-text-tertiary">
            For urgent commentary, custom dataset requests, or interview bookings, email our research team:
          </p>
          <a
            href="mailto:legal@drawdown.trading"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent hover:underline pt-2"
          >
            <Mail className="w-4 h-4" />
            legal@drawdown.trading
          </a>
        </div>
      </div>
    </div>
  );
}
