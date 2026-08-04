"use client";

import { useState, useEffect } from "react";
import { 
  updateAcceleratorWeekAction 
} from "@/app/actions/accelerator-actions";
import { AcceleratorSubNav } from "@/components/admin/AcceleratorSubNav";
import { createClient } from "@/lib/supabase/client";
import { 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Edit3, 
  Check, 
  X, 
  RefreshCw,
  Sparkles
} from "lucide-react";

export default function AdminAcceleratorCurriculumPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeks, setWeeks] = useState<any[]>([]);

  // Editing week state
  const [editingWeek, setEditingWeek] = useState<any | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    quote: "",
    coreModulesText: "",
    milestoneDescription: "",
    personalInputDescription: "",
    toolingName: ""
  });

  const loadWeeks = async () => {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { data, error: err } = await supabase
        .from("accelerator_weeks")
        .select("*")
        .order("week_number", { ascending: true });

      if (err) {
        setError(err.message);
      } else {
        setWeeks(data || []);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeeks();
  }, []);

  const handleUpdateWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeek) return;

    setSubmittingEdit(true);
    try {
      const modulesArray = editForm.coreModulesText
        .split("\n")
        .map(m => m.trim())
        .filter(Boolean);

      const res = await updateAcceleratorWeekAction(editingWeek.week_number, {
        title: editForm.title,
        quote: editForm.quote,
        coreModules: modulesArray,
        milestoneDescription: editForm.milestoneDescription,
        personalInputDescription: editForm.personalInputDescription,
        toolingName: editForm.toolingName
      });

      if (res.success) {
        setEditingWeek(null);
        await loadWeeks();
      } else {
        alert(res.error || "Failed to update week content.");
      }
    } catch (err: any) {
      alert(err.message || "Error updating week content.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AcceleratorSubNav />
        <div className="flex flex-col justify-center items-center gap-4 py-24">
          <Loader2 className="w-8 h-8 text-neutral-800 animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">// LOADING CURRICULUM EDITOR...</p>
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
            // ACCELERATOR SYLLABUS EDITOR
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight text-neutral-900 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-indigo-600" />
            Curriculum Syllabus & Content
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Customize and refine the 6-week systematic trading curriculum titles, quotes, required milestones, and tooling assignments.
          </p>
        </div>

        <button 
          onClick={loadWeeks}
          className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-mono text-[10px] flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* 6 WEEKS GRID */}
      <div className="space-y-6">
        {weeks.map((w: any) => (
          <div key={w.week_number} className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-md">
                    WEEK {w.week_number}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 font-display">{w.title}</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-1 italic">&quot;{w.quote}&quot;</p>
              </div>

              <button
                onClick={() => {
                  setEditingWeek(w);
                  setEditForm({
                    title: w.title || "",
                    quote: w.quote || "",
                    coreModulesText: Array.isArray(w.core_modules) ? w.core_modules.join("\n") : "",
                    milestoneDescription: w.milestone_description || "",
                    personalInputDescription: w.personal_input_description || "",
                    toolingName: w.tooling_name || ""
                  });
                }}
                className="px-3.5 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-800 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT SYLLABUS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              {/* Core Modules */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Core Modules
                </span>
                <ul className="space-y-1 font-sans text-neutral-700 text-xs">
                  {Array.isArray(w.core_modules) && w.core_modules.map((m: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-indigo-500 font-mono text-[10px]">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Milestone Deliverable */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">
                  Required Milestone Deliverable
                </span>
                <p className="font-sans text-neutral-700 text-xs leading-relaxed">
                  {w.milestone_description}
                </p>
                <div className="pt-1">
                  <span className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-mono font-bold">
                    Tooling: {w.tooling_name}
                  </span>
                </div>
              </div>

              {/* Personal Reflection Input */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 space-y-2">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block">
                  Personal Input Requirement
                </span>
                <p className="font-sans text-neutral-700 text-xs leading-relaxed">
                  {w.personal_input_description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT SYLLABUS MODAL */}
      {editingWeek && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 w-full max-w-2xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold uppercase text-neutral-900 font-display">
                Edit Week {editingWeek.week_number} Syllabus Content
              </h3>
              <button onClick={() => setEditingWeek(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateWeek} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Week Title</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 font-sans font-bold"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Syllabus Quote / Epigraph</label>
                <input 
                  type="text"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans italic"
                  value={editForm.quote}
                  onChange={(e) => setEditForm({ ...editForm, quote: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Core Modules (One per line)</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-sans"
                  value={editForm.coreModulesText}
                  onChange={(e) => setEditForm({ ...editForm, coreModulesText: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-neutral-400">Milestone Deliverable Description</label>
                <textarea 
                  rows={3}
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-sans"
                  value={editForm.milestoneDescription}
                  onChange={(e) => setEditForm({ ...editForm, milestoneDescription: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Personal Input Requirement</label>
                  <textarea 
                    rows={3}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 font-sans"
                    value={editForm.personalInputDescription}
                    onChange={(e) => setEditForm({ ...editForm, personalInputDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-neutral-400">Tooling / Framework Name</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 font-sans"
                    value={editForm.toolingName}
                    onChange={(e) => setEditForm({ ...editForm, toolingName: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingWeek(null)}
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
                  <span>SAVE SYLLABUS EDITS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
