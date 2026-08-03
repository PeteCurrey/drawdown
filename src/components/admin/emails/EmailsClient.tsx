"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ChevronLeft, ChevronRight, Filter, Send, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface EmailSend {
  id: string;
  type: string;
  subject: string;
  recipient_count: number;
  status: string;
  generated_at: string;
  sent_at?: string;
}

interface EmailsClientProps {
  sends: EmailSend[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  typeFilter: string;
  statusFilter: string;
  from: number;
  to: number;
}

export function EmailsClient({
  sends,
  totalRecords,
  currentPage,
  totalPages,
  typeFilter,
  statusFilter,
  from,
  to,
}: EmailsClientProps) {
  const [triggering, setTriggering] = useState<string | null>(null);
  const [triggerMsg, setTriggerMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const getFilterUrl = (newParams: Record<string, string | number>) => {
    const updated = {
      type: typeFilter,
      status: statusFilter,
      page: currentPage.toString(),
      ...newParams,
    };
    const queryParts = [];
    if (updated.type !== "all") queryParts.push(`type=${updated.type}`);
    if (updated.status !== "all") queryParts.push(`status=${updated.status}`);
    if (updated.page !== "1") queryParts.push(`page=${updated.page}`);
    return `/admin/emails` + (queryParts.length > 0 ? `?${queryParts.join("&")}` : "");
  };

  const handleManualTrigger = async (emailType: "morning" | "evening") => {
    const label = emailType === "morning" ? "Morning Brief" : "Evening Wrap";
    if (!confirm(`Are you sure you want to generate and send the ${label} right now to all active subscribers?`)) {
      return;
    }

    setTriggering(emailType);
    setTriggerMsg(null);

    try {
      const endpoint = emailType === "morning" ? "/api/cron/morning-brief" : "/api/cron/evening-wrap";
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": "Bearer dd-sc-cr0n-s3cr3t-x9pQk2mNvR7wJtLh",
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTriggerMsg({
          type: "success",
          text: `${label} dispatched successfully! Sent to ${data.recipient_count || 0} subscribers.`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setTriggerMsg({
          type: "error",
          text: `Failed to dispatch ${label}: ${data.error || "Unknown server error"}`,
        });
      }
    } catch (err: any) {
      setTriggerMsg({
        type: "error",
        text: `Trigger error: ${err.message}`,
      });
    } finally {
      setTriggering(null);
    }
  };

  const getStatusPill = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "sent":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase">SENT</span>;
      case "pending":
      case "sending":
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-50 border border-amber-200 text-amber-700 uppercase">PENDING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-50 border border-rose-200 text-rose-700 uppercase">FAILED</span>;
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">Emails Dispatch Log</h1>
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">Campaign History &amp; Automated Email Control</p>
        </div>
        <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-mkt-i3 hover:text-mkt-ink transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Manual Dispatch Action Strip */}
      <div className="bg-white border border-mkt-bd p-5 rounded-xl space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-mkt-ink uppercase font-mono tracking-wider">Manual Campaign Trigger</h3>
            <p className="text-xs text-mkt-i3 font-sans mt-0.5">Instantly generate and broadcast automated market briefs to active subscribers</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleManualTrigger("morning")}
              disabled={!!triggering}
              className="flex items-center gap-2 px-4 py-2 bg-mkt-ink text-white hover:bg-neutral-800 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all disabled:opacity-50 cursor-pointer"
            >
              {triggering === "morning" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-[#C8F135]" />}
              Trigger Morning Brief
            </button>

            <button
              onClick={() => handleManualTrigger("evening")}
              disabled={!!triggering}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white hover:bg-black text-xs font-mono font-bold uppercase tracking-wider rounded transition-all disabled:opacity-50 cursor-pointer border border-neutral-700"
            >
              {triggering === "evening" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-sky-400" />}
              Trigger Evening Wrap
            </button>
          </div>
        </div>

        {triggerMsg && (
          <div className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${triggerMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"}`}>
            {triggerMsg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{triggerMsg.text}</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-mkt-bd p-5 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-xs font-mono text-mkt-i3 font-bold">
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
                        minute: "2-digit",
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
