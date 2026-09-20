// src/app/(marketing)/wire/page.tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Newspaper, Clock, Sparkles } from "lucide-react";
import { getMetadata, siteConfig } from "@/lib/metadata";
import { StructuredData, defaultOrgSchema } from "@/components/StructuredData";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { getWireEditions } from "@/lib/wire";
import type { WireEdition } from "@/types/wire";

export const metadata: Metadata = getMetadata({
  title: "The Wire — Curated Briefings & Market Dispatches | Drawdown",
  description: "Twice-daily curated market briefing layer from Drawdown. Pre-market catalysts, market close wraps, and high-impact trade intelligence linking to canonical Lobby stories.",
  path: "/wire",
  hasRegionalVariants: false,
});

export const revalidate = 60;

export default async function WireArchivePage() {
  const editions = await getWireEditions({ limit: 20 });

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#0B0E12] font-sans selection:bg-[#16213E] selection:text-[#FFFFFF]">
      <StructuredData
        type="WebSite"
        data={{
          name: "The Wire | Drawdown",
          url: `${siteConfig.url}/wire`,
          description: "Curated briefing layer for active traders.",
          publisher: defaultOrgSchema,
        }}
      />

      {/* 1. Header & Navigation */}
      <div className="border-b border-[#DEDDD8] bg-[#F7F6F2] py-12 px-4 sm:px-6">
        <div className="max-w-[1320px] mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-[11px] uppercase tracking-widest bg-[#EAE8E1] text-[#4B5157] border border-[#DEDDD8]">
            <Sparkles className="w-3 h-3 text-[#2563eb]" />
            DRAWDOWN BRIEFING LAYER
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#0B0E12]">
            THE WIRE
          </h1>
          <p className="font-serif italic text-lg sm:text-xl text-[#4B5157] max-w-2xl mx-auto">
            Twice-daily curated market briefings and breaking intelligence. Pre-market catalysts, trading-industry developments, and post-market wraps.
          </p>
          <div className="font-mono text-xs text-[#73787E] pt-2">
            CANONICAL SOURCE: <Link href="/lobby" className="underline hover:text-[#0B0E12]">THE LOBBY</Link>
          </div>
        </div>
      </div>

      <LobbyNav />

      {/* 2. Editions List or Empty State */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12">
        <div className="border-b-2 border-[#0B0E12] pb-3 mb-8 flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#0B0E12] font-bold">
            PUBLISHED EDITIONS ARCHIVE
          </h2>
          <span className="font-mono text-xs text-[#73787E]">
            {editions.length} EDITIONS AVAILABLE
          </span>
        </div>

        {editions.length > 0 ? (
          <div className="space-y-6">
            {editions.map((edition: WireEdition) => (
              <article
                key={edition.id}
                className="border border-[#DEDDD8] bg-[#FFFFFF] p-6 sm:p-8 hover:border-[#16213E] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3 font-mono text-[11px] uppercase text-[#73787E]">
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
                      {edition.published_at ? new Date(edition.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                    {edition.items && (
                      <>
                        <span>•</span>
                        <span>{edition.items.length} BRIEFING ITEMS</span>
                      </>
                    )}
                  </div>

                  <Link href={`/wire/${edition.slug}`} className="block group">
                    <h3 className="font-serif text-2xl font-bold text-[#0B0E12] group-hover:text-[#2563eb] transition-colors">
                      {edition.title}
                    </h3>
                  </Link>

                  {edition.preview_text && (
                    <p className="font-sans text-sm text-[#4B5157] leading-relaxed">
                      {edition.preview_text}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-4">
                  <Link
                    href={`/wire/${edition.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B0E12] text-[#FFFFFF] font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#16213E] transition-colors"
                  >
                    Read Briefing <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-[#DEDDD8] bg-[#F7F6F2] p-12 sm:p-16 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-12 h-12 mx-auto flex items-center justify-center bg-[#EAE8E1] border border-[#DEDDD8] text-[#4B5157]">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold uppercase text-[#0B0E12]">
              No Wire Editions Published Yet
            </h3>
            <p className="font-sans text-sm text-[#4B5157] leading-relaxed">
              The Wire publishes morning pre-market briefings (07:00 UTC) and evening market wraps (17:00 UTC). All briefings are curated strictly from verified stories published in The Lobby.
            </p>
            <div className="pt-2">
              <Link
                href="/lobby"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0B0E12] text-[#FFFFFF] font-mono text-xs uppercase font-bold tracking-wider hover:bg-[#16213E] transition-colors"
              >
                <Newspaper className="w-4 h-4" /> Go to The Lobby
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
