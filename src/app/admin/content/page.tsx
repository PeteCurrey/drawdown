'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Globe, 
  Share2, 
  Mail, 
  Loader2, 
  ChevronRight, 
  Save, 
  Eye, 
  Edit3,
  Search,
  RefreshCcw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateBlogDraft, saveBlogDraft } from '@/app/actions/blog';

export default function ContentGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [category, setCategory] = useState('Analysis');
  const [wordCount, setWordCount] = useState(1200);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setDraft('');
    
    try {
      const res = await generateBlogDraft({
        topic,
        keywords,
        category,
        wordCount
      });
      
      if (res.success && res.draft) {
        setDraft(res.draft);
        // Auto-generate slug
        const autoSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setSlug(autoSlug);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!slug || !draft) return;
    setIsSaving(true);
    try {
      const res = await saveBlogDraft(slug, draft);
      if (res.success) {
        alert("Draft saved to src/content/blog/" + slug + ".mdx");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold uppercase mb-1">Content <span className="text-accent italic">Engine.</span></h1>
        <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest">// Claude-3.5-Sonnet powered blog & social generator</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Input Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <div className="p-8 bg-background-surface border border-border-slate space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Topic / Headline</label>
                 <input 
                   value={topic}
                   onChange={e => setTopic(e.target.value)}
                   placeholder="e.g. Why the Carry Trade is Dead"
                   className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Keywords (Comma Separated)</label>
                 <textarea 
                   value={keywords}
                   onChange={e => setKeywords(e.target.value)}
                   placeholder="leverage, liquidity risk, margin call"
                   rows={3}
                   className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm font-mono outline-none focus:border-accent resize-none"
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                    >
                       <option>Analysis</option>
                       <option>Psychology</option>
                       <option>Tools</option>
                       <option>Case Study</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Word Count</label>
                    <input 
                      type="number"
                      value={wordCount}
                      onChange={e => setWordCount(parseInt(e.target.value))}
                      className="w-full bg-background-primary border border-border-slate px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                    />
                 </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topic}
                className="w-full py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Draft
              </button>
           </div>

           <div className="p-8 bg-background-elevated border border-border-slate space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Social Multiplying</h4>
              <div className="flex gap-2">
                 <button className="flex-1 p-4 bg-background-surface border border-border-slate hover:border-accent transition-colors flex flex-col items-center gap-2 group">
                    <Globe className="w-4 h-4 text-text-tertiary group-hover:text-[#1DA1F2]" />
                    <span className="text-[8px] font-mono uppercase">Twitter Thread</span>
                 </button>
                 <button className="flex-1 p-4 bg-background-surface border border-border-slate hover:border-accent transition-colors flex flex-col items-center gap-2 group">
                    <Share2 className="w-4 h-4 text-text-tertiary group-hover:text-[#0A66C2]" />
                    <span className="text-[8px] font-mono uppercase">LinkedIn Post</span>
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Output Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className={cn("w-2 h-2 rounded-full", draft ? "bg-profit animate-pulse" : "bg-text-tertiary")} />
                 <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                    {isGenerating ? "Processing..." : draft ? "Draft Ready" : "Standby"}
                 </span>
              </div>
              {draft && (
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                      <label className="text-[10px] font-mono text-text-tertiary uppercase">Slug:</label>
                      <input 
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                        className="bg-background-elevated border border-border-slate px-3 py-1 text-[10px] font-mono outline-none focus:border-accent w-48"
                      />
                   </div>
                   <button 
                     onClick={handleSave}
                     disabled={isSaving || !slug}
                     className="flex items-center gap-2 px-6 py-2 bg-profit text-background-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-50"
                   >
                     {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                     Commit to Blog
                   </button>
                </div>
              )}
           </div>

           <div className="w-full min-h-[700px] bg-background-surface border border-border-slate relative group">
              {draft ? (
                <textarea 
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  className="w-full h-full min-h-[700px] p-12 bg-transparent text-text-secondary font-mono text-sm leading-relaxed outline-none resize-none prose prose-invert prose-sm"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-4">
                   <Zap className="w-12 h-12 text-border-slate" />
                   <p className="text-text-tertiary text-sm max-w-xs font-mono uppercase">
                     Enter a topic and keywords to generate an institutional-grade blog post in Pete's voice.
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
