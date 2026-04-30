"use client";

import { useState } from "react";
import { Sparkles, Save, Send, Loader2, ChevronLeft, Type, Hash, Layers, FileText } from "lucide-react";
import Link from "next/link";
import { generateBlogDraft, saveBlogDraft } from "@/app/actions/blog";
import { cn } from "@/lib/utils";

export default function BlogGeneratePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    keywords: "",
    category: "Education",
    wordCount: 1000,
  });
  const [draft, setDraft] = useState("");
  const [slug, setSlug] = useState("");

  const handleGenerate = async () => {
    if (!formData.topic) return;
    setLoading(true);
    const result = await generateBlogDraft(formData);
    if (result.success && result.draft) {
      setDraft(result.draft);
      // Try to extract slug from topic
      setSlug(formData.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    } else {
      alert("Failed to generate: " + result.error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!draft || !slug) return;
    setSaving(true);
    const result = await saveBlogDraft(slug, draft);
    if (result.success) {
      alert("Draft saved successfully!");
    } else {
      alert("Failed to save: " + result.error);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-4 group">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
            </Link>
            <h1 className="text-4xl font-display font-black uppercase tracking-tight flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-accent" />
              Content Engine <span className="text-accent/20">/</span> Draft Gen
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-background-surface border border-border-slate space-y-6">
              <div className="space-y-4">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Topic / Headline</label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    placeholder="e.g. Why Leverage is a Trap"
                    className="w-full bg-background-primary border border-border-slate p-4 pl-12 text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Target Keywords</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input 
                    type="text" 
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="risk, margin call, leverage..."
                    className="w-full bg-background-primary border border-border-slate p-4 pl-12 text-sm focus:border-accent outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Category</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-background-primary border border-border-slate p-4 pl-12 text-sm focus:border-accent outline-none transition-colors appearance-none"
                    >
                      <option>Education</option>
                      <option>Market Analysis</option>
                      <option>Psychology</option>
                      <option>Risk Management</option>
                      <option>UK Trading</option>
                      <option>Tools</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Word Count</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input 
                      type="number" 
                      value={formData.wordCount}
                      onChange={(e) => setFormData({...formData, wordCount: parseInt(e.target.value)})}
                      className="w-full bg-background-primary border border-border-slate p-4 pl-12 text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !formData.topic}
                className={cn(
                  "w-full py-6 font-display font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all",
                  loading ? "bg-accent/50 cursor-not-allowed" : "bg-accent text-[#08090D] hover:bg-accent-hover shadow-xl shadow-accent/20"
                )}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Generate Draft
              </button>
            </div>

            {draft && (
              <div className="p-8 bg-background-surface border border-border-slate space-y-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Slug</label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-background-primary border border-border-slate p-4 text-sm focus:border-accent outline-none transition-colors font-mono"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-4 border border-border-slate hover:border-accent font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Draft
                  </button>
                  <button className="flex-1 py-4 bg-white text-[#08090D] font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors">
                    <Send className="w-3 h-3" />
                    Publish Live
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="lg:col-span-8">
            <div className="h-full min-h-[600px] bg-background-surface border border-border-slate p-8">
              <textarea 
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Draft will appear here..."
                className="w-full h-full min-h-[550px] bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-text-secondary custom-scrollbar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
