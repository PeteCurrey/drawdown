"use client";

import { 
  Brain, 
  Target, 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Plus, 
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { generateMarketingContent } from "@/lib/ai/claude";

interface IntelligenceProps {
  stats: {
    competitors: any[];
    intelligence: any[];
  };
}

export function AdminIntelligenceClient({ stats }: IntelligenceProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'content' | 'trends'>('matrix');
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [generatedDraft, setGeneratedDraft] = useState("");

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/intelligence/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: contentType.toLowerCase() })
      });
      const data = await response.json();
      setGeneratedDraft(data.content);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    if (!generatedDraft) return;
    setIsDeploying(true);
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: generatedDraft, 
          platform: contentType.toLowerCase(),
          title: topic 
        })
      });
      if (response.ok) {
        alert(`Successfully deployed to ${contentType}`);
        setGeneratedDraft("");
        setTopic("");
      }
    } catch (err) {
      console.error("Deployment failed:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border-slate pb-6">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-2">Intelligence Suite</h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest flex items-center gap-2">
             <Brain className="w-3 h-3 text-accent" /> Autonomous Content & Competitor Monitoring
          </p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-background-elevated border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center gap-2">
              <Plus className="w-3 h-3" /> Add Competitor
           </button>
           <button 
             onClick={() => setActiveTab('content')}
             className="px-4 py-2 bg-accent text-background-primary text-[9px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center gap-2"
           >
              <Sparkles className="w-3 h-3" /> AI Content Studio
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-border-slate/30">
        {[
          { id: 'matrix', label: 'Competitor Matrix', icon: Target },
          { id: 'trends', label: 'Trend Spotting', icon: Zap },
          { id: 'content', label: 'AI Content Studio', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "pb-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2",
              activeTab === tab.id ? "text-accent" : "text-text-tertiary hover:text-text-primary"
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-background-surface border border-border-slate overflow-hidden">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-background-elevated/50 border-b border-border-slate">
                          <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Competitor</th>
                          <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Category</th>
                          <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">Target Keywords</th>
                          <th className="px-6 py-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-slate/30">
                       {stats.competitors.map((comp) => (
                         <tr key={comp.id} className="hover:bg-accent/5 transition-colors">
                            <td className="px-6 py-5">
                               <div className="flex flex-col">
                                  <span className="text-sm font-bold uppercase">{comp.name}</span>
                                  <span className="text-[10px] text-text-tertiary font-mono">{comp.url}</span>
                               </div>
                            </td>
                            <td className="px-6 py-5">
                               <span className="text-[9px] font-mono uppercase bg-background-elevated px-2 py-1 border border-border-slate">
                                  {comp.category}
                               </span>
                            </td>
                            <td className="px-6 py-5">
                               <div className="flex flex-wrap gap-1">
                                  {comp.monitored_keywords?.slice(0, 2).map((k: string) => (
                                    <span key={k} className="text-[8px] font-mono text-text-tertiary uppercase">#{k}</span>
                                  ))}
                               </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-profit" />
                                  <span className="text-[9px] font-mono uppercase text-profit">Monitoring</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <div className="p-8 bg-background-surface border border-border-slate">
                 <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Live Intelligence Feed
                 </h3>
                 <div className="space-y-6">
                    {stats.intelligence.slice(0, 5).map((log) => (
                      <div key={log.id} className="border-l-2 border-border-slate pl-4 space-y-2 group hover:border-accent transition-colors">
                         <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold uppercase text-text-primary">{log.competitors?.name}</span>
                            <span className="text-[8px] font-mono text-text-tertiary">{new Date(log.created_at).toLocaleDateString()}</span>
                         </div>
                         <p className="text-xs text-text-secondary leading-relaxed">{log.observation}</p>
                         <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[8px] font-mono uppercase px-1",
                              log.impact_score > 7 ? "text-loss bg-loss/10" : "text-profit bg-profit/10"
                            )}>
                               Impact: {log.impact_score}/10
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'content' && (
         <div className="max-w-4xl mx-auto space-y-8">
            <div className="p-12 bg-background-surface border border-border-slate space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="w-24 h-24 text-accent" />
               </div>
               
               <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-display font-bold uppercase">Generate Autonomous Content</h3>
                  <p className="text-sm text-text-tertiary">Leverage the Claude 3.5 engine to create professional-grade content based on real competitor data.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-2">
                     <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Topic / Keyword</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Risk Management in Prop Firms"
                       className="w-full bg-background-elevated border border-border-slate p-4 text-sm font-sans focus:outline-none focus:border-accent"
                       value={topic}
                       onChange={(e) => setTopic(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Content Type</label>
                     <select 
                       className="w-full bg-background-elevated border border-border-slate p-4 text-sm font-sans focus:outline-none focus:border-accent"
                       value={contentType}
                       onChange={(e) => setContentType(e.target.value)}
                     >
                        <option value="blog">Long-form Blog Post</option>
                        <option value="twitter">Twitter/X Thread</option>
                        <option value="linkedin">LinkedIn Insight</option>
                        <option value="newsletter">Investor Newsletter</option>
                     </select>
                  </div>
               </div>

               <button 
                 className="w-full py-6 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-premium flex items-center justify-center gap-3 disabled:opacity-50"
                 onClick={handleGenerate}
                 disabled={isGenerating || !topic}
               >
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  {isGenerating ? "Consulting Pete & Claude..." : "Generate Professional Draft"}
               </button>

               {generatedDraft && (
                  <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative z-10">
                     <div className="flex justify-between items-center border-b border-border-slate pb-4">
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                           <Sparkles className="w-3 h-3" /> Pete's Professional Draft
                        </h4>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => setGeneratedDraft("")}
                             className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary hover:text-loss transition-colors"
                           >
                              Discard
                           </button>
                        </div>
                     </div>
                     <div className="bg-background-elevated p-8 border border-border-slate font-sans text-sm text-text-secondary leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {generatedDraft}
                     </div>
                     <button 
                       onClick={handleDeploy}
                       disabled={isDeploying}
                       className="w-full py-4 bg-profit text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-profit/90 transition-premium flex items-center justify-center gap-3"
                     >
                        {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                        {isDeploying ? "Deploying Assets..." : `Deploy to ${contentType.toUpperCase()}`}
                     </button>
                  </div>
               )}
            </div>
         </div>
      )}

      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Competitor Trend: Aggressive Bonus Scaling", status: "Critical", trend: "Prop firms are shifting away from high leverage to high retention bonuses.", action: "Counter with 'The Transparency Dividend' blog post." },
             { title: "SEO Gap: Professional Latency Data", status: "High Priority", trend: "No major review site is publishing actual LD5 latency logs.", action: "Publish our LD5 connectivity metrics." },
             { title: "Social Signal: Anti-Hype Sentiment", status: "Opportunity", trend: "Traders on Reddit are revolting against 'lifestyle' trading influencers.", action: "Deploy 'Truth over Lifestyle' campaign." },
           ].map((item, i) => (
             <div key={i} className="p-8 bg-background-elevated border border-border-slate hover:border-accent transition-colors space-y-6">
                <div className="flex justify-between items-start">
                   <span className="text-[8px] font-mono uppercase text-accent font-bold px-2 py-1 bg-accent/10">Trend Identified</span>
                   <span className="text-[10px] font-mono text-text-tertiary">2h ago</span>
                </div>
                <h4 className="text-lg font-display font-bold uppercase leading-tight">{item.title}</h4>
                <div className="space-y-4">
                   <p className="text-xs text-text-secondary leading-relaxed">{item.trend}</p>
                   <div className="pt-4 border-t border-border-slate">
                      <p className="text-[9px] font-mono text-text-tertiary uppercase mb-2">Recommended Action:</p>
                      <p className="text-xs font-bold text-accent italic">"{item.action}"</p>
                   </div>
                </div>
                <button className="w-full py-3 bg-background-surface border border-border-slate text-[9px] font-bold uppercase tracking-widest hover:border-accent transition-colors flex items-center justify-center gap-2">
                   Deploy Strategy <ArrowUpRight className="w-3 h-3" />
                </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
