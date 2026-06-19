"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionalLayout";

export function Navigation() {
  const { region, flag } = useRegion();
  const pathname = usePathname();
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

  // Determine if this is a dark markets page (excluding blog/news categories or search pages)
  const normalizedPathname = pathname ? pathname.replace(/^\/(au|us|sg|hk)/, "") : "";
  const isDarkMarketPage = (
    normalizedPathname === "/markets" || 
    (normalizedPathname.startsWith("/markets/") &&
     !normalizedPathname.startsWith("/markets/analysis") &&
     !normalizedPathname.startsWith("/markets/pulse"))
  );

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const navLinks = [
    { name: "Platform", href: `${regionPrefix}/platform` },
    { name: "Learn", href: `${regionPrefix}/courses` },
    { name: "Markets", href: `${regionPrefix}/markets` },
    { name: "Brokers", href: `${regionPrefix}/brokers` },
    { name: "Prop Firms", href: "/prop-firms" },
    { name: "Pricing", href: `${regionPrefix}/pricing` },
    { name: "Blog", href: `${regionPrefix}/blog` },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-[200] h-[58px] flex items-center select-none border-b transition-colors duration-200",
        isDarkMarketPage 
          ? "bg-[#0A0A0A] border-white/5 text-white" 
          : "bg-mkt-bg border-mkt-bd text-mkt-ink"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo + Flag Pill */}
        <div className="flex items-center gap-3">
          <Link
            href={region === 'uk' ? "/" : `/${region}`}
            className={cn(
              "text-2xl font-sans font-extrabold tracking-[-0.04em] hover:opacity-85 transition-opacity",
              isDarkMarketPage ? "text-white" : "text-mkt-ink"
            )}
            style={{ fontWeight: 800 }}
          >
            Drawdown<span className="text-mkt-grn">.</span>
          </Link>
          
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono uppercase tracking-widest font-semibold shrink-0 select-none",
            isDarkMarketPage 
              ? "bg-white/5 border-white/10 text-neutral-300"
              : "bg-neutral-50 border-mkt-bd text-mkt-i3"
          )}>
            <span className={cn("fi", `fi-${flag}`, "w-3 h-2.5 rounded-[1px]")} />
            <span>{region}</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-150 font-sans",
                isDarkMarketPage 
                  ? "text-white/60 hover:text-white" 
                  : "text-mkt-i3 hover:text-mkt-ink"
              )}
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
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-colors font-sans",
                isDarkMarketPage 
                  ? "bg-white hover:bg-white/90 text-black" 
                  : "bg-mkt-ink hover:bg-mkt-i2 text-mkt-bg"
              )}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "text-sm font-medium mr-6 transition-colors font-sans",
                  isDarkMarketPage 
                    ? "text-white/60 hover:text-white" 
                    : "text-mkt-i3 hover:text-mkt-ink"
                )}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={cn(
                  "px-5 py-2 rounded-lg text-sm font-medium transition-colors font-sans",
                  isDarkMarketPage 
                    ? "bg-white hover:bg-white/90 text-black" 
                    : "bg-mkt-ink hover:bg-mkt-i2 text-mkt-bg"
                )}
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            "lg:hidden p-2 transition-colors",
            isDarkMarketPage 
              ? "text-white/60 hover:text-white" 
              : "text-mkt-i3 hover:text-mkt-ink"
          )}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={cn(
            "fixed inset-0 top-[58px] z-[199] lg:hidden flex flex-col px-6 py-8 border-t",
            isDarkMarketPage 
              ? "bg-[#0A0A0A] border-white/5" 
              : "bg-mkt-bg border-mkt-bd"
          )}
        >
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium py-3 border-b flex items-center transition-colors min-h-[48px] font-sans",
                  isDarkMarketPage 
                    ? "text-white/80 hover:text-white border-white/5" 
                    : "text-mkt-i3 hover:text-mkt-ink border-neutral-100"
                )}
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
                className={cn(
                  "text-center py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans",
                  isDarkMarketPage 
                    ? "bg-white hover:bg-white/90 text-black" 
                    : "bg-mkt-ink hover:bg-mkt-i2 text-mkt-bg"
                )}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-center py-3 text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans",
                    isDarkMarketPage 
                      ? "text-white/60 hover:text-white" 
                      : "text-mkt-i3 hover:text-mkt-ink"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-center py-3 rounded-lg text-sm font-medium transition-colors min-h-[48px] flex items-center justify-center font-sans",
                    isDarkMarketPage 
                      ? "bg-white hover:bg-white/90 text-black" 
                      : "bg-mkt-ink hover:bg-mkt-i2 text-mkt-bg"
                  )}
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
