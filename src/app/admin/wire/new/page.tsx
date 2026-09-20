// src/app/admin/wire/new/page.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getLobbyArticles } from "@/lib/lobby";
import { WireCuratorForm } from "@/components/admin/wire/WireCuratorForm";

export const metadata = {
  title: "Curate New Wire Edition | Drawdown Admin",
  robots: { index: false, follow: false },
};

export default async function NewWireEditionPage() {
  // Fetch recently published Lobby articles available for curation
  const articles = await getLobbyArticles({ limit: 30 });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <Link
            href="/admin/wire"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-300 uppercase mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Wire Briefings
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-blue-400" />
            Curate New Wire Edition
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Select canonical Lobby stories to compile into a structured twice-daily briefing.
          </p>
        </div>
      </div>

      <WireCuratorForm availableArticles={articles} />
    </div>
  );
}
