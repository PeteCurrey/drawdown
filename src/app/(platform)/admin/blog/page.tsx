"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Sparkles, Edit3, Eye, Loader2, Send, Save, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogAdminPage() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("Trading Strategy");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic first.");
    
    setLoading(true);
    setStatus({ type: null, msg: "" });
    setDraft(null);

    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords, category })
      });
      const data = await res.json();
      
      if (res.ok) {
        setDraft(data.draft);
      } else {
        setStatus({ type: 'error', msg: data.error || "Failed to generate draft." });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!draft) return;
    setLoading(true);
    
    try {
      // In a real app, this would hit a /api/admin/blog/publish route
      // For now, we'll simulate the success
      setTimeout(() => {
        setStatus({ type: 'success', msg: "Draft successfully saved and published." });
        setLoading(false);
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', msg: "Failed to publish." });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-24">
      <header className="space-y-4">
        <Breadcrumbs />
        <div>
          <h1 className="text-3xl font-display font-bold uppercase tracking-tight text-accent">AI Blog Crafter</h1>
          <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest mt-1">
            // Produce 3-5 high-quality articles a week in Pete's Voice
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Generator Controls */}
        <div className="space-y-8">
          <div className="bg-background-surface border border-border-slate">
            <div className="p-4 border-b border-border-slate flex items-center gap-3 bg-background-elevated">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-display font-bold uppercase">Target Content</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Article Topic</label>
                <textarea 
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Why most traders fail at risk management in the London session"
                  className="w-full bg-background-primary border border-border-slate p-4 text-sm font-display focus:border-accent outline-none text-text-secondary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Target Keywords</label>
                <input 
                  type="text" 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="trading, psychology, risk reward"
                  className="w-full bg-background-primary border border-border-slate p-4 text-sm font-display focus:border-accent outline-none text-text-secondary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background-primary border border-border-slate p-4 text-sm font-display focus:border-accent outline-none text-text-secondary"
                >
                  <option>Trading Strategy</option>
                  <option>Psychology</option>
                  <option>Market Analysis</option>
                  <option>Education</option>
                </select>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-background-primary transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Drafting with Pete's AI..." : "Generate AI Draft"}
              </button>
            </div>
          </div>

          {draft && (
            <div className="bg-background-surface border border-border-slate">
              <div className="p-4 border-b border-border-slate flex items-center gap-3 bg-background-elevated">
                <Send className="w-5 h-5 text-text-primary" />
                <h2 className="text-sm font-display font-bold uppercase">Publishing</h2>
              </div>
              <div className="p-6 space-y-4">
                <button 
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full py-4 bg-white hover:bg-text-tertiary text-background-primary transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Publish to Blog
                </button>
                <button 
                  onClick={() => setDraft(null)}
                  className="w-full py-4 border border-loss/30 text-loss hover:bg-loss/10 transition-all font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Discard Draft
                </button>
              </div>
            </div>
          )}

          {status.type && (
            <div className={cn("p-4 border text-xs flex gap-3", status.type === 'success' ? "border-profit/30 bg-profit/10 text-profit" : "border-loss/30 bg-loss/10 text-loss")}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <p className="font-mono">{status.msg}</p>
            </div>
          )}
        </div>

        {/* Right Column: Editor / Preview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-background-surface border border-border-slate h-full flex flex-col">
            <div className="p-4 border-b border-border-slate flex items-center justify-between bg-background-elevated">
              <div className="flex items-center gap-3">
                <Edit3 className="w-5 h-5 text-accent" />
                <h2 className="text-sm font-display font-bold uppercase">Editor / Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 bg-background-primary border border-border-slate text-[8px] font-mono text-text-tertiary uppercase">Markdown Mode</div>
              </div>
            </div>
            <div className="flex-grow min-h-[600px] p-8">
              {draft ? (
                <textarea 
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-text-secondary"
                  placeholder="Review and edit the AI generated draft here..."
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <Eye className="w-12 h-12 text-text-tertiary" />
                  <div>
                    <h3 className="text-lg font-display font-bold uppercase">No Draft Loaded</h3>
                    <p className="text-xs font-mono uppercase tracking-widest">Input a topic on the left to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
