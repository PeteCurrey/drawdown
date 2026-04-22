"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ChevronDown, Play, Clock, Shield, Zap, Brain, LineChart, Lock, LayoutDashboard, Calendar, Percent, Gauge, Radio, BarChart3, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { phases } from "@/data/courses";
import { ShieldCheck, BrainCircuit, Play as PlayIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Mapping icons to phases for Lucide components
const iconMap: Record<string, any> = {
  ShieldCheck,
  LineChart,
  Zap,
  Lock,
  BrainCircuit,
  PlayIcon
};

const marketTools = [
  {
    name: "Markets Overview",
    subtitle: "Real-time Ticker & Macro",
    href: "/markets?tab=overview",
    icon: LayoutDashboard,
    type: "Command Center",
    image: "/images/tools/terminal.png"
  },
  {
    name: "Economic Calendar",
    subtitle: "Global Macro Events",
    href: "/markets?tab=calendar",
    icon: Calendar,
    type: "Macro Data",
    image: "/images/tools/scanner.png"
  },
  {
    name: "Market Scanner",
    subtitle: "Technical Price Action",
    href: "/markets?tab=scanner",
    icon: Percent,
    type: "Institutional",
    image: "/images/tools/ai-market-scanner.png"
  },
  {
    name: "Sentiment Index",
    subtitle: "Psychology & Volatility",
    href: "/markets?tab=sentiment",
    icon: Gauge,
    type: "Contrarian",
    image: "/images/tools/ai-daily-briefing.png"
  },
  {
    name: "Live News Feed",
    subtitle: "Sentiment Aggregation",
    href: "/markets?tab=news",
    icon: Radio,
    type: "Real-time",
    image: "/images/tools/ai-trade-journal.png"
  },
  {
    name: "Earnings Guide",
    subtitle: "Corporate Reporting",
    href: "/markets?tab=earnings",
    icon: BarChart3,
    type: "Fundamental",
    image: "/images/tools/risk-calculator.png"
  }
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const learnHref = user ? "/learn" : "/courses";

  const navLinks = [
    { name: "Learn", href: learnHref, hasMegaMenu: true },
    { name: "Markets", href: "/markets", hasMegaMenu: true },
    { name: "Brokers", href: "/brokers" },
    { name: "Tools", href: "/tools" },
    { name: "Resources", href: "/learn-to-trade", hasMegaMenu: true },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: "top top",
        onUpdate: (self) => {
          setIsScrolled(self.scroll() > 50);
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleMegaMenuEnter = (linkName: string) => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setActiveMegaMenu(linkName);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-8 left-0 w-full z-[70] py-6 transition-all duration-500 transition-premium",
          isScrolled ? "bg-background-primary/90 backdrop-blur-md border-b border-border-slate py-4" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-extrabold tracking-widest-xl uppercase hover:opacity-80 transition-opacity flex items-end">
            Drawdown<span className="text-accent ml-0.5">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={link.hasMegaMenu ? () => handleMegaMenuEnter(link.name) : undefined}
                onMouseLeave={link.hasMegaMenu ? handleMegaMenuLeave : undefined}
              >
                <Link
                  href={link.href}
                  className="group flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.name}
                  {link.hasMegaMenu && (
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      activeMegaMenu === link.name ? "rotate-180 text-accent" : ""
                    )} />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-background-primary text-sm font-bold uppercase tracking-widest transition-colors rounded-none"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mega Menu Dropdown */}
      <div
        className={cn(
          "fixed top-8 left-0 w-full z-40 pt-[80px] transition-all duration-500 hidden lg:block",
          activeMegaMenu
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
        onMouseEnter={() => activeMegaMenu && handleMegaMenuEnter(activeMegaMenu)}
        onMouseLeave={handleMegaMenuLeave}
      >
        <div className="bg-background-surface/95 backdrop-blur-xl border-b border-border-slate shadow-2xl shadow-background-primary/50">
          <div className="container mx-auto px-6 py-10">
            {activeMegaMenu === "Learn" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Left Column — Phases */}
                <div className="col-span-8">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                    Curriculum Phases
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {phases.map((phase) => {
                      const Icon = iconMap[phase.icon] || ShieldCheck;
                      const phaseHref = user ? `/learn/${phase.slug}` : `/courses/${phase.slug}`;
                      
                      return (
                        <Link
                          key={phase.name}
                          href={phaseHref}
                          className="group flex gap-5 p-4 border border-border-slate/30 bg-background-surface hover:border-accent hover:bg-background-elevated transition-all duration-500 relative overflow-hidden"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          {/* Hover Background Image */}
                          <div className="absolute inset-0 z-0">
                            <img 
                              src={phase.image} 
                              alt="" 
                              className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-background-surface/50 to-transparent" />
                          </div>

                          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                             <span className="text-4xl font-mono font-black text-accent">
                               {phase.number}
                             </span>
                          </div>

                          <div className="relative z-10 flex gap-5 w-full">
                            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-background-primary border border-border-slate group-hover:border-accent/40 transition-colors">
                              <span className="text-2xl font-mono font-black text-accent/20 group-hover:text-accent/3 transition-colors">
                                {phase.number}
                              </span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-display font-bold uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors">
                                  {phase.name}
                                </h4>
                                <span className={cn(
                                  "text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border",
                                  phase.tier === 'Free' ? "text-text-primary border-border-slate" : 
                                  phase.tier === 'Foundation' ? "text-accent border-accent/30" : 
                                  "text-premium border-premium/30"
                                )}>
                                  {phase.tier}
                                </span>
                              </div>
                              <p className="text-[9px] text-text-secondary font-sans uppercase tracking-widest mt-1">
                                {phase.subtitle}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                                  <PlayIcon className="w-2.5 h-2.5" /> {phase.modules_count} Modules
                                </span>
                                <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" /> {phase.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column — CTA */}
                <div className="col-span-4 flex flex-col">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                    Quick Access
                  </p>
                  <div className="flex-grow space-y-4">
                    <Link
                      href={learnHref}
                      className="block p-6 bg-background-elevated border border-border-slate hover:border-accent transition-all group"
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <h4 className="text-lg font-display font-bold uppercase group-hover:text-accent transition-colors">
                        Full Course Library
                      </h4>
                      <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                        6 phases. 60+ modules. From zero to professional-grade edge.
                      </p>
                      <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-accent">
                        Browse All →
                      </span>
                    </Link>
                    <Link
                      href="/pricing"
                      className="block p-6 border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all group"
                      onClick={() => setActiveMegaMenu(null)}
                    >
                      <h4 className="text-lg font-display font-bold uppercase group-hover:text-accent transition-colors">
                        Pro Membership
                      </h4>
                      <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                        Unlock Expert Analysis, Live Ticker, and advanced AI signals.
                      </p>
                      <span className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-accent">
                        View Plans →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeMegaMenu === "Markets" && (
              <div className="grid grid-cols-12 gap-10">
                {/* Left Column — Tools */}
                <div className="col-span-8">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                    Intelligence Tools
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {marketTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.name}
                          href={tool.href}
                          className="group flex gap-5 p-4 border border-border-slate/30 bg-background-surface hover:border-accent hover:bg-background-elevated transition-all duration-500 relative overflow-hidden"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          {/* Hover Background Image */}
                          <div className="absolute inset-0 z-0">
                            <img 
                              src={tool.image} 
                              alt="" 
                              className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-20"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-background-surface/50 to-transparent" />
                          </div>

                          <div className="relative z-10 flex gap-5 w-full">
                            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-background-primary border border-border-slate group-hover:border-accent/40 transition-colors">
                               <Icon className="w-6 h-6 text-accent/40 group-hover:text-accent transition-colors" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-display font-bold uppercase tracking-tight text-text-primary group-hover:text-accent transition-colors">
                                  {tool.name}
                                </h4>
                                <span className={cn(
                                  "text-[7px] font-mono uppercase tracking-widest px-1.5 py-0.5 border text-accent border-accent/20"
                                )}>
                                  {tool.type}
                                </span>
                              </div>
                              <p className="text-[9px] text-text-secondary font-sans uppercase tracking-widest mt-1">
                                {tool.subtitle}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column — Insights CTA */}
                <div className="col-span-4 flex flex-col">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                    Market Sentiment
                  </p>
                  <div className="flex-grow p-10 bg-accent/5 border border-accent/20 relative overflow-hidden group">
                     <div className="relative z-10 space-y-6">
                        <div className="space-y-2">
                           <h4 className="text-xl font-display font-bold uppercase text-accent">Live Trading Room</h4>
                           <p className="text-xs text-text-secondary leading-relaxed">
                             Watch institutional-grade execution in real-time. Full analysis on all major UK news events.
                           </p>
                        </div>
                        <Link 
                          href="/login" 
                          className="block text-center py-4 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          Join Live Room
                        </Link>
                     </div>
                     {/* Aesthetic radial gradient */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            )}

            {activeMegaMenu === "Resources" && (
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-8">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                    Trading Intelligence Hub
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/glossary" className="p-6 border border-border-slate hover:border-accent transition-all group" onClick={() => setActiveMegaMenu(null)}>
                      <h4 className="text-sm font-bold uppercase text-text-primary group-hover:text-accent">Trading Glossary</h4>
                      <p className="text-[10px] text-text-tertiary mt-2 uppercase tracking-widest">A-Z of Institutional Jargon</p>
                    </Link>
                    <Link href="/how-to" className="p-6 border border-border-slate hover:border-accent transition-all group" onClick={() => setActiveMegaMenu(null)}>
                      <h4 className="text-sm font-bold uppercase text-text-primary group-hover:text-accent">How-To Guides</h4>
                      <p className="text-[10px] text-text-tertiary mt-2 uppercase tracking-widest">Step-by-Step Execution</p>
                    </Link>
                    <Link href="/compare" className="p-6 border border-border-slate hover:border-accent transition-all group" onClick={() => setActiveMegaMenu(null)}>
                      <h4 className="text-sm font-bold uppercase text-text-primary group-hover:text-accent">Comparison Hub</h4>
                      <p className="text-[10px] text-text-tertiary mt-2 uppercase tracking-widest">Broker & Tool Benchmarks</p>
                    </Link>
                    <Link href="/best" className="p-10 border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all group flex items-center justify-between" onClick={() => setActiveMegaMenu(null)}>
                      <div>
                        <h4 className="text-lg font-display font-bold uppercase text-accent">Best of 2026</h4>
                        <p className="text-xs text-text-secondary mt-1">Our Verified Recommendations</p>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                <div className="col-span-4 space-y-6">
                   <Link href="/blog" className="block p-8 bg-background-elevated border border-border-slate hover:border-accent transition-all group" onClick={() => setActiveMegaMenu(null)}>
                      <h4 className="text-sm font-bold uppercase text-text-primary group-hover:text-accent">Insights & Blog</h4>
                      <p className="text-xs text-text-secondary mt-2">Latest market commentary and psychological deep-dives.</p>
                   </Link>
                   <Link href="/pricing" className="block p-8 bg-background-elevated border border-border-slate hover:border-accent transition-all group" onClick={() => setActiveMegaMenu(null)}>
                      <h4 className="text-sm font-bold uppercase text-text-primary group-hover:text-accent">Pricing & Plans</h4>
                      <p className="text-xs text-text-secondary mt-2">View our membership tiers and institutional features.</p>
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background-primary transition-transform duration-500 transition-premium lg:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full pt-32 px-6 pb-12">
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-3xl font-display font-bold uppercase tracking-widest text-text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border-slate/50 my-4" />
            <Link href="/glossary" className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Glossary</Link>
            <Link href="/how-to" className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>How-To Guides</Link>
            <Link href="/compare" className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Comparisons</Link>
            <Link href="/blog" className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
            <Link href="/pricing" className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
          </div>
          <div className="mt-auto flex flex-col gap-6">
            <Link 
              href="/login" 
              className="text-xl font-display font-bold uppercase tracking-widest text-text-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              href="/signup" 
              className="w-full py-5 bg-accent text-background-primary text-center font-bold uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
