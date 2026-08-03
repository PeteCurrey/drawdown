"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  UserPlus, 
  Trash2, 
  X, 
  Check, 
  AlertCircle 
} from "lucide-react";
import { 
  getAllActiveSubscribersAction, 
  addSubscriberAction, 
  deleteSubscriberAction, 
  toggleSubscriberStatusAction 
} from "@/app/actions/admin-actions";

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
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [exporting, setExporting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state for adding new subscriber
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newSource, setNewSource] = useState("admin_manual");
  const [subMorning, setSubMorning] = useState(true);
  const [subEvening, setSubEvening] = useState(true);
  const [subWeekly, setSubWeekly] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    window.location.href = `/admin/subscribers` + query;
  };

  const getPageUrl = (page: number) => {
    const searchPart = search ? `&search=${encodeURIComponent(search)}` : "";
    return `/admin/subscribers?page=${page}${searchPart}`;
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newEmail || !newEmail.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await addSubscriberAction({
        email: newEmail,
        first_name: newFirstName || undefined,
        source: newSource || "admin_manual",
        subscribed_morning: subMorning,
        subscribed_evening: subEvening,
        subscribed_weekly: subWeekly,
      });

      if (!res.success) {
        setFormError(res.error || "Failed to add subscriber.");
        return;
      }

      setIsAddModalOpen(false);
      setNewEmail("");
      setNewFirstName("");
      setNewSource("admin_manual");
      router.refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to add subscriber.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete subscriber ${email}? They will be permanently removed from email distributions.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteSubscriberAction(id, email);
      if (!res.success) {
        alert(`Delete failed: ${res.error}`);
        return;
      }
      router.refresh();
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    try {
      const res = await toggleSubscriberStatusAction(id, !currentActive);
      if (!res.success) {
        alert(`Status update failed: ${res.error}`);
        return;
      }
      router.refresh();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setTogglingId(null);
    }
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
          <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">Live Database Subscriber List &amp; Management</p>
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-mkt-ink text-white hover:bg-neutral-800 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer rounded-lg shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#C8F135]" />
            Add Subscriber
          </button>

          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-transparent border border-mkt-bd hover:bg-neutral-50 text-mkt-ink text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 disabled:opacity-50 cursor-pointer rounded-lg"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin text-mkt-grn" /> : <Download className="w-4 h-4 text-mkt-grn" />}
            Export CSV
          </button>
        </div>
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
                <th className="py-3 font-semibold text-center">Status</th>
                <th className="py-3 font-semibold text-right">Actions</th>
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
                      {sub.subscribed_morning !== false ? (
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-mkt-i4 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      {sub.subscribed_evening !== false ? (
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn mx-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-mkt-i4 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(sub.id, sub.is_active)}
                        disabled={togglingId === sub.id}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        title="Click to toggle Active status"
                      >
                        {togglingId === sub.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-mkt-i3" />
                        ) : sub.is_active ? (
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase">ACTIVE</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-50 border border-rose-200 text-rose-700 uppercase">INACTIVE</span>
                        )}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                        disabled={deletingId === sub.id}
                        className="p-1.5 text-mkt-i4 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Subscriber"
                      >
                        {deletingId === sub.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-mkt-i4 font-mono">
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

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-mkt-bd rounded-xl p-6 max-w-md w-full relative shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-mkt-bd pb-4">
              <div>
                <h3 className="text-lg font-display font-black text-mkt-ink uppercase tracking-tight">Add Subscriber</h3>
                <p className="text-xs text-mkt-i3 font-mono">Add new email to live broadcast list</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-mkt-i4 hover:text-mkt-ink p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-mkt-i3 font-bold block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="trader@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-mkt-i3 font-bold block">
                  First Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Pete"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-mkt-i3 font-bold block">
                  Source Tag
                </label>
                <input
                  type="text"
                  placeholder="admin_manual"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-neutral-50 border border-mkt-bd rounded px-3 py-2 text-xs text-mkt-ink outline-none focus:border-mkt-ink transition-colors font-sans"
                />
              </div>

              <div className="pt-2 border-t border-mkt-bd space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-mkt-i3 font-bold block">
                  Subscription Preferences
                </span>

                <label className="flex items-center gap-2 text-xs text-mkt-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subMorning}
                    onChange={(e) => setSubMorning(e.target.checked)}
                    className="accent-mkt-ink rounded"
                  />
                  <span>Morning Brief (Daily 7:00 AM)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-mkt-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subEvening}
                    onChange={(e) => setSubEvening(e.target.checked)}
                    className="accent-mkt-ink rounded"
                  />
                  <span>Evening Wrap (Daily 5:00 PM)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-mkt-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subWeekly}
                    onChange={(e) => setSubWeekly(e.target.checked)}
                    className="accent-mkt-ink rounded"
                  />
                  <span>Weekly Digest &amp; Market Updates</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-mkt-bd">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-mkt-bd text-mkt-i3 hover:text-mkt-ink text-xs font-mono uppercase font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-mkt-ink text-white hover:bg-neutral-800 text-xs font-mono font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
