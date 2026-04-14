import { notFound } from "next/navigation";
import { seoHowToData } from "@/data/seo-samples";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Metadata } from "next";

export async function generateStaticParams() {
  return seoHowToData.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const guide = seoHowToData.find(g => g.slug === slug);
  if (!guide) return {};

  return {
    title: guide.seo_title,
    description: guide.seo_description,
  };
}

export default async function HowToPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = seoHowToData.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Basic markdown to HTML logic for the MVP
  let htmlContent = guide.content;
  htmlContent = htmlContent.replace(/# (.*?)\n/g, '<h1 class="text-4xl md:text-5xl font-display font-black uppercase mb-8">$1</h1>\n');
  htmlContent = htmlContent.replace(/## (.*?)\n/g, '<h2 class="text-2xl font-display font-bold uppercase mt-12 mb-6 border-b border-border-slate pb-4">$1</h2>\n');
  htmlContent = htmlContent.replace(/### (.*?)\n/g, '<h3 class="text-xl font-display font-bold uppercase mt-8 mb-4 text-accent">$1</h3>\n');
  htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary">$1</strong>');
  htmlContent = htmlContent.replace(/\*(.*?)\*/g, '<em class="text-text-secondary">$1</em>');

  return (
    <div className="bg-background-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <Breadcrumbs />
        
        <article className="mt-12 space-y-8 animate-in fade-in duration-700">
          <div className="prose prose-invert prose-drawdown max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
