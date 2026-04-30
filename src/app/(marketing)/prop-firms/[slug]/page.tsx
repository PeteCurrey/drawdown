import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROP_FIRM_REVIEWS } from "@/data/seo/prop-firms";
import { ShieldCheck, Target, Activity, Percent, ArrowRight, Check, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PROP_FIRM_REVIEWS.map((review) => ({
    slug: review.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = PROP_FIRM_REVIEWS.find((r) => r.slug === params.slug);
  if (!review) return {};

  return {
    title: review.title,
    description: review.metaDescription,
  };
}

export default function PropFirmReviewPage({ params }: Props) {
  const review = PROP_FIRM_REVIEWS.find((r) => r.slug === params.slug);

  if (!review) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-border-slate overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'Prop Firms', href: '/prop-firms' },
                { label: review.name, href: `/prop-firms/${review.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
              <div className="w-8 h-[1px] bg-accent" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">{review.eyebrow}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-[0.9] mb-8">
              {review.name} <span className="text-text-tertiary">Review.</span>
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn("w-3 h-3 rotate-45", i < Math.floor(review.rating) ? "bg-accent" : "bg-border-slate")} />
                  ))}
                </div>
                <span className="text-sm font-bold text-text-primary">{review.rating}/5.0</span>
              </div>
              <div className="text-xs font-mono uppercase text-text-tertiary tracking-widest">
                Last Updated: {review.lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Specs Grid */}
      <section className="py-12 bg-background-surface border-b border-border-slate">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { label: "Profit Split", value: review.payoutSplit, icon: Percent },
              { label: "Max Leverage", value: review.maxLeverage, icon: Activity },
              { label: "Profit Target", value: review.profitTarget, icon: Target },
              { label: "Max Drawdown", value: review.maxDrawdown, icon: ShieldCheck },
              { label: "Min Days", value: review.minTradingDays, icon: Activity },
              { label: "Evaluation", value: review.feeStructure, icon: ShieldCheck },
            ].map((spec, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center gap-2 text-text-tertiary">
                  <spec.icon className="w-3 h-3" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{spec.label}</span>
                </div>
                <div className="text-lg font-display font-bold text-text-primary tracking-tight">
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-16">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl text-text-secondary leading-relaxed font-medium">
                {review.introduction}
              </p>

              <h2 className="text-3xl font-display font-bold uppercase tracking-tight mt-12 mb-6">The Challenge Rules</h2>
              <p className="text-lg leading-relaxed text-text-secondary">
                {review.challengeRules}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="p-8 bg-profit/5 border border-profit/20">
                  <div className="flex items-center gap-3 mb-4 text-profit">
                    <Check className="w-5 h-5" />
                    <h3 className="text-lg font-bold uppercase tracking-tight m-0 text-profit">What We Like</h3>
                  </div>
                  <ul className="space-y-3 m-0 p-0 list-none">
                    {review.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2 m-0">
                        <span className="w-1.5 h-1.5 bg-profit/40 rounded-full mt-1.5 shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 bg-loss/5 border border-loss/20">
                  <div className="flex items-center gap-3 mb-4 text-loss">
                    <X className="w-5 h-5" />
                    <h3 className="text-lg font-bold uppercase tracking-tight m-0 text-loss">What We Don't</h3>
                  </div>
                  <ul className="space-y-3 m-0 p-0 list-none">
                    {review.cons.map((con, i) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2 m-0">
                        <span className="w-1.5 h-1.5 bg-loss/40 rounded-full mt-1.5 shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-3xl font-display font-bold uppercase tracking-tight mt-12 mb-6">Fee Structure & Refunds</h2>
              <p className="text-lg leading-relaxed text-text-secondary">
                {review.feeAndRefund}
              </p>

              <h2 className="text-3xl font-display font-bold uppercase tracking-tight mt-12 mb-6">Trading Conditions & Spreads</h2>
              <p className="text-lg leading-relaxed text-text-secondary">
                {review.tradingConditions}
              </p>

              <div className="bg-background-surface border border-border-slate p-10 my-16">
                 <div className="flex items-center gap-4 mb-6">
                    <AlertCircle className="w-8 h-8 text-accent" />
                    <h2 className="text-3xl font-display font-black uppercase m-0">The Verdict.</h2>
                 </div>
                 <p className="text-xl text-text-primary leading-relaxed font-medium italic">
                   "{review.verdict}"
                 </p>
                 <div className="pt-8">
                   <Link 
                      href={`/api/market/prop-firms/redirect?id=${review.slug}&source=review_page`}
                      className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20"
                   >
                      Start Your Challenge <ArrowRight className="w-4 h-4" />
                   </Link>
                 </div>
              </div>
            </div>

            {/* FAQs */}
            {review.faqs.length > 0 && (
              <div className="space-y-8 pt-12 border-t border-border-slate">
                <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Common Questions</h2>
                <div className="grid grid-cols-1 gap-6">
                  {review.faqs.map((faq, i) => (
                    <div key={i} className="p-8 bg-background-surface border border-border-slate">
                      <h4 className="text-lg font-bold text-text-primary mb-4">{faq.question}</h4>
                      <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              <div className="p-8 bg-background-surface border border-border-slate space-y-6">
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">Quick Comparison</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                      <span className="text-[10px] font-mono uppercase text-text-tertiary">Daily Limit</span>
                      <span className="text-sm font-bold text-loss">{review.dailyDrawdown}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                      <span className="text-[10px] font-mono uppercase text-text-tertiary">Total Limit</span>
                      <span className="text-sm font-bold text-loss">{review.maxDrawdown}</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-border-slate/50">
                      <span className="text-[10px] font-mono uppercase text-text-tertiary">Profit Share</span>
                      <span className="text-sm font-bold text-profit">{review.payoutSplit}</span>
                   </div>
                </div>
                <Link 
                   href={`/api/market/prop-firms/redirect?id=${review.slug}&source=sidebar`}
                   className="w-full py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                   Visit Official Site <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-8 border border-border-slate space-y-6">
                 <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-text-tertiary">Other Reviews</h3>
                 <div className="space-y-4">
                    {PROP_FIRM_REVIEWS.filter(r => r.slug !== review.slug).map(r => (
                      <Link key={r.slug} href={`/prop-firms/${r.slug}`} className="group flex items-center justify-between text-sm text-text-secondary hover:text-text-primary transition-colors">
                        <span>{r.name} Review</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
