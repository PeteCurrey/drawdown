// src/app/admin/wire/page.tsx
import React from "react";
import Link from "next/link";
import { Plus, Mail, Clock, Eye, Send, ArrowRight } from "lucide-react";
import { createInternalSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "The Wire Briefings | Drawdown Admin",
  robots: { index: false, follow: false },
};

export default async function AdminWirePage() {
  const supabase = await createInternalSupabase();
  const { data: editions } = await supabase
    .from("wire_editions")
    .select(`
      *,
      items:wire_edition_items(count)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-zinc-500 mb-1">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            <span>Distribution Engine</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            The Wire — Briefing Curator
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Twice-daily curated market briefing layer. Items reference canonical Lobby stories without duplicate content.
          </p>
        </div>
        <Link
          href="/admin/wire/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Curate New Edition
        </Link>
      </div>

      {editions && editions.length > 0 ? (
        <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="p-3">TYPE</th>
                <th className="p-3">TITLE / SLUG</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">ITEMS</th>
                <th className="p-3">SCHEDULED / PUBLISHED</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {editions.map((ed: any) => (
                <tr key={ed.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold ${
                      ed.edition_type === 'BREAKING'
                        ? 'bg-red-950/60 text-red-400 border border-red-900/50'
                        : ed.edition_type === 'MORNING'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-900/50'
                        : 'bg-blue-950/60 text-blue-300 border border-blue-900/50'
                    }`}>
                      {ed.edition_type}
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    <div className="font-bold text-white">{ed.title}</div>
                    <div className="text-[11px] font-mono text-zinc-500">{ed.slug}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] ${
                      ed.status === 'PUBLISHED'
                        ? 'text-emerald-400 bg-emerald-950/50'
                        : ed.status === 'SCHEDULED'
                        ? 'text-blue-400 bg-blue-950/50'
                        : 'text-zinc-400 bg-zinc-800'
                    }`}>
                      {ed.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-400">
                    {ed.items?.[0]?.count || 0} items
                  </td>
                  <td className="p-3 text-zinc-500 text-[11px]">
                    {ed.published_at
                      ? `Pub: ${new Date(ed.published_at).toLocaleDateString()}`
                      : ed.scheduled_for
                      ? `Sched: ${new Date(ed.scheduled_for).toLocaleDateString()}`
                      : `Created ${new Date(ed.created_at).toLocaleDateString()}`}
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/wire/${ed.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-zinc-400 hover:text-white mr-3"
                      title="View public edition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border border-zinc-800 bg-zinc-950 space-y-4">
          <Mail className="w-8 h-8 text-zinc-600 mx-auto" />
          <h3 className="font-mono text-sm uppercase text-zinc-300">No Wire Editions Curated Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Create your first Morning or Evening Wire briefing by picking published canonical Lobby stories.
          </p>
          <Link
            href="/admin/wire/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-zinc-200"
          >
            Curate Morning Wire <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
