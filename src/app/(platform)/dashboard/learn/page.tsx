import { createClient } from "@/lib/supabase/server";
import { 
  Play, 
  Search, 
  Clock, 
  ShieldCheck, 
  Library,
  Video,
  ChevronRight,
  MonitorPlay
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
 
export default async function LearnArchivePage() {
  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from('recorded_sessions')
    .select('*')
    .order('created_at', { ascending: false });
 
  const categories = ['Strategy', 'Mindset', 'Journal', 'Recap'];
 
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      <header className="border-b border-border-slate/50 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-accent mb-3">
            <Library className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Knowledge_Vault // v1.0</span>
          </div>
          <h1 className="text-4xl font-display font-black uppercase tracking-tight text-text-primary">The <span className="text-accent">Library.</span></h1>
          <p className="text-sm text-text-tertiary mt-2">Archived live sessions, curriculum deep-dives, and mindset briefings.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="SEARCH ARCHIVE..." 
            className="w-full bg-background-surface border border-border-slate/80 pl-10 pr-4 py-3 text-[10px] font-mono uppercase outline-none focus:border-accent text-text-primary rounded-lg"
          />
        </div>
      </header>
 
      {/* Categories */}
      <div className="flex flex-wrap gap-2.5">
        {['All Sessions', ...categories].map((cat, i) => (
          <button 
            key={i} 
            className={cn(
              "px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
              i === 0 
                ? "bg-[#0A0A0A] text-white border-[#0A0A0A] hover:bg-neutral-800" 
                : "border-border-slate text-text-tertiary hover:border-accent hover:text-accent hover:bg-neutral-50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
 
      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions?.map((session) => (
          <div key={session.id} className="group flex flex-col bg-background-surface border border-border-slate/50 rounded-xl overflow-hidden hover:border-accent/40 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
             {/* Thumbnail Placeholder */}
             <div className="relative aspect-video bg-background-elevated/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                   <div className="p-4 rounded-full bg-accent/20 border border-accent/40 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-accent fill-accent" />
                   </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-[9px] font-mono text-white rounded-md">
                   {session.duration}
                </div>
                <div className="absolute top-3 left-3 px-2 py-1 bg-accent text-background-primary text-[8px] font-bold uppercase tracking-widest rounded-md">
                   {session.category}
                </div>
             </div>
 
             <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                   <h3 className="text-lg font-display font-bold uppercase tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight text-text-primary">
                      {session.title}
                   </h3>
                   <p className="text-xs text-text-tertiary leading-relaxed line-clamp-2">
                      {session.description}
                   </p>
                </div>
 
                <div className="pt-6 border-t border-border-slate/30 flex justify-between items-center">
                   <div className="flex items-center gap-2 text-[9px] font-mono text-text-tertiary uppercase">
                      <Clock className="w-3 h-3" /> {new Date(session.created_at).toLocaleDateString()}
                   </div>
                   <Link href={`/learn/${session.id}`} className="flex items-center gap-1 text-[9px] font-bold uppercase text-accent hover:underline">
                      Watch Now <ChevronRight className="w-3 h-3" />
                   </Link>
                </div>
             </div>
          </div>
        ))}
      </div>
 
      {/* Featured Insight Section */}
      <section className="bg-background-surface border border-border-slate/50 p-10 relative overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] group">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4 aspect-video bg-background-primary flex items-center justify-center border border-border-slate/50 rounded-lg">
               <MonitorPlay className="w-12 h-12 text-accent opacity-20" />
            </div>
            <div className="md:col-span-8 space-y-4">
               <div className="flex items-center gap-2 text-profit">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Featured Briefing</span>
               </div>
               <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">The 2026 Institutional Road Map</h2>
               <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                  Pete's core framework for identifying premium liquidity clusters in the current market cycle. Essential viewing for anyone entering Phase 2 of the curriculum.
               </p>
               <button className="px-8 py-4 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg">
                  Access Premium Briefing
               </button>
            </div>
         </div>
         {/* Background Decor */}
         <Video className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 text-accent opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
      </section>
    </div>
  );
}
