import React from "react";
import Link from "next/link";
import { Wrench, Star, ChevronRight, ExternalLink, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { tradingTools } from "@/data/trading-tools";

export const metadata = {
  title: "Recommended Trading Tools & Software Reviews",
  description: "Explore honest reviews and ratings of the best charting software, trading journals, backtesters, VPS, and market data providers.",
};

export default function TradingToolsHubPage() {
  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <TrackPageView path="/trading-tools" />
      <div className="container mx-auto px-6">
        <Breadcrumbs 
          items={[
            { label: "Trading Tools", href: "/trading-tools" }
          ]}
        />

        {/* Hero */}
        <div className="max-w-4xl mb-16 space-y-6">
          <div className="flex items-center gap-3 text-accent">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Resource Directory</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.9] text-text-primary">
            Trading <span className="text-accent italic">Tools.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Honest evaluations of third-party software, VPS platforms, and data feeds. We test execution parameters, reliability, and pricing to help you build your stack.
          </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {tradingTools.map((tool) => (
            <div 
              key={tool.slug}
              className="p-8 border border-border-slate/50 hover:border-accent bg-background-surface/40 backdrop-blur-md flex flex-col justify-between group transition-colors"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary bg-background-primary px-2.5 py-1 border border-border-slate/50/50">
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-1 text-accent text-xs font-mono font-bold">
                    <span>★</span>
                    <span>{tool.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-sans font-black uppercase text-text-primary group-hover:text-accent transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed h-12 overflow-hidden">
                    {tool.tagline}
                  </p>
                  <p className="text-[9px] font-mono uppercase tracking-wider text-text-tertiary pt-2">
                    Pricing: {tool.pricing}
                  </p>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4">
                <Link 
                  href={`/trading-tools/${tool.slug}`}
                  className="w-full py-4 border border-border-slate/50 text-center text-[9px] font-mono font-bold uppercase tracking-widest text-text-primary hover:border-accent hover:text-accent transition-colors"
                >
                  Read Review
                </Link>
                <a 
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-mkt-ink text-white text-center text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center justify-center gap-1"
                >
                  Visit Site <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <section className="bg-background-primary border border-border-slate/50 p-12 text-center space-y-6">
          <h2 className="text-3xl font-sans font-black text-text-primary uppercase tracking-tight">Looking for proprietary scanners?</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
            Check out Drawdown's built-in AI tools, trading journals, and risk modelers under our proprietary tech catalog.
          </p>
          <div className="pt-4">
            <Link 
              href="/tools"
              className="px-10 py-5 bg-mkt-ink hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              Explore Proprietary Stack <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
