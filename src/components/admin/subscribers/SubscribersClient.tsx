"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search, Download, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getAllActiveSubscribersAction } from "@/app/actions/admin-actions";

interface Subscriber {
  id: string;
  email: string;
  first_name: string | null;
  source: string | null;
  subscribed_at: string;
  subscribed_morning: boolean;
  subscribed_evening: boolean;
  subscribed_weekly: boolean;
  is_active: boolean;
}

interface SubscribersClientProps {
  subscribers: Subscriber[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  from: number;
  to: number;
}

export function SubscribersClient({
  subscribers,
  totalRecords,
  currentPage,
  totalPages,
  searchQuery: initialSearch,
  from,
  to
}: SubscribersClientProps) {
  const [search, setSearch] = useState(initialSearch);
  const [exporting, setExporting] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    window.location.href = `/admin/subscribers` + query;
  };

  const getPageUrl = (page: number) => {
    const searchPart = search ? `&search=${encodeURIComponent(search)}` : "";
    return `/admin/subscribers?page=${page}${searchPart}`;
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const activeSubs = await getAllActiveSubscribersAction();
      
      const headers = ["Email", "First Name", "Source", "Subscribed At", "Morning", "Evening", "Weekly", "Active"];
      const rows = activeSubs.map(sub => [
        sub.email,
        sub.first_name || "Trader",
        sub.source || "signup",
        new Date(sub.subscribed_at).toISOString(),
        sub.subscribed_morning ? "TRUE" : "FALSE",
        sub.subscribed_evening ? "TRUE" : "FALSE",
        sub.subscribed_weekly ? "TRUE" : "FALSE",
        sub.is_active ? "TRUE" : "FALSE"
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `drawdown_active_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Export subscribers CSV failed:", err);
      alert("Failed to export active subscribers list.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-mkt-bd pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">Subscribers</h1>
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">Subscriber List & Management</p>
        </div>
        <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-mkt-i3 hover:text-mkt-ink transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Control Strip */}
      <div className="bg-white border border-mkt-bd p-5 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-2.5 pl-10 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans placeholder:text-mkt-i4"
          />
          <Search className="w-4 h-4 text-mkt-i4 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-mkt-bd hover:bg-neutral-50 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 cursor-pointer rounded-lg"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin text-mkt-grn" /> : <Download className="w-4 h-4 text-mkt-grn" />}
          Export CSV (Active)
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-mkt-i2">
            <thead>
              <tr className="border-b border-mkt-bd pb-2 text-[10px] uppercase font-mono tracking-wider text-mkt-i3">
                <th className="py-3 font-semibold">Email</th>
                <th className="py-3 font-semibold">Name</th>
                <th className="py-3 font-semibold">Source</th>
                <th className="py-3 font-semibold">Subscribed At</th>
                <th className="py-3 font-semibold text-center">Morning</th>
                <th className="py-3 font-semibold text-center">Evening</th>
                <th className="py-3 font-semibold text-center">Active</th>
              </tr>
            </thead>
            <tbody>
              {subscribers && subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-mkt-bd hover:bg-neutral-50 transition-colors">
                    <td className="py-4 font-semibold text-mkt-ink">{sub.email}</td>
                    <td className="py-4">{sub.first_name || "Trader"}</td>
                    <td className="py-4 font-mono text-[10px] text-mkt-i3">{sub.source || "signup"}</td>
                    <td className="py-4 font-mono text-mkt-i3">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 text-center">
                      {sub.subscribed_morning ? (
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-mkt-i4 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {sub.subscribed_evening ? (
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-mkt-i4 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {sub.is_active ? (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-mkt-gbg border border-mkt-gbd text-mkt-grn uppercase">ACTIVE</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-mkt-rbg border border-red-200 text-mkt-red uppercase">INACTIVE</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-mkt-i4 font-mono">
                    No subscribers found matching search criteria.
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
              Showing {from + 1} - {Math.min(to + 1, totalRecords)} of {totalRecords} subscribers
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getPageUrl(currentPage - 1)}
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
                  href={getPageUrl(currentPage + 1)}
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
