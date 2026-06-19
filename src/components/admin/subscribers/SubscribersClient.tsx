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
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-display font-black uppercase text-white tracking-tight">Subscribers</h1>
          <p className="text-xs text-[#8C8B87] font-mono uppercase tracking-widest mt-1">Subscriber List & Management</p>
        </div>
        <Link href="/admin" className="text-xs font-mono uppercase tracking-widest text-[#8C8B87] hover:text-white transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Control Strip */}
      <div className="bg-[#0F111A] border border-[#1C1F2B] p-5 rounded-xl flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#12141F] border border-white/10 rounded px-4 py-2.5 pl-10 text-xs text-white outline-none focus:border-[#C8F135] transition-colors font-sans placeholder:text-[#5C5B57]"
          />
          <Search className="w-4 h-4 text-[#5C5B57] absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 cursor-pointer"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin text-[#C8F135]" /> : <Download className="w-4 h-4 text-[#C8F135]" />}
          Export CSV (Active)
        </button>
      </div>

      {/* Subscribers Table */}
      <div className="bg-[#0F111A] border border-[#1C1F2B] p-6 rounded-xl space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#8C8B87]">
            <thead>
              <tr className="border-b border-white/5 pb-2 text-[10px] uppercase font-mono tracking-wider">
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
                  <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium text-white">{sub.email}</td>
                    <td className="py-4">{sub.first_name || "Trader"}</td>
                    <td className="py-4 font-mono text-[10px]">{sub.source || "signup"}</td>
                    <td className="py-4 font-mono">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 text-center">
                      {sub.subscribed_morning ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#42413D] mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {sub.subscribed_evening ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#42413D] mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {sub.is_active ? (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 uppercase">ACTIVE</span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-500/10 text-rose-400 uppercase">INACTIVE</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5C5B57] font-mono">
                    No subscribers found matching search criteria.
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
              Showing {from + 1} - {Math.min(to + 1, totalRecords)} of {totalRecords} subscribers
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getPageUrl(currentPage - 1)}
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
                  href={getPageUrl(currentPage + 1)}
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
