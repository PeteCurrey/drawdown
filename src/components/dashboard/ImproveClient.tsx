"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { 
  Plus,
  CheckCircle,
  Circle,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen
} from "lucide-react";
import Link from "next/link";

type CommitmentCategory = "process" | "risk" | "mindset" | "analysis";
type CommitmentStatus = "open" | "in_progress" | "closed";

const COMMITMENT_CATEGORIES: { key: CommitmentCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "process", label: "Process", icon: <Target className="w-3 h-3" />, color: "emerald" },
  { key: "risk", label: "Risk", icon: <TrendingUp className="w-3 h-3" />, color: "rose" },
  { key: "mindset", label: "Mindset", icon: <Lightbulb className="w-3 h-3" />, color: "amber" },
  { key: "analysis", label: "Analysis", icon: <BookOpen className="w-3 h-3" />, color: "blue" },
];

const CATEGORY_COLORS: Record<CommitmentCategory, string> = {
  process: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  risk: "border-rose-500/30 bg-rose-500/5 text-rose-400",
  mindset: "border-amber-500/30 bg-amber-500/5 text-amber-400",
  analysis: "border-blue-500/30 bg-blue-500/5 text-blue-400",
};

// Contextual lesson links — one per category, linking directly into the most
// relevant curriculum section for that improvement area.
const CATEGORY_LESSON_LINKS: Record<CommitmentCategory, { label: string; href: string }> = {
  process:  { label: "Review: Trade Plan Discipline",      href: "/dashboard/curriculum" },
  risk:     { label: "Read: Position Sizing & Risk Rules", href: "/dashboard/tools/position-sizer" },
  mindset:  { label: "Open: Psychology Coach",            href: "/dashboard/coach" },
  analysis: { label: "Study: Market Intelligence",        href: "/dashboard/market-intelligence" },
};

interface Commitment {
  id: string;
  user_id: string;
  title: string;
  category: CommitmentCategory;
  status: CommitmentStatus;
  origin_review_id: string | null;
  target_date: string | null;
  closed_at: string | null;
  created_at: string;
}

