"use client";

import { useState } from "react";
import { X, BookmarkPlus, Loader2 } from "lucide-react";

interface SaveScreenModalProps {
  filterJson: Record<string, any>;
  onClose: () => void;
  onSaved: (screen: { id: string; name: string; filter_json: any }) => void;
}

export function SaveScreenModal({ filterJson, onClose, onSaved }: SaveScreenModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name for this screen preset.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/scanner/saved-screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          filter_json: filterJson,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save screen preset");
      }

      onSaved(data.screen);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save preset");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-background-surface border border-border-slate/70 p-6 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-slate/40 pb-4">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 text-accent" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-text-primary">
              Save Screen Preset
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">
              Preset Name
            </label>
            <input
              type="text"
              placeholder="e.g. Bullish High Volatility FX"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="w-full bg-background-elevated border border-border-slate/60 px-3 py-2 text-xs font-mono text-text-primary outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-[10px] font-mono text-red-400 bg-red-500/10 p-2 border border-red-500/20">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-text-tertiary hover:text-text-primary border border-border-slate/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-accent text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Preset"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
