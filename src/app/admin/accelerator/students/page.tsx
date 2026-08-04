"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getAcceleratorAdminDashboardAction, 
  manuallyEnrolStudentAction,
  updateEnrolmentAction
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { 
  Loader2, 
  AlertCircle, 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  X, 
  Check, 
  RefreshCw,
  Edit2
} from "lucide-react";

export default function AdminAcceleratorStudentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [enrolments, setEnrolments] = useState<any[]>([]);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCohortFilter, setSelectedCohortFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Manual enrol modal state
  const [showEnrolModal, setShowEnrolModal] = useState(false);
  const [submittingEnrol, setSubmittingEnrol] = useState(false);
  const [enrolForm, setEnrolForm] = useState({
    email: "",
    cohortId: "",
    paymentStatus: "paid" as "paid" | "unpaid" | "refunded"
  });

  // Quick Edit Modal
  const [editingEnrolment, setEditingEnrolment] = useState<any | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    currentWeek: 1,
    paymentStatus: "paid" as "paid" | "unpaid" | "refunded"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorAdminDashboardAction();
      if (!res.success) {
        setError(res.error || "Failed to load student roster.");
        return;
      }
      setCohorts(res.cohorts || []);
      setEnrolments(res.enrolments || []);
      if (res.cohorts && res.cohorts.length > 0 && !enrolForm.cohortId) {
        setEnrolForm(prev => ({ ...prev, cohortId: res.cohorts[0].id }));
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleManualEnrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrolForm.email || !enrolForm.cohortId) {
      alert("Email address and target cohort are required.");
      return;
    }

    setSubmittingEnrol(true);
    try {
      const res = await manuallyEnrolStudentAction({
        email: enrolForm.email,
        cohortId: enrolForm.cohortId,
        paymentStatus: enrolForm.paymentStatus
      });

      if (res.success) {
        setShowEnrolModal(false);
        setEnrolForm({ email: "", cohortId: cohorts[0]?.id || "", paymentStatus: "paid" });
        await loadData();
      } else {
        alert(res.error || "Failed to enrol student.");
      }
    } catch (err: any) {
      alert(err.message || "Error enrolling student.");
    } finally {
      setSubmittingEnrol(false);
    }
  };

  const handleUpdateEnrolment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnrolment) return;

    setSubmittingEdit(true);
    try {
      const res = await updateEnrolmentAction(editingEnrolment.id, {
        currentWeek: Number(editForm.currentWeek),
        paymentStatus: editForm.paymentStatus
      });

      if (res.success) {
        setEditingEnrolment(null);
        await loadData();
      } else {
        alert(res.error || "Failed to update enrolment.");
      }
    } catch (err: any) {
      alert(err.message || "Error updating enrolment.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Filter enrolments
  const filteredEnrolments = enrolments.filter((e: any) => {
    const name = e.profile?.display_name || "";
    const email = e.profile?.email || "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCohort = selectedCohortFilter === "all" || e.cohort_id === selectedCohortFilter;
    const matchesStatus = selectedStatusFilter === "all" || e.payment_status === selectedStatusFilter;

    return matchesSearch && matchesCohort && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING STUDENT ROSTER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AcceleratorSubNav />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
        <div>
          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block mb-1">
            // ACTIVE STUDENT ROSTER
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900 flex items-center gap-3">
            <Users className="w-7 h-7 text-emerald-600" />
            Student Roster & Dossiers
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage active accelerator enrollments, review student progress, and provision manual access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            className="px-3.5 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-mono text-[10px] flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            REFRESH
          </button>
          <button 
            onClick={() => setShowEnrolModal(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            ENROL STUDENT
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search student name or email..."
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-3 py-2 text-xs font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
          <select 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
            value={selectedCohortFilter}
            onChange={(e) => setSelectedCohortFilter(e.target.value)}
          >
            <option value="all">All Cohorts ({cohorts.length})</option>
            {cohorts.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-xs font-mono"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid & Active</option>
            <option value="unpaid">Unpaid / Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* ROSTER TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="p-4">// Student</th>
                <th className="p-4">// Cohort</th>
                <th className="p-4">// Payment Status</th>
                <th className="p-4">// Progression</th>
                <th className="p-4">// Enrolled Date</th>
                <th className="p-4 text-right">// Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {filteredEnrolments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 font-mono">
                    No student enrolments matched criteria.
                  </td>
                </tr>
              ) : (
                filteredEnrolments.map((e: any) => (
                  <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <Link href={`/admin/accelerator/students/${e.id}`} className="group">
                        <p className="font-sans font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                          <span>{e.profile?.display_name || "Anonymous Student"}</span>
                          <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-600" />
                        </p>
                        <p className="text-[10px] text-neutral-400">{e.profile?.email}</p>
                      </Link>
                    </td>
                    <td className="p-4 font-sans text-neutral-700 font-medium">
                      {e.cohort?.name || "Standard Cohort"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold font-mono tracking-wider ${
                        e.payment_status === "paid" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : e.payment_status === "unpaid" 
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {e.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-md text-[10px]">
                        Week {e.current_week} / 6
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-[10px]">
                      {new Date(e.enrolled_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEnrolment(e);
                          setEditForm({
                            currentWeek: e.current_week || 1,
                            paymentStatus: e.payment_status || "paid"
                          });
                        }}
                        className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Quick Edit Enrolment"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <Link 
                        href={`/admin/accelerator/students/${e.id}`}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                      >
                        <span>Dossier</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL ENROL MODAL */}
      {showEnrolModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">Manually Enrol Student</h3>
              <button onClick={() => setShowEnrolModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualEnrol} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Student Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="student@example.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 font-sans"
                  value={enrolForm.email}
                  onChange={(e) => setEnrolForm({ ...enrolForm, email: e.target.value })}
                />
                <p className="text-[9px] text-neutral-400 font-mono">* Must match an existing registered Drawdown account email.</p>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Target Cohort Batch</label>
                <select 
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                  value={enrolForm.cohortId}
                  onChange={(e) => setEnrolForm({ ...enrolForm, cohortId: e.target.value })}
                >
                  <option value="">-- Select Cohort --</option>
                  {cohorts.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Payment Authorization Status</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                  value={enrolForm.paymentStatus}
                  onChange={(e) => setEnrolForm({ ...enrolForm, paymentStatus: e.target.value as any })}
                >
                  <option value="paid">Paid & Active</option>
                  <option value="unpaid">Unpaid / Manual Grant</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEnrolModal(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={submittingEnrol}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold flex items-center gap-2"
                >
                  {submittingEnrol ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>GRANT ENROLMENT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editingEnrolment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">Edit Student Progression</h3>
              <button onClick={() => setEditingEnrolment(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEnrolment} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Student Profile</label>
                <input 
                  type="text"
                  disabled
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2 font-sans font-bold text-neutral-700"
                  value={`${editingEnrolment.profile?.display_name || "Student"} (${editingEnrolment.profile?.email})`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Current Week Progression</label>
                  <select 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                    value={editForm.currentWeek}
                    onChange={(e) => setEditForm({ ...editForm, currentWeek: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6].map(w => (
                      <option key={w} value={w}>Week {w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Payment Status</label>
                  <select 
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                    value={editForm.paymentStatus}
                    onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value as any })}
                  >
                    <option value="paid">Paid & Active</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingEnrolment(null)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={submittingEdit}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold flex items-center gap-2"
                >
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>SAVE CHANGES</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
