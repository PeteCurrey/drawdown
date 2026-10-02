"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  Save, 
  Wand2, 
  LayoutTemplate,
  Globe,
  Type,
  Image as ImageIcon,
  CheckCircle2,
  Search
} from "lucide-react";

export default function LandingPageBuilder() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    heroHeading: "",
    heroSubheading: "",
    ctaText: "Get Started",
    seoTitle: "",
    seoDescription: ""
  });

  const handleGenerateCopy = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        heroHeading: "Master the Markets with Institutional Precision",
        heroSubheading: "Stop trading on emotion. Equip yourself with the Drawdown terminal, featuring real-time footprint analysis and institutional order flow mapping designed for serious retail traders.",
        seoTitle: "Institutional Trading Tools",
        seoDescription: "Upgrade your edge with Drawdown's professional-grade trading terminal. Get access to real-time order flow and footprint charts."
      }));
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-slate pb-6">
        <div>
          <Link href="/admin/landing-pages" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-4 group">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Pages
          </Link>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Page Builder</h1>
          <p className="text-xs text-text-tertiary">Design and generate marketing pages using the Drawdown aesthetic.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 border border-border-slate hover:border-text-primary transition-colors text-[10px] font-bold uppercase tracking-widest">
            Preview
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">
            <Save className="w-4 h-4" /> Save & Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Form Builder */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Core Settings */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border-slate/50">
              <Globe className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-bold uppercase">Core Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Internal Name</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Prop Firm Promo Q3"
                  className="w-full bg-background-surface border border-border-slate p-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="/promo/prop-firm-q3"
                  className="w-full bg-background-surface border border-border-slate p-3 text-sm font-mono outline-none focus:border-accent"
                />
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-border-slate/50">
              <div className="flex items-center gap-3">
                <LayoutTemplate className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-display font-bold uppercase">Hero Section</h2>
              </div>
              <button 
                onClick={handleGenerateCopy}
                disabled={isGenerating}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent hover:text-accent-hover transition-colors"
              >
                <Wand2 className={cn("w-4 h-4", isGenerating && "animate-spin")} /> 
                {isGenerating ? "Generating..." : "AI Assist"}
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">H1 Heading</label>
                <input 
                  type="text" 
                  value={formData.heroHeading}
                  onChange={(e) => setFormData({...formData, heroHeading: e.target.value})}
                  placeholder="The Ultimate Trading Edge."
                  className="w-full bg-background-surface border border-border-slate p-4 text-lg font-display font-bold outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Subheading (Paragraph)</label>
                <textarea 
                  value={formData.heroSubheading}
                  onChange={(e) => setFormData({...formData, heroSubheading: e.target.value})}
                  rows={4}
                  placeholder="Explain the value proposition clearly here..."
                  className="w-full bg-background-surface border border-border-slate p-4 text-sm leading-relaxed outline-none focus:border-accent resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Primary CTA Text</label>
                  <input 
                    type="text" 
                    value={formData.ctaText}
                    onChange={(e) => setFormData({...formData, ctaText: e.target.value})}
                    className="w-full bg-background-surface border border-border-slate p-3 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Hero Image (Optional)</label>
                  <button className="w-full h-[46px] bg-background-elevated border border-border-slate border-dashed flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-text-primary hover:border-accent transition-colors">
                    <ImageIcon className="w-4 h-4" /> Upload Asset
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SEO Metadata */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border-slate/50">
              <Search className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-display font-bold uppercase">SEO Metadata</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary flex justify-between">
                  Meta Title <span className={cn("text-xs", formData.seoTitle.length > 60 ? "text-loss" : "text-profit")}>{formData.seoTitle.length}/60</span>
                </label>
                <input 
                  type="text" 
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                  className="w-full bg-background-surface border border-border-slate p-3 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary flex justify-between">
                  Meta Description <span className={cn("text-xs", formData.seoDescription.length > 160 ? "text-loss" : "text-profit")}>{formData.seoDescription.length}/160</span>
                </label>
                <textarea 
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                  rows={3}
                  className="w-full bg-background-surface border border-border-slate p-3 text-sm outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: AI Assistant Panel */}
        <div className="space-y-6">
          <div className="p-6 bg-background-surface border border-border-slate sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10">
                <Wand2 className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-display font-bold uppercase">AI Co-Pilot</h3>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Describe the goal of this landing page, your target audience, and any key features. The AI will generate high-converting copy matching the Drawdown brand tone.
            </p>

            <div className="space-y-4 mb-6">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Prompt Context</label>
              <textarea 
                rows={5}
                placeholder="e.g. I need a landing page targeting intermediate forex traders looking for a funding challenge. Focus on tight spreads and 90% profit splits."
                className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent resize-none"
              />
              <button 
                onClick={handleGenerateCopy}
                disabled={isGenerating}
                className="w-full py-3 bg-background-elevated border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-colors"
              >
                Generate Entire Page
              </button>
            </div>

            <div className="pt-6 border-t border-border-slate/50">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-4">Brand Guidelines Active</h4>
              <ul className="space-y-3 text-xs text-text-secondary">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-profit" /> Institutional Tone</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-profit" /> Direct & Authoritative</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-profit" /> No Fluff or Hype</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
