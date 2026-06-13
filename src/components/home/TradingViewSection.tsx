"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ExternalLink, BarChart2, Monitor, Layers, Zap, ChevronRight } from "lucide-react";

const TV_AFFILIATE_URL = "/go/tradingview";

const features = [
  {
    icon: BarChart2,
    title: "Industry-Standard Charts",
    description: "Used by professional traders worldwide. 100+ chart types, 400+ built-in indicators."
  },
  {
    icon: Monitor,
    title: "Multi-Timeframe Analysis",
    description: "Effortlessly switch between M1 and Monthly views on any market, any asset."
  },
  {
    icon: Layers,
    title: "Strategy Backtesting",
    description: "Pine Script allows you to test and automate strategies with a full historical dataset."
  },
  {
    icon: Zap,
    title: "Real-Time Alerts",
    description: "Price alerts, indicator alerts and drawing alerts sent directly to your phone."
  }
];

export function TradingViewSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scriptElement: HTMLScriptElement | null = null;
    let observer: IntersectionObserver | null = null;

    const initWidget = () => {
      // Clear container in case something is already there
      container.innerHTML = `<div id="tradingview_eurusd" style="height: 100%; width: 100%;"></div>`;

      scriptElement = document.createElement("script");
      scriptElement.src = "https://s3.tradingview.com/tv.js";
      scriptElement.async = true;
      scriptElement.onload = () => {
        if (typeof window !== "undefined" && (window as any).TradingView) {
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: "FX:EURUSD",
            interval: "60",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: false,
            container_id: "tradingview_eurusd",
          });
        }
      };
      document.head.appendChild(scriptElement);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            initWidget();
            if (observer) {
              observer.disconnect();
            }
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(container);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <section className="py-12 md:py-20 bg-[#F7F7F7] border-y border-mkt-bd relative overflow-hidden transition-colors duration-500">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #00C2FF 0, #00C2FF 1px, transparent 0, transparent 50%)",
        backgroundSize: "24px 24px"
      }} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <span className="text-accent font-mono text-[10px] uppercase tracking-[0.3em] block mb-4">
              // RECOMMENDED TOOLKIT
            </span>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-4xl md:text-6xl font-sans font-bold uppercase leading-tight">
                The Chart Platform <br />We Use Every Day.
              </h2>
            </div>
            {/* Discount Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-profit/10 border border-profit/30 mb-8">
              <span className="text-2xl font-sans font-black text-mkt-grn">$15 OFF</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mkt-grn">Exclusive via Drawdown</p>
                <p className="text-[9px] font-mono text-mkt-i4 uppercase">Use our link for instant savings</p>
              </div>
            </div>
            <p className="text-lg text-mkt-i2 leading-relaxed mb-8">
              TradingView is the industry standard for charting. Every pattern, indicator, and analysis concept taught in Drawdown is demonstrated using TradingView — because it&apos;s simply the best tool available.
            </p>
            <a
              href={TV_AFFILIATE_URL}
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-3 px-10 py-5 bg-mkt-ink hover:bg-mkt-i2 text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium shadow-xl shadow-accent/20 hover:-translate-y-0.5 rounded-lg"
            >
              Claim $15 Off TradingView <ExternalLink className="w-4 h-4" />
            </a>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">
                Affiliate link • We may earn a commission
              </p>
              <div className="w-px h-3 bg-border-slate" />
              <Link 
                href="/best/tradingview-review-uk" 
                className="text-[9px] font-mono text-accent uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Read Our Full Review <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>

          {/* TradingView "terminal" mockup */}
          <div className="relative">
            <div className="bg-[#131722] border border-mkt-bd overflow-hidden shadow-2xl h-[400px] md:h-[450px]">
              {/* Titlebar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-mkt-bd/50 bg-black/20">
                <div className="w-2.5 h-2.5 rounded-full bg-loss/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-profit/70" />
                <span className="ml-4 text-[9px] font-mono text-mkt-i4 uppercase tracking-widest">EURUSD • 1H • Live Chart</span>
              </div>
              <div ref={containerRef} className="w-full h-[calc(100%-37px)]" />
            </div>
            {/* Overlay badge */}
            <div className="absolute -top-4 -right-4 bg-accent px-4 py-2 text-background-primary text-[9px] font-black uppercase tracking-widest shadow-lg z-20">
              Our #1 Recommended
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-white border border-mkt-bd p-8 group hover:border-mkt-bds/50 transition-premium">
              <feature.icon className="w-8 h-8 text-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-base font-sans font-bold uppercase mb-3 text-mkt-ink group-hover:text-accent transition-colors">{feature.title}</h3>
              <p className="text-sm md:text-xs text-mkt-i4 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white border border-profit/20">
          <div className="flex items-center gap-6">
            <div className="shrink-0 text-center">
              <p className="text-3xl font-sans font-black text-mkt-grn">$15</p>
              <p className="text-[8px] font-mono font-bold uppercase tracking-widest text-mkt-grn">Savings</p>
            </div>
            <div className="w-px h-12 bg-border-slate" />
            <div>
              <p className="text-sm font-sans font-bold uppercase text-mkt-ink mb-1">Save $15 via our exclusive partner link.</p>
              <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">Applied automatically at checkout — no code required. Pro plans from $14.95/mo.</p>
            </div>
          </div>
          <a
            href={TV_AFFILIATE_URL}
            rel="noopener noreferrer sponsored"
            className="shrink-0 flex items-center gap-2 px-8 py-4 bg-profit text-background-primary text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-premium rounded-lg"
          >
            Claim Discount <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
