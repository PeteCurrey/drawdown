"use client";

import { useState, useEffect } from "react";
import { 
  getAcceleratorAdminDashboardAction, 
  createCohortAction, 
  updateCohortAction 
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { 
  Loader2, 
  AlertCircle, 
  Layers, 
  Plus, 
  Edit3, 
  Calendar, 
  Users, 
  Check, 
  X,
  RefreshCw
} from "lucide-react";

export default function AdminAcceleratorCohortsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [enrolments, setEnrolments] = useState<any[]>([]);

  // Create form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    startDate: "",
    seatCap: 15,
    status: "upcoming" as "upcoming" | "active" | "closed"
  });

  // Edit form state
  const [editingCohort, setEditingCohort] = useState<any | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    startDate: "",
    seatCap: 15,
    status: "upcoming" as "upcoming" | "active" | "closed"
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAcceleratorAdminDashboardAction();
      if (!res.success) {
        setError(res.error || "Failed to load cohorts.");
        return;
      }
      setCohorts(res.cohorts || []);
      setEnrolments(res.enrolments || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.startDate) {
      alert("Cohort name and start date are required.");
      return;
    }

    setSubmittingCreate(true);
    try {
      const res = await createCohortAction({
        name: createForm.name,
        startDate: new Date(createForm.startDate).toISOString(),
        seatCap: Number(createForm.seatCap),
        status: createForm.status
      });

      if (res.success) {
        setShowCreateModal(false);
        setCreateForm({ name: "", startDate: "", seatCap: 15, status: "upcoming" });
        await loadData();
      } else {
        alert(res.error || "Failed to create cohort.");
      }
    } catch (err: any) {
      alert(err.message || "Error creating cohort.");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleUpdateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCohort) return;

    setSubmittingEdit(true);
    try {
      const res = await updateCohortAction(editingCohort.id, {
        name: editForm.name,
        startDate: new Date(editForm.startDate).toISOString(),
        seatCap: Number(editForm.seatCap),
        status: editForm.status
      });

      if (res.success) {
        setEditingCohort(null);
        await loadData();
      } else {
        alert(res.error || "Failed to update cohort.");
      }
    } catch (err: any) {
      alert(err.message || "Error updating cohort.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const getEnrolledCount = (cohortId: string) => {
    return enrolments.filter(e => e.cohort_id === cohortId && e.payment_status === "paid").length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING COHORTS...</p>
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
            // ACCELERATOR BATCH MANAGEMENT
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900 flex items-center gap-3">
            <Layers className="w-7 h-7 text-blue-600" />
            Cohort Batches
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Provision and configure operational cohort runs, set seat limits, and manage enrollment cycles.
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            CREATE COHORT
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* COHORTS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-mono text-[9px] uppercase tracking-wider">
                <th className="p-4">// Cohort Name</th>
                <th className="p-4">// Status</th>
                <th className="p-4">// Start Date</th>
                <th className="p-4">// Seats Occupied</th>
                <th className="p-4 text-right">// Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {cohorts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-400 font-mono">
                    No cohorts configured yet.
                  </td>
                </tr>
              ) : (
                cohorts.map((c: any) => {
                  const enrolled = getEnrolledCount(c.id);
                  const cap = c.seat_cap || 15;
                  const pct = Math.round((enrolled / cap) * 100);

                  return (
                    <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-sans font-bold text-neutral-900">
                        {c.name}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold font-mono tracking-wider ${
                          c.status === "active" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : c.status === "upcoming" 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{new Date(c.start_date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-neutral-400" />
                          <span className="font-bold">{enrolled}</span> / {cap}
                          <span className="text-[10px] text-neutral-400">({pct}%)</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingCohort(c);
                            setEditForm({
                              name: c.name,
                              startDate: new Date(c.start_date).toISOString().slice(0, 16),
                              seatCap: c.seat_cap || 15,
                              status: c.status
                            });
                          }}
                          className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-mono text-[10px] rounded-lg transition-colors inline-flex items-center gap-1.5 font-bold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          EDIT
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">Provision New Cohort Batch</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Cohort Title / Name</label>
                <input 
                  type="text"
                  required
                  placeholder="E.g. Q3 2026 Institutional Quant Cohort"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 font-sans"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Start Date / Time</label>
                  <input 
                    type="datetime-local"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                    value={createForm.startDate}
                    onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Seat Capacity</label>
                  <input 
                    type="number"
                    min={1}
                    max={100}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                    value={createForm.seatCap}
                    onChange={(e) => setCreateForm({ ...createForm, seatCap: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Initial Status</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                >
                  <option value="upcoming">Upcoming (Accepting Applications)</option>
                  <option value="active">Active (Currently Running)</option>
                  <option value="closed">Closed (Archived)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 font-bold"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  disabled={submittingCreate}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-bold flex items-center gap-2"
                >
                  {submittingCreate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>SAVE COHORT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCohort && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-lg shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">Edit Cohort Details</h3>
              <button onClick={() => setEditingCohort(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCohort} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Cohort Title / Name</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 font-sans"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Start Date / Time</label>
                  <input 
                    type="datetime-local"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-2"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Seat Capacity</label>
                  <input 
                    type="number"
                    min={1}
                    max={100}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                    value={editForm.seatCap}
                    onChange={(e) => setEditForm({ ...editForm, seatCap: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Cohort Operational Status</label>
                <select 
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingCohort(null)}
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
                  <span>UPDATE COHORT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
