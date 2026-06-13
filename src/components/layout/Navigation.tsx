"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Navigation() {
  const { region } = useRegion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const navLinks = [
    { name: "Platform", href: `${regionPrefix}/courses` },
    { name: "Markets", href: `${regionPrefix}/markets` },
    { name: "Brokers", href: `${regionPrefix}/brokers` },
    { name: "Prop Firms", href: "/prop-firms" },
    { name: "Pricing", href: `${regionPrefix}/pricing` },
    { name: "Blog", href: `${regionPrefix}/blog` },
  ];

  return (
    <header
      className="fixed top-0 left-0 w-full z-[200] h-[58px] bg-[rgba(255,255,255,0.94)] backdrop-blur-[16px] border-b border-mkt-bd flex items-center select-none"
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          href={region === 'uk' ? "/" : `/${region}`}
          className="text-2xl font-sans font-extrabold tracking-[-0.04em] text-mkt-ink hover:opacity-85 transition-opacity"
          style={{ fontWeight: 800 }}
        >
          Drawdown<span className="text-mkt-grn">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-mkt-i3 hover:text-mkt-ink transition-colors duration-150 font-sans"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-mkt-ink hover:bg-mkt-i2 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors font-sans"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-mkt-i3 hover:text-mkt-ink mr-6 transition-colors font-sans"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-mkt-ink hover:bg-mkt-i2 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors font-sans"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-mkt-i3 hover:text-mkt-ink transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[58px] bg-white z-[199] lg:hidden flex flex-col px-6 py-8 border-t border-mkt-bd">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-mkt-i3 hover:text-mkt-ink py-3 border-b border-neutral-100 flex items-center transition-colors min-h-[48px] font-sans"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-mkt-ink hover:bg-mkt-i2 text-white text-center py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-mkt-i3 hover:text-mkt-ink text-center py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-mkt-ink hover:bg-mkt-i2 text-white text-center py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
