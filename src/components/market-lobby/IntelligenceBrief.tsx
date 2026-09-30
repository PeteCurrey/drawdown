"use client";

import React from "react";
import Link from "next/link";
import { Newspaper, ArrowUpRight, Clock, BookOpen } from "lucide-react";
import { LobbyArticle } from "@/types/lobby";
import { getEditorialFreshness, formatArchiveDate } from "@/lib/lobby-freshness";

interface IntelligenceBriefProps {
  articles: LobbyArticle[];
}

export function IntelligenceBrief({ articles }: IntelligenceBriefProps) {
  return (
    <div className="rounded-2xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#FFF4EC] text-[#F9771D]">
              <Newspaper className="h-3 w-3" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A]">
              Macro & Industry Brief
            </h2>
          </div>
          <p className="text-xs text-[#555550]">
            Editorial desk coverage on central bank releases, market structure, and macro flow.
          </p>
        </div>

        <Link
          href="/dashboard/the-wire"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F9771D] hover:text-[#e06512] transition"
        >
          <span>The Wire Desk</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-[#E8E6E1] bg-[#F7F7F5] p-6 text-center text-xs text-[#888882]">
          No intelligence briefs available currently. Check The Wire for incoming bulletins.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map((art) => {
            const freshness = getEditorialFreshness(art.published_at);

            return (
              <div
                key={art.id}
                className="group flex flex-col justify-between rounded-xl border border-[#E8E6E1] bg-[#F7F7F5]/50 p-4 transition hover:bg-white hover:border-[#F9771D]/40 hover:shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-white border border-[#E8E6E1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                      {art.category.replace(/_/g, " ")}
                    </span>
                    {freshness.label && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${freshness.badgeClass}`}>
                        {freshness.label}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/lobby/${art.slug}`}
                    className="block font-display text-sm font-bold text-[#1A1A1A] group-hover:text-[#F9771D] transition line-clamp-2 leading-snug"
                  >
                    {art.title}
                  </Link>

                  {art.excerpt && (
                    <p className="text-xs text-[#555550] line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8E6E1]/70 flex items-center justify-between text-[10px] text-[#888882]">
                  <span>{formatArchiveDate(art.published_at)}</span>
                  <Link
                    href={`/lobby/${art.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#1A1A1A] group-hover:text-[#F9771D]"
                  >
                    <span>Read Brief</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
