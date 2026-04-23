import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { WireSubscribeForm } from "@/components/newsletter/WireSubscribeForm";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: edition } = await supabase
    .from('newsletter_editions')
    .select('subject_line')
    .eq('id', params.id)
    .single();

  return {
    title: `${edition?.subject_line || 'Newsletter'} | The Wire | Drawdown`,
  };
}

export default async function NewsletterEditionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: edition } = await supabase
    .from('newsletter_editions')
    .select('*, newsletter_sections(*)')
    .eq('id', params.id)
    .single();

  if (!edition || edition.status !== 'sent') {
    notFound();
  }

  const sections = [...edition.newsletter_sections].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background-primary">
      <div className="container mx-auto px-6 max-w-3xl">
        <Link 
          href="/newsletter" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12"
        >
           <ArrowLeft className="w-3 h-3" /> Back to Archive
        </Link>

        <article className="bg-background-surface border border-border-slate overflow-hidden">
           {/* Header */}
           <div className="p-8 md:p-12 border-b border-border-slate space-y-6">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                    The Wire • {edition.edition_type}
                 </span>
                 <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                    {new Date(edition.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight leading-none">
                 {edition.subject_line}
              </h1>
              <p className="text-lg text-text-tertiary italic leading-relaxed">
                 {edition.preview_text}
              </p>
           </div>

           {/* Content Sections */}
           <div className="divide-y divide-border-slate">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className={section.section_key === 'petes_take' ? "p-8 md:p-12 bg-background-elevated border-l-4 border-l-accent" : "p-8 md:p-12"}
                >
                   <div className="flex flex-col space-y-6">
                      <span className="inline-block self-start text-[9px] font-mono font-bold text-accent uppercase tracking-widest px-2 py-1 border border-accent/20">
                         {section.section_title}
                      </span>
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-text-secondary">
                         {section.edited_content || section.ai_content}
                      </div>
                      {section.section_key === 'petes_take' && (
                        <p className="pt-6 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                           — Pete Currey, Founder // Drawdown
                        </p>
                      )}
                   </div>
                </div>
              ))}
           </div>

           {/* Footer CTA */}
           <div className="p-8 md:p-12 bg-background-elevated border-t border-border-slate text-center space-y-8">
              <div className="space-y-4">
                 <h3 className="text-xl font-display font-bold uppercase tracking-tight">Enjoyed this intelligence?</h3>
                 <p className="text-sm text-text-tertiary max-w-md mx-auto">
                    Get The Wire in your inbox every morning at 07:00 GMT. 
                    Institutional analysis for the retail trader.
                 </p>
              </div>
              <div className="max-w-md mx-auto">
                 <WireSubscribeForm source="newsletter_archive_view" />
              </div>
           </div>
        </article>
      </div>
    </div>
  );
}
