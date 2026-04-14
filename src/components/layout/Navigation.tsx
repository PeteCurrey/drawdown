"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ChevronDown, Play, Clock, Shield, Zap, Brain, LineChart } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = [
  {
    number: "01",
    name: "Ground Zero",
    subtitle: "The Foundation of Discipline",
    href: "/learn/ground-zero",
    icon: Shield,
    tier: "Free",
    modules: 8,
    duration: "4.5h",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200",
  },
  {
    number: "02",
    name: "Chart Reader",
    subtitle: "Technical Foundations",
    href: "/learn/chart-reader",
    icon: LineChart,
    tier: "Foundation",
    modules: 12,
    duration: "8h",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200",
  },
  {
    number: "03",
    name: "Strategist",
    subtitle: "Strategy Development",
    href: "/learn/strategist",
    icon: Zap,
    tier: "Foundation",
    modules: 10,
    duration: "6.5h",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200",
  },
  {
    number: "04",
    name: "Staying Alive",
    subtitle: "Risk Management",
    href: "/learn/risk-manager",
    icon: Lock,
    tier: "Foundation",
    modules: 6,
    duration: "3h",
    image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1200",
  },
  {
    number: "05",
    name: "The 80%",
    subtitle: "Psychology & Discipline",
    href: "/learn/mind-over-market",
    icon: Brain,
    tier: "Edge",
    modules: 10,
    duration: "5h",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=1200",
  },
  {
    number: "06",
    name: "The Edge",
    subtitle: "Advanced Techniques",
    href: "/learn/the-edge",
    icon: Play,
    tier: "Edge",
    modules: 14,
    duration: "12h",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200",
  },
];

const navLinks = [
  { name: "Learn", href: "/courses", hasMegaMenu: true },
  { name: "Tools", href: "/tools" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

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

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 200);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 w-full z-50 py-6 transition-all duration-500 transition-premium",
          isScrolled ? "bg-background-primary/90 backdrop-blur-md border-b border-border-slate py-4" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-extrabold tracking-widest-xl uppercase hover:opacity-80 transition-opacity">
            Drawdown
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={link.hasMegaMenu ? handleMegaMenuEnter : undefined}
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
                      isMegaMenuOpen ? "rotate-180 text-accent" : ""
                    )} />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden lg:flex items-center gap-6">
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

      {/* Mega Menu — Learn */}
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-40 pt-[80px] transition-all duration-500 hidden lg:block",
          isMegaMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        )}
        onMouseEnter={handleMegaMenuEnter}
        onMouseLeave={handleMegaMenuLeave}
      >
        <div className="bg-background-surface/95 backdrop-blur-xl border-b border-border-slate shadow-2xl shadow-background-primary/50">
          <div className="container mx-auto px-6 py-10">
            <div className="grid grid-cols-12 gap-10">
              {/* Left Column — Phases */}
              <div className="col-span-8">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-6">
                  // Curriculum Phases
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {phases.map((phase) => {
                    const Icon = phase.icon;
                    return (
                      <Link
                        key={phase.name}
                        href={phase.href}
                        className="group flex gap-5 p-4 border border-border-slate/30 bg-background-elevated/20 hover:border-accent hover:bg-background-elevated transition-all duration-500 relative overflow-hidden"
                        onClick={() => setIsMegaMenuOpen(false)}
                      >
                        {/* Hover Reveal Image */}
                        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-all duration-700 scale-110 group-hover:scale-100">
                          <img 
                            src={phase.image} 
                            alt={phase.name} 
                            className="w-full h-full object-cover grayscale"
                          />
                          <div className="absolute inset-0 bg-background-surface/80" />
                        </div>

                        <div className="relative z-10 flex gap-5 w-full">
                          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-background-primary border border-border-slate group-hover:border-accent/40 transition-colors">
                            <span className="absolute -top-1 -left-1 text-2xl font-mono font-black text-accent/5 group-hover:text-accent/10 transition-colors">
                              {phase.number}
                            </span>
                            <Icon className="w-5 h-5 text-accent opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">
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
                            <p className="text-[9px] text-text-tertiary font-mono uppercase tracking-widest mt-1">
                              {phase.subtitle}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                                <Play className="w-2.5 h-2.5" /> {phase.modules}
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
                  // Quick Access
                </p>
                <div className="flex-grow space-y-4">
                  <Link
                    href="/learn"
                    className="block p-6 bg-background-elevated border border-border-slate hover:border-accent transition-all group"
                    onClick={() => setIsMegaMenuOpen(false)}
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
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    <h4 className="text-sm font-display font-bold uppercase text-accent">
                      Free Tier Available
                    </h4>
                    <p className="text-[10px] text-text-tertiary mt-1 font-mono uppercase tracking-widest">
                      Phase 1 is completely free. No card required.
                    </p>
                  </Link>
                </div>
              </div>
            </div>
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
        <div className="flex flex-col h-full pt-28 px-6 pb-12">
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
