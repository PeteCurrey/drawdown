'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Brain, 
  Zap, 
  Plus, 
  ExternalLink, 
  Loader2,
  RefreshCw,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function CompetitorTrackerPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchCompetitors = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('competitor_tracking').select('*').order('seo_visibility_score', { ascending: false });
      if (data) setCompetitors(data);
      setLoading(false);
    };
    fetchCompetitors();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-1">Market <span className="text-accent italic">Dominance.</span></h1>
          <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest">// Competitor Intelligence & SEO Gaps</p>
        </div>
        <button className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all flex items-center gap-2">
           <Plus className="w-4 h-4" />
           Add Target
        </button>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Our Visibility", value: "42/100", trend: "+5%", color: "text-profit" },
          { label: "Top Competitor", value: "Investopedia", trend: "Steady", color: "text-text-primary" },
          { label: "Market Gaps", value: "14", trend: "High Priority", color: "text-warning" },
          { label: "Keywords Owned", value: "842", trend: "+120", color: "text-profit" },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-background-surface border border-border-slate space-y-2">
             <p className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">{stat.label}</p>
             <div className="flex items-end justify-between">
                <p className="text-xl font-display font-bold uppercase">{stat.value}</p>
                <span className={cn("text-[10px] font-mono", stat.color)}>{stat.trend}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Main Table */}
         <div className="lg:col-span-2 bg-background-surface border border-border-slate overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-border-slate bg-background-elevated/50">
                     <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Competitor</th>
                     <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">SEO Score</th>
                     <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Top Keywords</th>
                     <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-slate/50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                         <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto mb-2" />
                         <span className="text-[10px] font-mono uppercase text-text-tertiary">Loading intelligence...</span>
                      </td>
                    </tr>
                  ) : competitors.map((comp) => (
                    <tr key={comp.id} className="hover:bg-background-elevated/30 transition-colors group">
                       <td className="p-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-background-elevated border border-border-slate flex items-center justify-center">
                                <Globe className="w-4 h-4 text-text-tertiary" />
                             </div>
                             <div>
                                <h4 className="text-sm font-display font-bold uppercase">{comp.name}</h4>
                                <a href={comp.url} target="_blank" className="text-[9px] font-mono text-text-tertiary hover:text-accent flex items-center gap-1">
                                   {new URL(comp.url).hostname} <ExternalLink className="w-2 h-2" />
                                </a>
                             </div>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-background-elevated overflow-hidden rounded-full">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-1000",
                                    comp.seo_visibility_score > 90 ? "bg-profit" : comp.seo_visibility_score > 70 ? "bg-warning" : "bg-accent"
                                  )}
                                  style={{ width: `${comp.seo_visibility_score}%` }}
                                />
                             </div>
                             <span className="text-xs font-mono font-bold">{comp.seo_visibility_score}</span>
                          </div>
                       </td>
                       <td className="p-6">
                          <div className="flex flex-wrap gap-1">
                             {comp.top_keywords?.slice(0, 2).map((kw: string) => (
                               <span key={kw} className="px-2 py-0.5 bg-background-elevated border border-border-slate text-[9px] font-mono text-text-secondary uppercase">
                                  {kw}
                               </span>
                             ))}
                             {comp.top_keywords?.length > 2 && <span className="text-[8px] font-mono text-text-tertiary">+{comp.top_keywords.length - 2}</span>}
                          </div>
                       </td>
                       <td className="p-6 text-right">
                          <button className="p-2 hover:text-accent transition-colors">
                             <MoreVertical className="w-4 h-4" />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Sidebar: AI Gap Analysis */}
         <div className="space-y-8">
            <div className="p-8 bg-background-elevated border border-accent/20 space-y-6">
               <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-accent" />
                  <h3 className="text-lg font-display font-bold uppercase">AI Gap <span className="text-accent">Analysis.</span></h3>
               </div>
               
               <div className="space-y-4">
                  <div className="p-4 bg-background-surface border border-border-slate space-y-2">
                     <span className="px-2 py-0.5 bg-loss/10 text-loss text-[8px] font-mono font-bold uppercase tracking-widest border border-loss/20">Critical Leak</span>
                     <p className="text-xs text-text-secondary leading-relaxed">
                        BabyPips is outranking us for "FCA Regulated Brokers" in the UK. 
                     </p>
                     <button className="text-[10px] font-bold uppercase text-accent hover:underline flex items-center gap-1">
                        Generate Counter-Content <ChevronRight className="w-3 h-3" />
                     </button>
                  </div>

                  <div className="p-4 bg-background-surface border border-border-slate space-y-2">
                     <span className="px-2 py-0.5 bg-profit/10 text-profit text-[8px] font-mono font-bold uppercase tracking-widest border border-profit/20">Opportunity</span>
                     <p className="text-xs text-text-secondary leading-relaxed">
                        Low competition detected for "Prop Firm Drawdown Rules 2024" search intent.
                     </p>
                     <button className="text-[10px] font-bold uppercase text-accent hover:underline flex items-center gap-1">
                        Dispatch Content <ChevronRight className="w-3 h-3" />
                     </button>
                  </div>
               </div>

               <button 
                 onClick={() => {
                   setIsAnalyzing(true);
                   setTimeout(() => setIsAnalyzing(false), 3000);
                 }}
                 disabled={isAnalyzing}
                 className="w-full py-4 bg-background-primary border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:border-accent transition-all flex items-center justify-center gap-2"
               >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Rescan Competitors
               </button>
            </div>

            <div className="p-8 bg-background-surface border border-border-slate space-y-4">
               <div className="flex items-center gap-2 text-warning">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest">SEO Alerts</span>
               </div>
               <p className="text-xs text-text-tertiary leading-relaxed">
                  Competitor "Topstep" launched a new "Trading Combine" calculator. Our landing page traffic for similar keywords dropped 12% this week.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
