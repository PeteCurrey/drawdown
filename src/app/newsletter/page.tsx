import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Mail, ChevronRight, Calendar } from "lucide-react";

export const metadata = {
  title: "The Wire Archive | Drawdown",
  description: "Browse the complete archive of past editions of The Wire, Drawdown's daily market intelligence newsletter providing actionable session briefs.",
};

export default async function NewsletterArchivePage() {
  const supabase = await createClient();

  const { data: editions } = await supabase
    .from('newsletter_editions')
    .select('*')
    .eq('status', 'sent')
    .order('sent_at', { ascending: false });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-primary">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col items-center text-center mb-20 space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              <Mail className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Market Intelligence Archive</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight">The Wire.</h1>
           <p className="max-w-2xl text-text-tertiary text-lg">
              Daily insights for institutional-minded traders. Browse our history of market analysis, from macro shifts to technical setups.
           </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
           {editions?.map((edition) => (
             <Link 
               key={edition.id}
               href={`/newsletter/${edition.id}`}
               className="group p-8 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium flex flex-col md:flex-row md:items-center justify-between gap-6"
             >
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-widest px-2 py-1 bg-accent/10 border border-accent/20">
                         {edition.edition_type}
                      </span>
                      <div className="flex items-center gap-2 text-text-tertiary">
                         <Calendar className="w-3 h-3" />
                         <span className="text-[10px] font-mono uppercase tracking-widest">
                            {new Date(edition.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                         </span>
                      </div>
                   </div>
                   <h2 className="text-xl font-display font-bold uppercase group-hover:text-accent transition-colors">
                      {edition.subject_line}
                   </h2>
                   <p className="text-sm text-text-tertiary max-w-xl line-clamp-1 italic">
                      {edition.preview_text}
                   </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors">
                   READ EDITION <ChevronRight className="w-4 h-4" />
                </div>
             </Link>
           ))}

           {(!editions || editions.length === 0) && (
             <div className="text-center py-20 border border-dashed border-border-slate opacity-50">
                <p className="text-xs font-mono uppercase tracking-widest">The archive is currently being populated...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
