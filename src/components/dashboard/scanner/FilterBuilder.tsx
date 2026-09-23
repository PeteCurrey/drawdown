"use client";

import { useState, useEffect } from "react";
import {
  SlidersHorizontal, Bookmark, Download, RotateCcw,
  ChevronDown, Trash2, Lock, Sparkles, Plus, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SaveScreenModal } from "./SaveScreenModal";

export interface FilterBuilderState {
  rsiMin: number;
  rsiMax: number;
  changeMin: number | null;
  changeMax: number | null;
  atrHighOnly: boolean;
  macdState: "all" | "bullish_cross" | "bearish_cross" | "neutral";
  category: string;
  consensus: string;
}

export const DEFAULT_FILTER_STATE: FilterBuilderState = {
  rsiMin: 0,
  rsiMax: 100,
  changeMin: null,
  changeMax: null,
  atrHighOnly: false,
  macdState: "all",
  category: "ALL",
  consensus: "ALL",
};

interface FilterBuilderProps {
  filters: FilterBuilderState;
  onChange: (next: FilterBuilderState) => void;
  onReset: () => void;
  canAccessSavedScreens: boolean;
  canAccessExport: boolean;
  onExportCSV: () => void;
  onLockedFeature: (featureName: string, requiredTier: "foundation" | "edge") => void;
  totalResults: number;
  totalAvailable: number;
}

