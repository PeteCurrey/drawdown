// src/app/admin/lobby/distribution/page.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Sparkles } from "lucide-react";
import { getLobbyArticles } from "@/lib/lobby";
import { SocialDistributionClient } from "@/components/admin/lobby/SocialDistributionClient";

export const metadata = {
  title: "Social Distribution Engine | Drawdown Admin",
  robots: { index: false, follow: false },
};

export default async function SocialDistributionPage() {
  const articles = await getLobbyArticles({ limit: 25 });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <Link
            href="/admin/lobby"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 uppercase mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to The Lobby CMS
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-blue-400" />
            Social Distribution Engine
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Tailored native copy generation for X, LinkedIn, and Instagram driving traffic to canonical Lobby stories.
          </p>
        </div>
      </div>

      <SocialDistributionClient articles={articles} />
    </div>
  );
}
