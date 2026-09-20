import Link from "next/link";
import { getLobbyArticlesAdmin } from "@/lib/lobby-admin";
import type { LobbyStatus } from "@/types/lobby";
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

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

      {/* Articles Table */}
      <div className="bg-white border border-mkt-bd rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-neutral-50/70 border-b border-mkt-bd text-mkt-i3 uppercase tracking-wider text-[10px]">
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
                  <td colSpan={7} className="py-12 text-center text-mkt-i4 font-mono">
                    No articles found matching criteria. Click &quot;New Article&quot; to author a dispatch.
                  </td>
                </tr>
              ) : (
                articles.map((art) => {
                  const sourcesCount = Array.isArray(art.sources) ? art.sources.length : (art.primary_source_url ? 1 : 0);

                  return (
                    <tr key={art.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <Link 
                          href={`/admin/lobby/${art.id}`}
                          className="font-sans font-semibold text-mkt-ink text-sm hover:text-[#16213E] line-clamp-1 block"
                        >
                          {art.title}
                        </Link>
                        <span className="text-[10px] text-mkt-i4 font-mono block mt-0.5">
                          /{art.slug}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-mkt-ink block">{art.category}</span>
                        <span className="text-[10px] text-mkt-i4 block">{art.article_type}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-[2px] text-[10px] uppercase font-semibold ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : art.status === 'REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : art.status === 'ARCHIVED'
                            ? 'bg-neutral-200 text-neutral-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-mkt-i3">
                          {art.confidence === 'VERIFIED' ? (
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

        {/* Pagination Bar */}
        <div className="py-3 px-4 bg-neutral-50/70 border-t border-mkt-bd flex items-center justify-between text-[11px] font-mono text-mkt-i3">
          <span>Total: {totalCount} Articles</span>
          <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
        </div>
      </div>
    </div>
  );
}