export function ImproveClient() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  // Form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<CommitmentCategory>("process");
  const [newTargetDate, setNewTargetDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter
  const [filterCategory, setFilterCategory] = useState<CommitmentCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<CommitmentStatus | "all">("open");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      await fetchCommitments(user.id);
      setLoading(false);
    }
    load();
  }, [supabase]);

  const fetchCommitments = async (userId: string) => {
    const { data } = await supabase
      .from("improvement_commitments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setCommitments(data as Commitment[]);
  };

  const addCommitment = async () => {
    if (!user || !newTitle.trim()) return;
    setSaving(true);

    const { data } = await supabase
      .from("improvement_commitments")
      .insert({
        user_id: user.id,
        title: newTitle.trim(),
        category: newCategory,
        status: "open",
        target_date: newTargetDate || null
      })
      .select()
      .single();

    if (data) {
      setCommitments(prev => [data as Commitment, ...prev]);
      setNewTitle("");
      setNewTargetDate("");
      setShowForm(false);
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: CommitmentStatus) => {
    const update: any = { status };
    if (status === "closed") update.closed_at = new Date().toISOString();

    await supabase
      .from("improvement_commitments")
      .update(update)
      .eq("id", id);

    setCommitments(prev =>
      prev.map(c => c.id === id ? { ...c, ...update } : c)
    );
  };

  const filtered = commitments.filter(c => {
    const catOk = filterCategory === "all" || c.category === filterCategory;
    const statOk = filterStatus === "all" || c.status === filterStatus;
    return catOk && statOk;
  });

  const openCount = commitments.filter(c => c.status === "open").length;
  const closedCount = commitments.filter(c => c.status === "closed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-text-tertiary font-mono">
        // LOADING COMMITMENTS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-background-elevated/40 border border-border-slate/50 rounded-xl text-center">
          <div className="text-2xl font-bold font-mono text-amber-400">{openCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary mt-1">Open</div>
        </div>
        <div className="p-4 bg-background-elevated/40 border border-border-slate/50 rounded-xl text-center">
          <div className="text-2xl font-bold font-mono text-emerald-400">{closedCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary mt-1">Closed</div>
        </div>
        <div className="p-4 bg-background-elevated/40 border border-border-slate/50 rounded-xl text-center">
          <div className="text-2xl font-bold font-mono text-text-primary">
            {commitments.length > 0 ? Math.round((closedCount / commitments.length) * 100) : 0}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-tertiary mt-1">Follow-Through</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory("all")}
            className={cn("text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-mono border transition-colors",
              filterCategory === "all" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-border-slate/30 text-text-tertiary"
            )}
          >All</button>
          {COMMITMENT_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilterCategory(cat.key)}
              className={cn("text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-mono border transition-colors",
                filterCategory === cat.key
                  ? CATEGORY_COLORS[cat.key]
                  : "border-border-slate/30 text-text-tertiary"
              )}
            >{cat.label}</button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 ml-auto">
          {(["open", "in_progress", "closed", "all"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn("text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-mono border transition-colors",
                filterStatus === s ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-border-slate/30 text-text-tertiary"
              )}
            >{s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-[10px] px-4 py-2 bg-emerald-500 text-background-primary font-bold uppercase rounded-lg transition-colors hover:bg-emerald-400"
        >
          <Plus className="w-3 h-3" /> Add Commitment
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="p-5 bg-background-elevated/40 border border-emerald-500/30 rounded-xl space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase text-emerald-400">New Improvement Commitment</h3>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="e.g. Never move SL against position after entry"
            className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
          />
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as CommitmentCategory)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
              >
                {COMMITMENT_CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-mono text-text-tertiary block">Target Date (optional)</label>
              <input
                type="date"
                value={newTargetDate}
                onChange={e => setNewTargetDate(e.target.value)}
                className="w-full bg-background-primary border border-border-slate/50 rounded-lg p-3 text-xs text-text-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="flex-1 border border-border-slate/50 text-text-secondary text-xs py-2 rounded-lg">Cancel</button>
            <button onClick={addCommitment} disabled={saving || !newTitle.trim()}
              className="flex-1 bg-emerald-500 text-background-primary font-bold text-xs py-2 rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      )}

      {/* Commitment list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-tertiary text-xs">
            {commitments.length === 0
              ? "No commitments yet. After each trade review, capture one improvement commitment."
              : "No commitments match the current filter."}
          </div>
        )}
        {filtered.map(c => (
          <div
            key={c.id}
            className={cn(
              "p-4 rounded-xl border flex items-start gap-4 transition-opacity",
              CATEGORY_COLORS[c.category],
              c.status === "closed" && "opacity-50"
            )}
          >
            <button
              onClick={() => updateStatus(c.id, c.status === "closed" ? "open" : "closed")}
              className="mt-0.5 shrink-0"
            >
              {c.status === "closed"
                ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                : <Circle className="w-5 h-5 text-text-tertiary" />
              }
            </button>

            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", c.status === "closed" ? "line-through text-text-tertiary" : "text-text-primary")}>
                {c.title}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className={cn("text-[10px] uppercase tracking-wider font-mono", CATEGORY_COLORS[c.category].split(" ").pop())}>
                  {c.category}
                </span>
                {c.target_date && (
                  <span className="text-[10px] text-text-tertiary">
                    Due {new Date(c.target_date).toLocaleDateString()}
                  </span>
                )}
                {c.closed_at && (
                  <span className="text-[10px] text-emerald-400">
                    Closed {new Date(c.closed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {c.status !== "closed" && (
              <button
                onClick={() => updateStatus(c.id, "in_progress")}
                className={cn(
                  "text-[10px] px-3 py-1 rounded-full border uppercase tracking-wider font-mono transition-colors",
                  c.status === "in_progress"
                    ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                    : "border-border-slate/30 text-text-tertiary hover:border-amber-500/30"
                )}
              >
                {c.status === "in_progress" ? "In Progress" : "Start"}
              </button>
            )}

            {/* Contextual lesson link — one per category, not a list */}
            {c.status !== "closed" && (
              <Link
                href={CATEGORY_LESSON_LINKS[c.category].href}
                className="shrink-0 text-[9px] font-mono text-text-tertiary hover:text-text-secondary underline underline-offset-2 transition-colors"
                title={`Relevant resource for ${c.category} improvement`}
              >
                {CATEGORY_LESSON_LINKS[c.category].label} →
              </Link>
            )}
          </div>
        ))}
      </div>

      {commitments.length > 0 && (
        <div className="pt-4 flex justify-end">
          <Link
            href="/dashboard/weekly-review"
            className="flex items-center gap-2 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-mono uppercase tracking-wide"
          >
            Proceed to Weekly Review <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
