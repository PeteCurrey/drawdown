import Link from "next/link";
import { getLobbyArticlesAdmin } from "@/lib/lobby-admin";
import type { LobbyStatus } from "@/types/lobby";
import { Plus, Search } from "lucide-react";
import { LobbyListClient } from "./LobbyListClient";

export const dynamic = "force-dynamic";

interface AdminLobbyPageProps {
  searchParams: Promise<{
    status?: LobbyStatus;
    q?: string;
    page?: string;
  }>;
}

export default async function AdminLobbyPage({ searchParams }: AdminLobbyPageProps) {
  const params = await searchParams;
  const currentStatus = params.status;
  const currentQuery = params.q || "";
  const currentPage = parseInt(params.page || "1", 10);

  const { articles, totalCount, totalPages } = await getLobbyArticlesAdmin({
    status: currentStatus,
    query: currentQuery,
    page: currentPage,
    pageSize: 20,
  });

  const STATUS_TABS: Array<{ label: string; value?: LobbyStatus }> = [
    { label: "All Stories" },
    { label: "Drafts", value: "DRAFT" },
    { label: "Under Review", value: "REVIEW" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-mkt-bd">
        <div>
          <span className="text-mkt-i4 font-mono text-[9px] uppercase tracking-widest block mb-1">
            // EDITORIAL COMMAND &amp; PUBLISHING ENGINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-mkt-ink">
            The Lobby CMS.
          </h1>
          <p className="text-sm text-mkt-i3 font-sans mt-1">
            Manage, review, audit, and publish verified trading intelligence and broadsheet dispatches.
          </p>
        </div>

        <Link
          href="/admin/lobby/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16213E] text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-black transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {STATUS_TABS.map((tab) => {
            const isActive = currentStatus === tab.value;
            const href = tab.value
              ? `/admin/lobby?status=${tab.value}${currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""}`
              : `/admin/lobby${currentQuery ? `?q=${encodeURIComponent(currentQuery)}` : ""}`;

            return (
              <Link
                key={tab.label}
                href={href}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-colors shrink-0 ${
                  isActive
                    ? "bg-mkt-ink text-white font-bold"
                    : "bg-white text-mkt-i3 border border-mkt-bd hover:text-mkt-ink"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <form method="GET" action="/admin/lobby" className="flex gap-2">
          {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-mkt-i4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={currentQuery}
              placeholder="Search title, slug..."
              className="pl-8 pr-3 py-1.5 text-xs font-mono bg-white border border-mkt-bd rounded-lg focus:outline-none focus:border-mkt-ink w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-white border border-mkt-bd rounded-lg hover:bg-neutral-100"
          >
            Find
          </button>
        </form>
      </div>

      {/*
        LobbyListClient owns:
          - Per-row checkboxes (DRAFT/REVIEW only)
          - Select-all control
          - Bulk-approve toolbar + API call
          - Pipeline-generated article badge
          - Pagination display
      */}
      <LobbyListClient
        articles={articles}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
