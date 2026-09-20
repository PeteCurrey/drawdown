// src/app/(marketing)/wire/[slug]/page.tsx
import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Clock, Wrench, ShieldCheck } from "lucide-react";
import { getMetadata, siteConfig } from "@/lib/metadata";
import { StructuredData, defaultOrgSchema } from "@/components/StructuredData";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { getWireEditionBySlug, buildUtmUrl } from "@/lib/wire";
import { DRAWDOWN_TOOLS, categoryToSlug } from "@/lib/lobby-constants";
import type { WireEditionItem } from "@/types/wire";

interface WireEditionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: WireEditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const edition = await getWireEditionBySlug(slug);
  if (!edition) return { title: "Edition Not Found | The Wire" };

  return getMetadata({
    title: `${edition.title} | The Wire | Drawdown`,
    description: edition.preview_text || `Drawdown curated ${edition.edition_type.toLowerCase()} market intelligence briefing.`,
    path: `/wire/${slug}`,
    hasRegionalVariants: false,
  });
}

export default async function WireEditionPage({ params }: WireEditionPageProps) {
  const { slug } = await params;
  const edition = await getWireEditionBySlug(slug);

  if (!edition) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#0B0E12] font-sans selection:bg-[#16213E] selection:text-[#FFFFFF]">
      <StructuredData
        type="Article"
        data={{
          headline: edition.title,
          description: edition.preview_text || edition.title,
          datePublished: edition.published_at || edition.created_at,
          dateModified: edition.updated_at,
          author: { "@type": "Organization", name: "Drawdown Desk" },
          publisher: defaultOrgSchema,
        }}
      />

      <LobbyNav />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* 1. Header & Breadcrumbs */}
        <div className="border-b-2 border-[#0B0E12] pb-6 space-y-4">
          <Link
            href="/wire"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#73787E] hover:text-[#0B0E12] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Wire Briefings
          </Link>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase text-[#73787E]">
            <span className={`px-2 py-0.5 font-bold ${
              edition.edition_type === 'BREAKING'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-[#EAE8E1] text-[#0B0E12]'
            }`}>
              {edition.edition_type} EDITION
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {edition.published_at ? new Date(edition.published_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Recent'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#0B0E12] tracking-tight leading-tight">
            {edition.title}
          </h1>

          {edition.preview_text && (
            <p className="font-serif italic text-lg sm:text-xl text-[#4B5157] leading-relaxed">
              {edition.preview_text}
            </p>
          )}

          {/* Canonical note banner */}
          <div className="p-3.5 bg-[#F7F6F2] border border-[#DEDDD8] font-mono text-xs text-[#4B5157] flex items-center justify-between">
            <span>THE WIRE CURATION // ALL STORIES LINK TO CANONICAL REPORTING ON THE LOBBY</span>
            <Link href="/lobby" className="text-[#2563eb] underline font-bold uppercase hover:text-[#16213E]">
              The Lobby →
            </Link>
          </div>
        </div>

        {/* 2. Briefing Items */}
        <div className="space-y-12">
          {(edition.items || []).map((item: WireEditionItem, idx: number) => {
            const article = item.article;
            const categorySlug = article ? categoryToSlug(article.category as any) : "markets";
            const canonicalHref = article 
              ? buildUtmUrl({
                  path: `/lobby/${categorySlug}/${article.slug}`,
                  source: 'wire',
                  medium: 'briefing',
                  campaign: edition.slug,
                  content: article.slug
                })
              : "/lobby";

            const tool = item.recommended_tool_slug && DRAWDOWN_TOOLS[item.recommended_tool_slug]
              ? DRAWDOWN_TOOLS[item.recommended_tool_slug]
              : null;

            const toolHref = tool
              ? buildUtmUrl({
                  path: tool.href,
                  source: 'wire',
                  medium: 'briefing',
                  campaign: edition.slug,
                  content: tool.slug
                })
              : null;

            return (
              <section
                key={item.id}
                className="border-b border-[#DEDDD8] pb-10 space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#73787E] uppercase">
                  <span className="font-bold text-[#0B0E12]">
                    ITEM {String(idx + 1).padStart(2, '0')} // {item.market_category || 'INTELLIGENCE'}
                  </span>
                  {item.source_attribution && (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {item.source_attribution}
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0E12] leading-snug">
                  <Link href={canonicalHref} className="hover:text-[#2563eb] transition-colors">
                    {item.item_title}
                  </Link>
                </h2>

                <p className="font-sans text-base text-[#2E3338] leading-relaxed">
                  {item.wire_summary}
                </p>

                {/* Why It Matters Callout */}
                <div className="bg-[#F7F6F2] border-l-3 border-[#2563eb] p-4 my-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#2563eb] font-bold mb-1">
                    WHY IT MATTERS TO TRADERS
                  </h4>
                  <p className="font-sans text-sm text-[#4B5157] leading-relaxed">
                    {item.why_it_matters}
                  </p>
                </div>

                {/* Drawdown Tool Recommendation */}
                {tool && toolHref && (
                  <div className="bg-[#FFFFFF] border border-[#DEDDD8] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#F7F6F2] border border-[#DEDDD8] text-[#16213E]">
                        <Wrench className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase text-[#73787E]">RECOMMENDED DRAWDOWN TOOL</div>
                        <div className="font-sans text-sm font-bold text-[#0B0E12]">{tool.name}</div>
                      </div>
                    </div>
                    <Link
                      href={toolHref}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0E12] text-[#FFFFFF] font-mono text-xs uppercase font-bold hover:bg-[#16213E] transition-colors"
                    >
                      Audit Exposure <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Read Full Canonical Analysis on The Lobby */}
                <div className="pt-2">
                  <Link
                    href={canonicalHref}
                    className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#0B0E12] font-bold hover:text-[#2563eb] transition-colors"
                  >
                    Read Complete Reporting & Data in The Lobby <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>

        {/* 3. Bottom Navigation */}
        <div className="pt-6 border-t border-[#DEDDD8] flex items-center justify-between font-mono text-xs uppercase">
          <Link href="/wire" className="text-[#73787E] hover:text-[#0B0E12] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Briefings Archive
          </Link>
          <Link href="/lobby" className="text-[#2563eb] hover:text-[#16213E] font-bold flex items-center gap-1">
            Explore The Lobby <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
