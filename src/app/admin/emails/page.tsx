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
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/10 text-yellow-400 uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 uppercase">FAILED</span>;
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
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">Emails Sent</h1>
          <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">Campaign History & Dispatch Logs</p>
        </div>
        <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] hover:text-white transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0F111A] border border-[#1C1F2B] p-5 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8C8B87]">
          <Filter className="w-4 h-4 text-[#C8F135]" />
          <span>FILTERS:</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Category</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                window.location.href = getFilterUrl({ type: e.target.value, page: 1 });
              }}
              className="bg-[#12141F] border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#C8F135]"
            >
              <option value="all">All Categories</option>
              <option value="morning_brief">Morning Briefs</option>
              <option value="evening_wrap">Evening Wraps</option>
              <option value="welcome">Welcome Onboardings</option>
              <option value="weekly">Weekly Editions</option>
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-mono text-[#8C8B87] uppercase tracking-wider block font-bold">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                window.location.href = getFilterUrl({ status: e.target.value, page: 1 });
              }}
              className="bg-[#12141F] border border-white/10 rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#C8F135]"
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
      <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8C8B87]">
            <thead>
              <tr className="border-b border-white/5 pb-2 text-[10px] uppercase font-mono tracking-wider">
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
                  <tr key={send.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono">
                      {new Date(send.generated_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="py-4 font-medium text-white">{getReadableType(send.type)}</td>
                    <td className="py-4 truncate max-w-[250px]">{send.subject}</td>
                    <td className="py-4 font-mono">{send.recipient_count}</td>
                    <td className="py-4">{getStatusPill(send.status)}</td>
                    <td className="py-4">
                      <Link
                        href={`/admin/emails/${send.id}`}
                        className="text-[10px] font-mono uppercase tracking-widest text-[#C8F135] hover:underline"
                      >
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5C5B57] font-mono">
                    No email send history found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs font-mono">
            <span className="text-[#5C5B57]">
              Showing {from + 1} - {Math.min(to + 1, totalRecords)} of {totalRecords} records
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getFilterUrl({ page: currentPage - 1 })}
                  className="p-2 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-white/5 text-[#42413D] rounded opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              <span className="px-3 text-white">Page {currentPage} of {totalPages}</span>

              {currentPage < totalPages ? (
                <Link
                  href={getFilterUrl({ page: currentPage + 1 })}
                  className="p-2 border border-white/10 hover:border-white/20 text-[#8C8B87] hover:text-white rounded"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button disabled className="p-2 border border-white/5 text-[#42413D] rounded opacity-40">
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
