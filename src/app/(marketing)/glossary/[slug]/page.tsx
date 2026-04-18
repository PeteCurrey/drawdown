import { notFound } from "next/navigation";
import { seoGlossaryData } from "@/data/seo-samples";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Metadata } from "next";

export async function generateStaticParams() {
  return seoGlossaryData.map((term) => ({
    slug: term.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const term = seoGlossaryData.find(t => t.slug === slug);
  if (!term) return {};

  return {
    title: term.seo_title,
    description: term.seo_description,
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = seoGlossaryData.find((t) => t.slug === slug);

  if (!term) {
    notFound();
  }

  return (
    <div className="bg-background-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Breadcrumbs />
        
        <article className="mt-12 space-y-8 animate-in fade-in duration-700">
          <div className="prose prose-invert prose-drawdown max-w-none">
            <div dangerouslySetInnerHTML={{ __html: term.content.replace(/\n##/g, '<br/>##').replace(/\n#/g, '<h1 class="text-4xl md:text-6xl font-display font-black uppercase mb-8">').replace(/<h1>/g, '<h1 class="text-4xl md:text-6xl font-display font-black uppercase mb-8">').replace(/## (.*)/g, '<h2 class="text-2xl font-display font-bold uppercase mt-12 mb-6 border-b border-border-slate pb-4">$1</h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/<br\/>/g, '') }} />
          </div>

          <div className="mt-16 p-8 bg-background-elevated border border-border-slate text-center space-y-4">
            <h4 className="text-xl font-display font-bold uppercase">Ready to put this into practice?</h4>
            <p className="text-sm text-text-secondary">Join The Drawdown platform and master risk management with our advanced curriculum.</p>
            <a href="/signup" className="inline-block px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors">Start Free Trial</a>
          </div>
        </article>
      </div>
    </div>
  );
}
