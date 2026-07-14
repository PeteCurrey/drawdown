import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { 
  BarChart4, 
  ArrowRight,
  Zap,
  MessageCircle,
  Newspaper,
  Waves,
  Gauge
} from "lucide-react";
import Link from "next/link";
import { getSocialSentiment, getNewsSentiment } from "@/lib/market";
import { cn } from "@/lib/utils";

export const metadata = getMetadata({
  title: "Sentiment Pulse — Track the Market Mood",
  description: "Monitor real-time social buzz and news sentiment across Reddit, Twitter, and major financial outlets.",
  path: "/intelligence/sentiment-pulse"
});

export default async function SentimentPulseLanding() {
  const [social, news] = await Promise.all([
    getSocialSentiment("NVDA"),
    getNewsSentiment("NVDA")
  ]);

  const socialScore = social?.score || 0.65;
  const newsScore = news?.sentiment || 0.58;

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        
        <header className="max-w-4xl mb-24">
          <div className="text-accent font-mono text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
            <Waves className="w-3 h-3" /> // INTELLIGENCE HUB
          </div>
          <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase mb-8 leading-[0.9]">
            The Crowd <br /> <span className="text-accent">Pulse.</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed font-sans max-w-2xl">
            Markets aren't just numbers; they are human emotion. Our Sentiment Pulse tracks millions of data points across social media and news to show you when the crowd is hitting a fever pitch.
          </p>
          <div className="mt-10">
            <Link href="/signup" className="px-10 py-5 bg-mkt-ink text-white font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all flex items-center gap-2 w-fit">
              Access the Pulse <Zap className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: "Social Buzz Tracking",
              desc: "Real-time monitoring of Reddit (r/wallstreetbets) and FinTwit mentions.",
              icon: MessageCircle
            },
            {
              title: "News Bias Analysis",
              desc: "AI-powered scanning of financial news for bullish/bearish lean.",
              icon: Newspaper
            },
            {
              title: "Contrarian Indicators",
              desc: "Identify when extreme sentiment suggests a market reversal is imminent.",
              icon: Gauge
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 group hover:border-border-slate/50 transition-all">
              <feature.icon className="w-8 h-8 text-accent mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-sans font-bold uppercase mb-4">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Live Gauges (Visual Hook) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
           <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-accent" /> Social Media Sentiment
                 </h3>
                 <span className="text-[10px] font-mono text-text-tertiary">SYMBOL: NVDA</span>
              </div>
              <div className="relative h-4 bg-background-elevated/40 rounded-full overflow-hidden border border-border-slate/50">
                 <div 
                   className="absolute inset-y-0 left-0 bg-gradient-to-r from-loss via-accent to-profit transition-all duration-1000"
                   style={{ width: `${socialScore * 100}%` }}
                 />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                 <span className="text-red-500">Extreme Fear</span>
                 <span className="text-accent">Neutral</span>
                 <span className="text-profit">Extreme Greed</span>
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed text-center italic">
                "NVDA buzz is up 42% this week on Reddit. Sentiment is shifting toward 'Overbought' territory."
              </p>
           </div>

           <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-accent" /> Institutional News Bias
                 </h3>
                 <span className="text-[10px] font-mono text-text-tertiary">SYMBOL: NVDA</span>
              </div>
              <div className="relative h-4 bg-background-elevated/40 rounded-full overflow-hidden border border-border-slate/50">
                 <div 
                   className="absolute inset-y-0 left-0 bg-profit/60 transition-all duration-1000"
                   style={{ width: `${newsScore * 100}%` }}
                 />
              </div>
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                 <span>0% Bullish</span>
                 <span>50%</span>
                 <span>100% Bullish</span>
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed text-center italic">
                "News coverage remains moderately bullish with strong institutional support in semi-conductors."
              </p>
           </div>
        </div>

        {/* CTA */}
        <section className="py-24 border-t border-border-slate/50 text-center space-y-12">
           <h2 className="text-4xl md:text-7xl font-sans font-bold uppercase leading-tight">
             Don't trade <br /> the crowd. <span className="text-accent">Trade the truth.</span>
           </h2>
           <p className="text-text-secondary max-w-xl mx-auto text-lg leading-relaxed">
             Our Sentiment Pulse is designed to show you what everyone else is thinking, so you can make decisions based on what is actually happening.
           </p>
           <Link href="/signup" className="inline-flex items-center gap-4 px-12 py-6 bg-mkt-ink text-white font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all">
             Unlock Sentiment Engine <ArrowRight className="w-4 h-4" />
           </Link>
        </section>
      </div>
    </div>
  );
}
