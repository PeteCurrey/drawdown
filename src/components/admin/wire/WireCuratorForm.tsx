"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, Send, Sparkles } from "lucide-react";
import type { LobbyArticle } from "@/types/lobby";
import type { WireEditionType, WireItemInput } from "@/types/wire";
import { generateWireDraftFromLobby, generateWireSlug } from "@/lib/wire";
import { DRAWDOWN_TOOLS } from "@/lib/lobby-constants";

interface WireCuratorFormProps {
  availableArticles: LobbyArticle[];
}

export function WireCuratorForm({ availableArticles }: WireCuratorFormProps) {
  const router = useRouter();

  const [editionType, setEditionType] = useState<WireEditionType>("MORNING");
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [title, setTitle] = useState(`The Morning Wire — ${new Date().toLocaleDateString('en-GB')}`);
  const [subjectLine, setSubjectLine] = useState(`Drawdown Morning Wire: Pre-market intelligence and key catalysts`);
  const [previewText, setPreviewText] = useState(`Top market moves, broker updates, and what's worth watching before the open.`);
  const [items, setItems] = useState<WireItemInput[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate items when selecting articles
  function handleToggleArticle(article: LobbyArticle) {
    const isSelected = selectedArticleIds.includes(article.id);
    let nextIds: string[];
    if (isSelected) {
      nextIds = selectedArticleIds.filter(id => id !== article.id);
    } else {
      nextIds = [...selectedArticleIds, article.id];
    }
    setSelectedArticleIds(nextIds);

    const chosenArticles = availableArticles.filter(a => nextIds.includes(a.id));
    const draft = generateWireDraftFromLobby(chosenArticles, editionType);
    setItems(draft.items);
  }

  function handleTypeChange(type: WireEditionType) {
    setEditionType(type);
    const chosenArticles = availableArticles.filter(a => selectedArticleIds.includes(a.id));
    const draft = generateWireDraftFromLobby(chosenArticles, type);
    setTitle(draft.edition.title);
    setSubjectLine(draft.edition.subject_line);
    setPreviewText(draft.edition.preview_text || "");
    setItems(draft.items);
  }

  function updateItem(index: number, field: keyof WireItemInput, val: any) {
    const next = [...items];
    next[index] = { ...next[index], [field]: val };
    setItems(next);
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const next = [...items];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    // Re-index display_order
    next.forEach((item, i) => item.display_order = i + 1);
    setItems(next);
  }

  function removeItem(index: number) {
    const item = items[index];
    if (item.article_id) {
      setSelectedArticleIds(selectedArticleIds.filter(id => id !== item.article_id));
    }
    const next = items.filter((_, i) => i !== index);
    next.forEach((it, i) => it.display_order = i + 1);
    setItems(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Please select at least 1 canonical Lobby article to curate this briefing.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/wire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edition: {
            edition_type: editionType,
            title,
            slug: generateWireSlug(editionType),
            subject_line: subjectLine,
            preview_text: previewText
          },
          items
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create Wire edition");
      }

      router.push("/admin/wire");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-950/60 border border-red-900 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* 1. Edition Configuration */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-zinc-800">
          1. Edition Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Edition Type
            </label>
            <div className="flex gap-2">
              {(["MORNING", "EVENING", "BREAKING"] as WireEditionType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`px-3 py-1.5 font-mono text-xs uppercase border transition-colors ${
                    editionType === t
                      ? "bg-blue-600 text-white border-blue-500 font-bold"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Edition Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              required
              className="w-full bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
              Preview Text (Preheader)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Canonical Story Selection */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
            2. Select Canonical Lobby Stories ({selectedArticleIds.length} chosen)
          </h3>
          <span className="font-mono text-[11px] text-zinc-500">
            Click to add/remove stories from The Lobby
          </span>
        </div>

        {availableArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {availableArticles.map((art) => {
              const active = selectedArticleIds.includes(art.id);
              return (
                <div
                  key={art.id}
                  onClick={() => handleToggleArticle(art)}
                  className={`p-3 border cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    active
                      ? "bg-blue-950/40 border-blue-600/80 text-white"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-zinc-800 text-zinc-300">
                      {art.category}
                    </span>
                    <h4 className="font-sans text-xs font-semibold text-zinc-200 line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                  <span className={`text-xs font-mono uppercase px-2 py-0.5 shrink-0 ${
                    active ? "text-blue-400 font-bold" : "text-zinc-600"
                  }`}>
                    {active ? "✓ ADDED" : "+ ADD"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-mono text-xs text-zinc-500">
            No published articles available in The Lobby. Publish articles first in /admin/lobby.
          </p>
        )}
      </div>

      {/* 3. Briefing Items Curation */}
      {items.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-zinc-800">
            3. Refine Briefing Items & Order
          </h3>

          <div className="space-y-6">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-blue-400 font-bold">
                    ITEM 0{idx + 1} // {item.market_category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1 text-red-400 hover:text-red-300 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Headline</label>
                  <input
                    type="text"
                    value={item.item_title}
                    onChange={(e) => updateItem(idx, 'item_title', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Briefing Blurb</label>
                  <textarea
                    rows={2}
                    value={item.wire_summary}
                    onChange={(e) => updateItem(idx, 'wire_summary', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Why It Matters</label>
                    <input
                      type="text"
                      value={item.why_it_matters}
                      onChange={(e) => updateItem(idx, 'why_it_matters', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Recommended Drawdown Tool</label>
                    <select
                      value={item.recommended_tool_slug || ""}
                      onChange={(e) => updateItem(idx, 'recommended_tool_slug', e.target.value || null)}
                      className="w-full bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300 font-mono"
                    >
                      <option value="">None</option>
                      {Object.values(DRAWDOWN_TOOLS).map(t => (
                        <option key={t.slug} value={t.slug}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Action Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-zinc-800 pt-5">
        <button
          type="button"
          onClick={() => router.push("/admin/wire")}
          className="px-4 py-2 font-mono text-xs uppercase text-zinc-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || items.length === 0}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {saving ? "Saving Edition..." : "Save Wire Edition Draft"}
        </button>
      </div>
    </form>
  );
}
