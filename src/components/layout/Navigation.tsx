"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-center gap-1 text-sm font-medium uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.name}
                {link.hasMegaMenu && (
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                )}
              </Link>
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
