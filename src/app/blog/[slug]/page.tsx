import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft, Share2 } from "lucide-react";

interface Props {
  params: { slug: string };
}

// Mock single post fetch
const getPost = (slug: string) => {
  if (slug === "the-myth-of-the-100-percent-win-rate") {
    return {
      title: "The Myth of the 100% Win Rate",
      excerpt: "Why chasing perfection is the fastest way to blow your account, and what to focus on instead.",
      content: `
        <p>In the world of social media trading, we are constantly bombarded with screenshots of "100% win rate" strategies and perfectly green P&L charts. But in the reality of the institutions and high-level retail traders, a 100% win rate is not just impossible—it's irrelevant.</p>
        
        <h2>The Profit Factor vs. The Win Rate</h2>
        <p>A trader with a 40% win rate can be significantly more profitable than a trader with an 80% win rate. It all comes down to the risk-reward ratio (R:R). If your winners are three times the size of your losers, you only need to be right 25% of the time to break even.</p>
        
        <h2>Psychology and the Need for Certainty</h2>
        <p>Why do traders chase high win rates? It's human nature. We hate being wrong. Our brains are wired to avoid the "pain" of a loss, leading many to move their stop losses or "hope" that a trade turns around. This is the fastest way to a blown account.</p>
        
        <h2>The Cold Reality</h2>
        <p>To trade properly, you must embrace the drawdown. You must accept that losses are the operating cost of the business. Once you stop trying to be right and start trying to be profitable, your entire approach changes.</p>
      `,
      category: "Psychology",
      date: "April 12, 2026",
      readingTime: "5 min",
      author: "Pete",
    };
  }
  return null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) return {};
  return getMetadata({
    title: post.title,
    description: post.excerpt,
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      "name": post.author,
    },
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        <StructuredData type="Article" data={articleSchema} />

        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12">
            <ChevronLeft className="w-3 h-3" /> Back to Insights
          </Link>

          <header className="space-y-8 mb-16">
            <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold uppercase leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-y border-border-slate py-6">
              <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {post.date}</div>
              <div className="flex items-center gap-2"><Clock className="w-3 h-3" /> {post.readingTime} read</div>
              <div className="flex items-center gap-2"><Share2 className="w-3 h-3 cursor-pointer hover:text-accent" /> Share</div>
            </div>
          </header>

          <article 
            className="prose prose-invert prose-drawdown max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-24 p-12 bg-background-surface border border-border-slate">
            <h4 className="text-xl font-display font-bold uppercase mb-4">About the Author</h4>
            <p className="text-text-secondary leading-relaxed">
              Pete is the founder of Drawdown and a professional trader with over a decade of experience in the UK markets. He built this platform to bring honesty back to trading education.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
