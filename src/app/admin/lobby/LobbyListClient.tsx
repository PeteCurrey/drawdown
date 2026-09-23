"use client";

/**
 * LobbyListClient — full interactive table + bulk-approve panel
 *
 * This Client Component renders the articles table with per-row checkboxes for
 * DRAFT/REVIEW items, a select-all control, and the Approve Selected button.
 * It is composed into the Server Component page (AdminLobbyPage) which handles
 * auth, DB fetching, and URL params.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  Edit3,
  ShieldCheck,
  AlertCircle,
  CheckSquare,
  Square,
  CheckCheck,
  Loader2,
} from "lucide-react";
import type { LobbyArticle } from "@/types/lobby";

interface Props {
  articles: LobbyArticle[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export function LobbyListClient({ articles, totalCount, totalPages, currentPage }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [flashResult, setFlashResult] = useState<{ approved: number; skipped: number } | null>(null);
  const [flashError, setFlashError] = useState<string | null>(null);

  // Only DRAFT / REVIEW rows are eligible for bulk-approve
  const eligible = articles.filter(a => a.status === "DRAFT" || a.status === "REVIEW");
  const hasQueue = eligible.length > 0;
  const allSelected = hasQueue && selected.size === eligible.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(eligible.map(a => a.id)));
  }

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleApprove() {
    if (selected.size === 0 || isPending) return;
    setFlashError(null);
    setFlashResult(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/lobby/bulk-approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: Array.from(selected) }),
        });
        const json = await res.json();

        if (!res.ok) {
          setFlashError(json.error || "Bulk approve failed");
          return;
        }

        setFlashResult({ approved: json.approved, skipped: json.skipped });
        setSelected(new Set());
        router.refresh(); // re-runs the server component to reload updated rows
      } catch (err: any) {
        setFlashError(err?.message ?? "Network error during bulk approve");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* ── Bulk-approve toolbar (only shown when queue items exist) ─────────── */}
      {hasQueue && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          {/* Select-all */}
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 text-xs font-mono text-amber-800 hover:text-amber-950 transition-colors"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4" />
            ) : someSelected ? (
              <CheckSquare className="w-4 h-4 opacity-50" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            {allSelected ? "Deselect all" : `Select all ${eligible.length} in queue`}
          </button>

          <span className="text-amber-200 hidden sm:inline">|</span>

          <span className="text-xs font-mono text-amber-700">
            {eligible.length} draft{eligible.length !== 1 ? "s" : ""} awaiting review
            {selected.size > 0 && ` · ${selected.size} selected`}
          </span>

          <div className="flex-1" />

          <button
            type="button"
            onClick={handleApprove}
            disabled={selected.size === 0 || isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            {isPending
              ? "Publishing…"
              : selected.size > 0
                ? `Approve ${selected.size} selected`
                : "Approve Selected"}
          </button>
        </div>
      )}

      {/* Flash messages */}
      {flashResult && (
        <div className="px-4 py-2 text-xs font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
          ✓ Published {flashResult.approved} article{flashResult.approved !== 1 ? "s" : ""}.
          {flashResult.skipped > 0 ? ` ${flashResult.skipped} already published (skipped).` : ""}
        </div>
      )}
      {flashError && (
        <div className="px-4 py-2 text-xs font-mono bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
          ✗ {flashError}
        </div>
      )}

      {/* ── Articles Table ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-mkt-bd rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-mkt-bd text-mkt-i3 uppercase tracking-wider text-[10px]">
                {/* Checkbox header — only when queue exists */}
                {hasQueue && <th className="py-3 px-3 w-8" />}
                <th className="py-3 px-4">Headline &amp; Slug</th>
                <th className="py-3 px-4">Category / Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Sources</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mkt-bd">
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={hasQueue ? 8 : 7}
                    className="py-12 text-center text-mkt-i4 font-mono"
                  >
                    No articles found matching criteria. Click &quot;New Article&quot; to author a dispatch.
                  </td>
                </tr>
              ) : (
                articles.map((art) => {
                  const sourcesCount = Array.isArray(art.sources)
                    ? art.sources.length
                    : art.primary_source_url
                      ? 1
                      : 0;
                  const isEligible = art.status === "DRAFT" || art.status === "REVIEW";
                  const isChecked = selected.has(art.id);
                  const isAutoGenerated = (art as any).editorial_metadata?.auto_generated === true;

                  return (
                    <tr
                      key={art.id}
                      className={`transition-colors ${
                        isChecked
                          ? "bg-emerald-50/60"
                          : "hover:bg-neutral-50/50"
                      }`}
                    >
                      {/* Checkbox cell */}
                      {hasQueue && (
                        <td className="py-3.5 px-3">
                          {isEligible ? (
                            <button
                              type="button"
                              onClick={() => toggleRow(art.id)}
                              className="text-mkt-i3 hover:text-emerald-600 transition-colors"
                              aria-label={isChecked ? "Deselect" : "Select for bulk approve"}
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <span className="w-4 h-4 block" />
                          )}
                        </td>
                      )}

                      <td className="py-3.5 px-4 max-w-sm">
                        <Link
                          href={`/admin/lobby/${art.id}`}
                          className="font-sans font-semibold text-mkt-ink text-sm hover:text-[#16213E] line-clamp-1 block"
                        >
                          {art.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-mkt-i4 font-mono">/{art.slug}</span>
                          {isAutoGenerated && (
                            <span className="text-[9px] font-mono uppercase tracking-wider px-1 py-0.5 bg-violet-100 text-violet-600 rounded-[2px]">
                              Pipeline
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-mkt-ink block">{art.category}</span>
                        <span className="text-[10px] text-mkt-i4 block">{art.article_type}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-semibold ${
                            art.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800"
                              : art.status === "REVIEW"
                                ? "bg-amber-100 text-amber-800"
                                : art.status === "ARCHIVED"
                                  ? "bg-neutral-200 text-neutral-800"
                                  : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-mkt-i3">
                          {art.confidence === "VERIFIED" ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          {art.confidence}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-mkt-i3">
                        {sourcesCount > 0 ? (
                          <span className="text-emerald-700 font-semibold">{sourcesCount} Verified</span>
                        ) : (
                          <span className="text-rose-600">0 Sources</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-mkt-i4 text-[11px]">
                        {new Date(art.updated_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/lobby/preview/${art.id}`}
                            target="_blank"
                            title="Preview layout"
                            className="p-1.5 text-mkt-i3 hover:text-mkt-ink bg-neutral-100 rounded-[2px]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/lobby/${art.id}`}
                            title="Edit story"
                            className="p-1.5 text-mkt-i3 hover:text-mkt-ink bg-neutral-100 rounded-[2px]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="py-3 px-4 bg-neutral-50/70 border-t border-mkt-bd flex items-center justify-between text-[11px] font-mono text-mkt-i3">
          <span>Total: {totalCount} Articles</span>
          <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
        </div>
      </div>
    </div>
  );
}
