"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Share2 } from "lucide-react";
import type { LobbyArticle } from "@/types/lobby";
import { adaptLobbyArticleToSocial } from "@/lib/social-engine";

interface SocialDistributionClientProps {
  articles: LobbyArticle[];
}

export function SocialDistributionClient({ articles }: SocialDistributionClientProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || "");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];
  const socialDrafts = selectedArticle ? adaptLobbyArticleToSocial(selectedArticle) : null;

  async function copyToClipboard(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  }

  if (articles.length === 0) {
    return (
      <div className="p-12 text-center border border-zinc-800 bg-zinc-950">
        <p className="font-mono text-xs uppercase text-zinc-500">
          No published Lobby articles available for distribution. Publish an article first.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Article Picker */}
      <div className="lg:col-span-1 space-y-3">
        <label className="block text-xs font-mono uppercase text-zinc-400">
          Select Article to Distribute
        </label>
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {articles.map((art) => {
            const active = art.id === selectedArticle?.id;
            return (
              <div
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className={`p-3 border cursor-pointer transition-all ${
                  active
                    ? "bg-zinc-900 border-blue-500 text-white"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300">
                  {art.category}
                </span>
                <h4 className="font-sans text-xs font-semibold mt-1 line-clamp-2">
                  {art.title}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Formatted Channel Drafts */}
      <div className="lg:col-span-2 space-y-6">
        {socialDrafts && selectedArticle && (
          <>
            {/* X / Twitter */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold">
                  X / TWITTER POST (PUNCHY HOOK + BULLETS + CANONICAL LINK)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('x', socialDrafts.x.fullPost)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase"
                >
                  {copiedKey === 'x' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'x' ? "Copied" : "Copy Post"}
                </button>
              </div>
              <pre className="font-sans text-xs text-zinc-200 whitespace-pre-wrap bg-zinc-900/60 p-4 border border-zinc-800/80 leading-relaxed">
                {socialDrafts.x.fullPost}
              </pre>
            </div>

            {/* LinkedIn */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold">
                  LINKEDIN (MARKET ANALYSIS + DISCUSSION PROMPT)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('linkedin', socialDrafts.linkedin.fullPost)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase"
                >
                  {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'linkedin' ? "Copied" : "Copy Post"}
                </button>
              </div>
              <pre className="font-sans text-xs text-zinc-200 whitespace-pre-wrap bg-zinc-900/60 p-4 border border-zinc-800/80 leading-relaxed">
                {socialDrafts.linkedin.fullPost}
              </pre>
            </div>

            {/* Instagram */}
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-mono text-xs uppercase tracking-wider text-purple-400 font-bold">
                  INSTAGRAM (CAROUSEL OUTLINE & CAPTION)
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('instagram', socialDrafts.instagram.caption)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono uppercase"
                >
                  {copiedKey === 'instagram' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'instagram' ? "Copied" : "Copy Caption"}
                </button>
              </div>

              <div className="text-xs font-mono text-zinc-400 space-y-1">
                <div className="font-bold text-zinc-300">Carousel Slides ({socialDrafts.instagram.slides.length} slides):</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {socialDrafts.instagram.slides.map((s, idx) => (
                    <div key={idx} className="p-2.5 bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                      <span className="text-purple-400 font-bold">SLIDE 0{idx + 1}:</span>
                      <p className="mt-1 whitespace-pre-wrap">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Caption</label>
                <pre className="font-sans text-xs text-zinc-200 whitespace-pre-wrap bg-zinc-900/60 p-3 border border-zinc-800/80 leading-relaxed">
                  {socialDrafts.instagram.caption}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
