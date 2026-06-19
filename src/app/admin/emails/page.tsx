import { createInternalSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    type?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminEmailsPage({ searchParams }: Props) {
  const params = await searchParams;
  const typeFilter = params.type || "all";
  const statusFilter = params.status || "all";
  const currentPage = parseInt(params.page || "1");
  const limit = 20;
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  const supabase = createInternalSupabase();

  // 1. Build Query
  let query = supabase
    .from("email_sends")
    .select("*", { count: "exact" })
    .order("generated_at", { ascending: false });

  if (typeFilter !== "all") {
    query = query.eq("type", typeFilter);
  }
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  // Range-bound queries for pagination
  const { data: sends, count, error } = await query.range(from, to);

  if (error) {
    console.error("Failed to query email sends:", error);
  }

  const totalRecords = count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mkt-gbg border border-mkt-gbd text-mkt-grn uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 border border-amber-200 text-mkt-amb uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-mkt-rbg border border-red-200 text-mkt-red uppercase">FAILED</span>;
    }
  };

  const getReadableType = (type: string) => {
    switch (type) {
      case "morning_brief": return "Morning Brief";
      case "evening_wrap": return "Evening Wrap";
      case "welcome": return "Welcome Onboarding";
      case "weekly": return "Weekly Edition";
      default: return type;
    }
  };

  const getFilterUrl = (newParams: Record<string, string | number>) => {
    const updated = {
      type: typeFilter,
      status: statusFilter,
      page: currentPage.toString(),
      ...newParams
    };
    const queryParts = [];
    if (updated.type !== "all") queryParts.push(`type=${updated.type}`);
    if (updated.status !== "all") queryParts.push(`status=${updated.status}`);
    if (updated.page !== "1") queryParts.push(`page=${updated.page}`);
    return `/admin/emails` + (queryParts.length > 0 ? `?${queryParts.join("&")}` : "");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">Emails Sent</h1>
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">Campaign History & Dispatch Logs</p>
        </div>
        <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-mkt-i3 hover:text-mkt-ink transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-mkt-bd p-5 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-xs font-mono text-mkt-i3">
          <Filter className="w-4 h-4 text-mkt-grn" />
          <span>FILTERS:</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-mkt-i3 uppercase tracking-wider block font-bold">Category</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                window.location.href = getFilterUrl({ type: e.target.value, page: 1 });
              }}
              className="bg-neutral-50 border border-mkt-bd rounded px-3 py-1.5 text-xs text-mkt-ink outline-none focus:border-mkt-ink focus:ring-1 focus:ring-mkt-ink"
            >
              <option value="all">All Categories</option>
              <option value="morning_brief">Morning Briefs</option>
              <option value="evening_wrap">Evening Wraps</option>
              <option value="welcome">Welcome Onboardings</option>
              <option value="weekly">Weekly Editions</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-mkt-i3 uppercase tracking-wider block font-bold">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                window.location.href = getFilterUrl({ status: e.target.value, page: 1 });
              }}
              className="bg-neutral-50 border border-mkt-bd rounded px-3 py-1.5 text-xs text-mkt-ink outline-none focus:border-mkt-ink focus:ring-1 focus:ring-mkt-ink"
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Logs Table */}
      <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-mkt-i2">
            <thead>
              <tr className="border-b border-mkt-bd pb-2 text-[10px] uppercase font-mono tracking-wider text-mkt-i3">
                <th className="py-3 font-semibold">Date/Time</th>
                <th className="py-3 font-semibold">Type</th>
                <th className="py-3 font-semibold">Subject</th>
                <th className="py-3 font-semibold">Recipients</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sends && sends.length > 0 ? (
                sends.map((send) => (
                  <tr key={send.id} className="border-b border-mkt-bd hover:bg-neutral-50 transition-colors">
                    <td className="py-4 font-mono text-mkt-i3">
                      {new Date(send.generated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="py-4 font-semibold text-mkt-ink">{getReadableType(send.type)}</td>
                    <td className="py-4 truncate max-w-[250px]">{send.subject}</td>
                    <td className="py-4 font-mono">{send.recipient_count}</td>
                    <td className="py-4">{getStatusPill(send.status)}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/emails/${send.id}`}
                        className="text-[10px] font-mono uppercase tracking-widest text-mkt-grn hover:text-mkt-i2 hover:underline"
                      >
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-mkt-i4 font-mono">
                    No email send history found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-mkt-bd pt-4 text-xs font-mono">
            <span className="text-mkt-i3">
              Showing {from + 1} - {Math.min(to + 1, totalRecords)} of {totalRecords} records
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getFilterUrl({ page: currentPage - 1 })}
                  className="p-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-mkt-bd text-mkt-i4 rounded opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <span className="px-3 text-mkt-ink">Page {currentPage} of {totalPages}</span>

              {currentPage < totalPages ? (
                <Link
                  href={getFilterUrl({ page: currentPage + 1 })}
                  className="p-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-i3 hover:text-mkt-ink rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-mkt-bd text-mkt-i4 rounded opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
