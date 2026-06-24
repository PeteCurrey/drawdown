"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Star, Trash2, Copy, Edit2, Check, X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SavedStrategy, OutputLanguage } from "@/types/algo-builder";

const C = "#00e5cc";   // Journal cyan accent

interface StrategyLibraryProps {
  currentCode:        string;
  currentLanguage:    OutputLanguage;
  currentInstrument:  string;
  currentTimeframe:   string;
  currentDescription: string;
}

export function StrategyLibrary({
  currentCode, currentLanguage, currentInstrument,
  currentTimeframe, currentDescription,
}: StrategyLibraryProps) {
  const [strategies, setStrategies]   = useState<SavedStrategy[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName]       = useState("");
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState<string | null>(null);
  const [renamingId, setRenamingId]   = useState<string | null>(null);
  const [renameText, setRenameText]   = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLang, setFilterLang]   = useState<"all"|"pine_script"|"python">("all");
  const [loadedCode, setLoadedCode]   = useState<string | null>(null);

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/algo-builder/strategies");
      if (!res.ok) throw new Error("Failed to load strategies");
      const data = await res.json();
      setStrategies(data.strategies ?? []);
    } catch {
      setError("Could not load strategies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStrategies(); }, [fetchStrategies]);

  // Dispatch custom event when a strategy is loaded
  useEffect(() => {
    if (loadedCode) {
      window.dispatchEvent(new CustomEvent("algo-strategy-loaded", { detail: loadedCode }));
      setLoadedCode(null);
    }
  }, [loadedCode]);

  const filtered = useMemo(() => {
    return strategies.filter(s => {
      const matchLang = filterLang === "all" || s.language === filterLang;
      const matchSearch = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.instrument ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchLang && matchSearch;
    });
  }, [strategies, filterLang, searchQuery]);

  async function saveStrategy() {
    if (saveName.trim().length < 3) { setSaveError("Name must be at least 3 characters."); return; }
    if (saveName.trim().length > 60) { setSaveError("Name must be under 60 characters."); return; }
    if (!currentCode) { setSaveError("No code to save — generate a strategy first."); return; }
    if (strategies.length >= 20) { setSaveError("Library full (20/20). Delete a strategy to save more."); return; }

    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/algo-builder/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        saveName.trim(),
          description: currentDescription.slice(0, 200),
          language:    currentLanguage,
          code:        currentCode,
          instrument:  currentInstrument,
          timeframe:   currentTimeframe,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Save failed."); return; }
      setStrategies(prev => [data.strategy, ...prev]);
      setSaveName("");
      setShowSaveModal(false);
    } catch {
      setSaveError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleFavourite(id: string, current: boolean) {
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, is_favourite: !current } : s));
    await fetch(`/api/algo-builder/strategies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favourite: !current }),
    }).catch(() => {
      setStrategies(prev => prev.map(s => s.id === id ? { ...s, is_favourite: current } : s));
    });
  }

  async function deleteStrategy(id: string) {
    if (!confirm("Delete this strategy? This cannot be undone.")) return;
    setStrategies(prev => prev.filter(s => s.id !== id));
    await fetch(`/api/algo-builder/strategies/${id}`, { method: "DELETE" }).catch(() => {
      fetchStrategies();
    });
  }

  async function renameStrategy(id: string) {
    if (renameText.trim().length < 3) return;
    setStrategies(prev => prev.map(s => s.id === id ? { ...s, name: renameText.trim() } : s));
    setRenamingId(null);
    await fetch(`/api/algo-builder/strategies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameText.trim() }),
    }).catch(() => fetchStrategies());
  }

  async function duplicateStrategy(s: SavedStrategy) {
    if (strategies.length >= 20) return;
    const res = await fetch("/api/algo-builder/strategies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:        `${s.name} (copy)`,
        description: s.description,
        language:    s.language,
        code:        s.code,
        instrument:  s.instrument,
        timeframe:   s.timeframe,
      }),
    });
    const data = await res.json();
    if (data.strategy) setStrategies(prev => [data.strategy, ...prev]);
  }

  const langLabel = (l: OutputLanguage) => l === "pine_script" ? "Pine v6" : "Python";
  const langColor = (l: OutputLanguage) => l === "pine_script" ? "#22C55E" : "#60A5FA";

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: 400 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb" }}>
        <div>
          <span className="text-[11px] font-mono text-gray-900 font-bold">
            My Strategies
          </span>
          <span className="text-[9px] font-mono text-gray-400 ml-2">
            {strategies.length}/20
          </span>
        </div>
        {currentCode && (
          <button
            onClick={() => { setShowSaveModal(true); setSaveError(null); }}
            disabled={strategies.length >= 20}
            className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-black disabled:opacity-40"
            style={{ backgroundColor: C }}
          >
            Save Current
          </button>
        )}
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div className="px-4 py-4 border-b space-y-3" style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
            Save strategy
          </p>
          <input
            autoFocus
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") saveStrategy(); if (e.key === "Escape") setShowSaveModal(false); }}
            placeholder="Strategy name (3–60 characters)"
            maxLength={60}
            className="w-full px-3 py-2.5 text-sm font-mono text-gray-900 outline-none"
            style={{ backgroundColor: `${C}15`, border: `1px solid ${C}` }}
          />
          {saveError && <p className="text-[10px] font-mono text-red-400">{saveError}</p>}
          <div className="flex gap-2">
            <button
              onClick={saveStrategy}
              disabled={saving}
              className="flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-black"
              style={{ backgroundColor: C, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => { setShowSaveModal(false); setSaveError(null); }}
              className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-gray-400 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex gap-2 px-4 py-3 border-b" style={{ borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
        <div className="flex items-center gap-2 flex-1" style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
          <Search className="w-3.5 h-3.5 ml-2.5 text-gray-400 shrink-0" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search strategies…"
            className="flex-1 py-2 text-xs font-mono bg-transparent text-gray-900 outline-none"
          />
        </div>
        <div className="flex border" style={{ borderColor: "#e5e7eb" }}>
          {(["all", "pine_script", "python"] as const).map(l => (
            <button
              key={l}
              onClick={() => setFilterLang(l)}
              className="px-3 py-2 text-[9px] font-mono uppercase tracking-wider transition-all"
              style={filterLang === l
                ? { backgroundColor: C, color: "#000", fontWeight: 700 }
                : { backgroundColor: "#f9fafb", color: "#6b7280" }}
            >
              {l === "all" ? "All" : l === "pine_script" ? "Pine" : "Py"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#ffffff" }}>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-[10px] font-mono text-gray-400 animate-pulse">Loading strategies…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-12">
            <p className="text-[10px] font-mono text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-[10px] font-mono text-gray-400">
              {strategies.length === 0 ? "No saved strategies yet." : "No strategies match your search."}
            </p>
            {strategies.length === 0 && (
              <p className="text-[9px] font-mono text-gray-400/50">Generate code and click Save to add your first strategy.</p>
            )}
          </div>
        )}

        {!loading && filtered.map(s => (
          <div
            key={s.id}
            className="flex items-start gap-3 px-4 py-3.5 border-b transition-colors hover:bg-white/[0.02]"
            style={{ borderColor: "#e5e7eb" }}
          >
            {/* Favourite star */}
            <button
              onClick={() => toggleFavourite(s.id, s.is_favourite)}
              className="mt-0.5 shrink-0 transition-colors"
              style={{ color: s.is_favourite ? C : "#444" }}
            >
              <Star className="w-3.5 h-3.5" fill={s.is_favourite ? C : "none"} />
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {renamingId === s.id ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={renameText}
                    onChange={e => setRenameText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") renameStrategy(s.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="flex-1 px-2 py-1 text-xs font-mono bg-white text-gray-900 outline-none"
                    style={{ border: `1px solid ${C}` }}
                  />
                  <button onClick={() => renameStrategy(s.id)} className="text-gray-400 hover:text-gray-900">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setRenamingId(null)} className="text-gray-400 hover:text-red-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-[12px] font-mono font-bold text-gray-900 truncate">{s.name}</p>
              )}

              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[9px] font-mono px-1.5 py-0.5" style={{ backgroundColor: `${langColor(s.language)}20`, color: langColor(s.language) }}>
                  {langLabel(s.language)}
                </span>
                {s.instrument && (
                  <span className="text-[9px] font-mono text-gray-400">{s.instrument}</span>
                )}
                {s.timeframe && (
                  <span className="text-[9px] font-mono text-gray-400">{s.timeframe}</span>
                )}
                <span className="text-[9px] font-mono text-gray-400/50">
                  v{s.version} · {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setLoadedCode(s.code)}
                className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all"
                style={{ backgroundColor: `${C}20`, color: C, border: `1px solid ${C}40` }}
                title="Load into code panel"
              >
                Load
              </button>
              <button
                onClick={() => { setRenamingId(s.id); setRenameText(s.name); }}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                title="Rename"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => duplicateStrategy(s)}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
                title="Duplicate"
                disabled={strategies.length >= 20}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteStrategy(s.id)}
                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {strategies.length >= 20 && (
        <div className="px-4 py-2.5 text-center border-t text-[9px] font-mono text-gray-400" style={{ borderColor: "#e5e7eb" }}>
          Library full (20/20) — delete a strategy to save more.
        </div>
      )}
    </div>
  );
}
