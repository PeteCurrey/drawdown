"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Navigation() {
  const { region } = useRegion();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, [supabase.auth]);

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  // 6-item primary navigation max per Phase 1 spec
  const navLinks = [
    { name: "Curriculum", href: `${regionPrefix}/courses` },
    { name: "Tools", href: `${regionPrefix}/tools` },
    { name: "Brokers", href: `${regionPrefix}/brokers` },
    { name: "Markets", href: `${regionPrefix}/markets` },
    { name: "Pricing", href: `${regionPrefix}/pricing` },
    { name: "Blog", href: `${regionPrefix}/blog` },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-[200] h-[58px] flex items-center select-none transition-all duration-150",
        isScrolled ? "border-b" : ""
      )}
      style={{
        backgroundColor: "var(--paper-0)",
        borderColor: isScrolled ? "var(--line-200)" : "transparent",
      }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full">

        {/* Logo */}
        <Link
          href={region === "uk" ? "/" : `/${region}`}
          className="font-display text-[22px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-80"
          style={{ color: "var(--ink-950)" }}
        >
          Drawdown
        </Link>

        {/* Desktop Nav — 6 items max */}
        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-[14px] font-medium font-sans transition-colors duration-150"
                style={{
                  color: isActive ? "var(--signal-navy)" : "var(--graphite-600)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-950)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive ? "var(--signal-navy)" : "var(--graphite-600)")
                }
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons — zero border-radius */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-[13px] font-medium transition-opacity"
              style={{
                backgroundColor: "var(--signal-navy)",
                color: "#FAFAF9",
                borderRadius: 0,
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium transition-colors font-sans"
                style={{ color: "var(--graphite-600)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-950)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--graphite-600)")}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-[13px] font-medium transition-opacity"
                style={{
                  backgroundColor: "var(--signal-navy)",
                  color: "#FAFAF9",
                  borderRadius: 0,
                }}
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2"
          style={{ color: "var(--ink-950)" }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[58px] z-[199] lg:hidden flex flex-col px-6 py-6 border-t"
          style={{
            backgroundColor: "var(--paper-0)",
            borderColor: "var(--line-200)",
          }}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[18px] font-medium py-2 border-b"
                style={{
                  color: "var(--ink-950)",
                  borderColor: "var(--line-200)",
                }}
              >
                {link.name}
              </Link>
            ))}
            {/* Reachability for Prop Firms in mobile drawer */}
            <Link
              href="/prop-firms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[18px] font-medium py-2 border-b"
              style={{
                color: "var(--graphite-600)",
                borderColor: "var(--line-200)",
              }}
            >
              Prop Firms
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-3 pt-6">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 text-[14px] font-medium text-center border"
              style={{
                color: "var(--ink-950)",
                borderColor: "var(--line-200)",
                borderRadius: 0,
              }}
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 text-[14px] font-medium text-center"
              style={{
                backgroundColor: "var(--signal-navy)",
                color: "#FAFAF9",
                borderRadius: 0,
              }}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