export function FilterBuilder({
  filters,
  onChange,
  onReset,
  canAccessSavedScreens,
  canAccessExport,
  onExportCSV,
  onLockedFeature,
  totalResults,
  totalAvailable,
}: FilterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [savedScreens, setSavedScreens] = useState<any[]>([]);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [screenMenuOpen, setScreenMenuOpen] = useState(false);

  // Load saved screens if permitted
  useEffect(() => {
    if (!canAccessSavedScreens) return;
    async function loadScreens() {
      setLoadingScreens(true);
      try {
        const res = await fetch("/api/scanner/saved-screens");
        if (res.ok) {
          const json = await res.json();
          setSavedScreens(json.screens || []);
        }
      } catch (err) {
        console.error("Failed to load saved screens:", err);
      } finally {
        setLoadingScreens(false);
      }
    }
    loadScreens();
  }, [canAccessSavedScreens]);

  async function deleteScreen(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/scanner/saved-screens?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSavedScreens((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete screen:", err);
    }
  }

  const isCustomized =
    filters.rsiMin > 0 ||
    filters.rsiMax < 100 ||
    filters.changeMin !== null ||
    filters.changeMax !== null ||
    filters.atrHighOnly ||
    filters.macdState !== "all" ||
    filters.consensus !== "ALL";

  return (
    <div className="border border-border-slate/50 bg-background-surface/80 backdrop-blur-sm p-4 space-y-4">
      {/* ── Top Bar: Toggle, Results count, Saved screens, Export ────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider transition-all",
              isOpen || isCustomized
                ? "bg-accent/15 border-accent text-accent"
                : "border-border-slate/50 text-text-tertiary hover:border-accent hover:text-text-primary"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Builder</span>
            {isCustomized && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            )}
            <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
          </button>

          {isCustomized && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-text-tertiary hover:text-accent transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              Reset
            </button>
          )}

          <span className="text-[10px] font-mono text-text-tertiary">
            Showing <strong className="text-text-primary">{totalResults}</strong> of {totalAvailable} instruments
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Saved Screens Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (!canAccessSavedScreens) {
                  onLockedFeature("Saved Screens", "foundation");
                  return;
                }
                setScreenMenuOpen((prev) => !prev);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border-slate/50 text-[9px] font-mono uppercase tracking-wider text-text-tertiary hover:border-accent hover:text-text-primary transition-all bg-background-elevated/40"
            >
              <Bookmark className="w-3 h-3 text-accent" />
              <span>Saved Screens</span>
              {!canAccessSavedScreens && <Lock className="w-2.5 h-2.5 text-text-tertiary/70" />}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {screenMenuOpen && canAccessSavedScreens && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-background-elevated border border-border-slate/70 z-30 shadow-xl py-1 divide-y divide-border-slate/30">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setScreenMenuOpen(false);
                      setShowSaveModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-accent/15 border border-accent/30 text-accent text-[9px] font-mono uppercase tracking-wider hover:bg-accent/25 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Save Current Screen
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto p-1">
                  {loadingScreens ? (
                    <p className="text-[9px] font-mono text-text-tertiary p-2 text-center">
                      Loading presets…
                    </p>
                  ) : savedScreens.length === 0 ? (
                    <p className="text-[9px] font-mono text-text-tertiary p-2 text-center">
                      No saved screens yet
                    </p>
                  ) : (
                    savedScreens.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          onChange({ ...DEFAULT_FILTER_STATE, ...s.filter_json });
                          setScreenMenuOpen(false);
                        }}
                        className="flex items-center justify-between p-2 hover:bg-white/5 cursor-pointer group text-[10px] font-mono"
                      >
                        <span className="text-text-primary truncate">{s.name}</span>
                        <button
                          onClick={(e) => deleteScreen(s.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-red-400 p-1 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export CSV button (Edge+) */}
          <button
            onClick={() => {
              if (!canAccessExport) {
                onLockedFeature("CSV Data Export", "edge");
                return;
              }
              onExportCSV();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border-slate/50 text-[9px] font-mono uppercase tracking-wider text-text-tertiary hover:border-accent hover:text-text-primary transition-all bg-background-elevated/40"
          >
            <Download className="w-3 h-3 text-profit" />
            <span>Export CSV</span>
            {!canAccessExport && <Lock className="w-2.5 h-2.5 text-text-tertiary/70" />}
          </button>
        </div>
      </div>

      {/* ── Expandable Filter Controls ───────────────────────────────────── */}
      {isOpen && (
        <div className="pt-4 border-t border-border-slate/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
          {/* RSI Range */}
          <div className="space-y-2 p-3 border border-border-slate/30 bg-background-elevated/20">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-bold">
                RSI (14) Range
              </label>
              <span className="text-[9px] font-mono text-accent">
                {filters.rsiMin} – {filters.rsiMax}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[8px] font-mono text-text-tertiary block">Min</span>
                <input
                  type="number"
                  min={0}
                  max={filters.rsiMax}
                  value={filters.rsiMin}
                  onChange={(e) =>
                    onChange({ ...filters, rsiMin: Math.max(0, Math.min(100, Number(e.target.value))) })
                  }
                  className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1 text-xs font-mono text-text-primary"
                />
              </div>
              <div>
                <span className="text-[8px] font-mono text-text-tertiary block">Max</span>
                <input
                  type="number"
                  min={filters.rsiMin}
                  max={100}
                  value={filters.rsiMax}
                  onChange={(e) =>
                    onChange({ ...filters, rsiMax: Math.max(0, Math.min(100, Number(e.target.value))) })
                  }
                  className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1 text-xs font-mono text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* 24h % Change Threshold */}
          <div className="space-y-2 p-3 border border-border-slate/30 bg-background-elevated/20">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-bold block">
              24h % Change Threshold
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[8px] font-mono text-text-tertiary block">Min %</span>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. -2.5"
                  value={filters.changeMin ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      changeMin: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1 text-xs font-mono text-text-primary"
                />
              </div>
              <div>
                <span className="text-[8px] font-mono text-text-tertiary block">Max %</span>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. +3.0"
                  value={filters.changeMax ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      changeMax: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1 text-xs font-mono text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* MACD State */}
          <div className="space-y-2 p-3 border border-border-slate/30 bg-background-elevated/20">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-bold block">
              MACD State
            </label>
            <select
              value={filters.macdState}
              onChange={(e) =>
                onChange({ ...filters, macdState: e.target.value as any })
              }
              className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1.5 text-xs font-mono text-text-primary outline-none focus:border-accent"
            >
              <option value="all">Any MACD State</option>
              <option value="bullish_cross">Bullish Momentum (Hist &gt; 0)</option>
              <option value="bearish_cross">Bearish Momentum (Hist &lt; 0)</option>
              <option value="neutral">Neutral Consolidation</option>
            </select>
          </div>

          {/* Consensus Bias & ATR Volatility Band */}
          <div className="space-y-2 p-3 border border-border-slate/30 bg-background-elevated/20">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-secondary font-bold block">
              Consensus & Volatility
            </label>
            <select
              value={filters.consensus}
              onChange={(e) => onChange({ ...filters, consensus: e.target.value })}
              className="w-full bg-background-elevated border border-border-slate/50 px-2 py-1 text-xs font-mono text-text-primary outline-none focus:border-accent mb-2"
            >
              <option value="ALL">Any Consensus</option>
              <option value="STRONG BUY">Strong Buy</option>
              <option value="BUY">Buy</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="SELL">Sell</option>
              <option value="STRONG SELL">Strong Sell</option>
            </select>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={filters.atrHighOnly}
                onChange={(e) => onChange({ ...filters, atrHighOnly: e.target.checked })}
                className="accent-accent"
              />
              <span className="text-[9px] font-mono uppercase text-text-tertiary">
                High Volatility (ATR &gt; Avg)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Save Screen Modal */}
      {showSaveModal && (
        <SaveScreenModal
          filterJson={filters}
          onClose={() => setShowSaveModal(false)}
          onSaved={(newScreen) => {
            setSavedScreens((prev) => [newScreen, ...prev]);
          }}
        />
      )}
    </div>
  );
}
