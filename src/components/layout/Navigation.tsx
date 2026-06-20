"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Activity,
  TrendingUp,
  Sparkles,
  Cpu,
  Calculator,
  Scan,
  LineChart,
  Terminal,
  Newspaper,
  Award,
  Scale,
  ShieldCheck,
  Globe,
  Zap,
  Briefcase,
  GitBranch,
  FileText,
  HelpCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionalLayout";
import { checkIsAdmin } from "@/app/actions/auth-onboarding";
import { motion, AnimatePresence } from "framer-motion";

// Defined statically to keep the component clean
const megaMenus = {
  learn: {
    links: [
      { name: "Phases 1-2 (Foundation)", desc: "Ground Zero & Chart Reader modules", href: "/courses", icon: BookOpen, color: "text-indigo-500 bg-indigo-500/10" },
      { name: "Phases 3-4 (Edge)", desc: "Strategist & Advanced Execution", href: "/courses", icon: Activity, color: "text-emerald-500 bg-emerald-500/10" },
      { name: "Phases 5-6 (Mastery)", desc: "System Builder & Portfolio Management", href: "/courses", icon: TrendingUp, color: "text-rose-500 bg-rose-500/10" },
      { name: "Start Phase 1 Free", desc: "No credit card or registration required", href: "/courses/ground-zero", icon: Sparkles, color: "text-amber-500 bg-amber-500/10" }
    ],
    featured: {
      image: "/images/nav/phase-01.png",
      badge: "FEATURED PHASE",
      title: "Structured Trading Education",
      desc: "Go from complete beginner to fully funded institutional trader. 6 detailed phases with zero hype.",
      href: "/courses"
    }
  },
  tools: {
    links: [
      { name: "AI Trade Journal", desc: "Upload CSV logs to extract emotional profiles", href: "/tools/ai-trade-journal", icon: BookOpen, color: "text-indigo-500 bg-indigo-500/10" },
      { name: "Risk Calculator", desc: "Kelly allocation relative to drawdown limits", href: "/tools/risk-calculator", icon: Calculator, color: "text-emerald-500 bg-emerald-500/10" },
      { name: "AI Market Scanner", desc: "Monitors order flow delta across 40+ pairs", href: "/tools/ai-market-scanner", icon: Scan, color: "text-cyan-500 bg-cyan-500/10" },
      { name: "Strategy Backtester", desc: "Simulate rules on 10 years of tick data", href: "/tools/strategy-backtester", icon: LineChart, color: "text-rose-500 bg-rose-500/10" },
      { name: "Algo Strategy Builder", desc: "Automatically generate Pine Script & Python", href: "/tools/algo-strategy-builder", icon: Terminal, color: "text-violet-500 bg-violet-500/10" },
      { name: "Daily Intelligence Brief", desc: "Pre-market institutional flow breakdowns", href: "/tools/intelligence-hub", icon: Newspaper, color: "text-amber-500 bg-amber-500/10" }
    ],
    featured: {
      image: "/images/tools/ai-market-scanner.png",
      badge: "PROPRIETARY CORE",
      title: "Proprietary AI Suite",
      desc: "6 custom-built trading intelligence tools designed to remove emotional bias and standardise risk.",
      href: "/tools"
    }
  },
  brokers: {
    links: [
      { name: "Best UK Brokers", desc: "Pete's hand-picked regulated selections", href: "/brokers", icon: Award, color: "text-indigo-500 bg-indigo-500/10" },
      { name: "Compare Brokers", desc: "Head-to-head spreads, fees, and leverage", href: "/compare", icon: Scale, color: "text-cyan-500 bg-cyan-500/10" },
      { name: "All Brokers List", desc: "Full specifications comparison table", href: "/brokers/all", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10" },
      { name: "Pepperstone Review", desc: "Deep dive into raw execution and fees", href: "/brokers/pepperstone", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
      { name: "IG Markets Review", desc: "Industry leader for spread betting & CFDs", href: "/brokers/ig-markets", icon: Globe, color: "text-violet-500 bg-violet-500/10" },
      { name: "IC Markets Review", desc: "Top choice for high-volume automated logic", href: "/brokers/ic-markets", icon: Zap, color: "text-rose-500 bg-rose-500/10" }
    ],
    featured: {
      image: "/images/brokers/pepperstone-bg.png",
      badge: "VERIFIED REGULATION",
      title: "Verified Broker Comparisons",
      desc: "Every broker we review is verified directly against official registers. Absolutely zero offshore scams.",
      href: "/brokers"
    }
  },
  propFirms: {
    links: [
      { name: "Best Prop Firms", desc: "Top-rated funded account evaluations", href: "/prop-firms", icon: Briefcase, color: "text-indigo-500 bg-indigo-500/10" },
      { name: "FTMO Review", desc: "The industry standard evaluation benchmark", href: "/prop-firms/ftmo", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
      { name: "The5ers Review", desc: "Flexible rules and excellent scaling plans", href: "/prop-firms/the5ers", icon: GitBranch, color: "text-rose-500 bg-rose-500/10" },
      { name: "Funding Pips Review", desc: "Low-cost challenges with rapid payouts", href: "/prop-firms/funding-pips", icon: Zap, color: "text-cyan-500 bg-cyan-500/10" },
      { name: "Prop Survival Kit", desc: "Blueprint to pass and keep funded accounts", href: "/store/prop-survival-kit", icon: FileText, color: "text-amber-500 bg-amber-500/10" },
      { name: "Prop Firm Quiz", desc: "Find the perfect firm for your style", href: "/prop-firms/quiz", icon: HelpCircle, color: "text-violet-500 bg-violet-500/10" }
    ],
    featured: {
      image: "/images/prop-firms/ftmo-bg.png",
      badge: "FUNDING SYSTEM",
      title: "Prop Evaluation Hub",
      desc: "Honest evaluations, fee breakdowns, and the survival kit blueprint to beat evaluation rules.",
      href: "/prop-firms"
    }
  }
};

export function Navigation() {
  const { region, flag } = useRegion();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const [activeMenu, setActiveMenu] = useState<"learn" | "tools" | "brokers" | "propFirms" | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user?.email) {
        const check = await checkIsAdmin(data.user.email);
        setIsAdmin(check);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        checkIsAdmin(session.user.email).then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

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
    { name: "Tools", href: `${regionPrefix}/tools` },
    { name: "Markets", href: `${regionPrefix}/markets` },
    { name: "Brokers", href: `${regionPrefix}/brokers` },
    { name: "Prop Firms", href: "/prop-firms" },
    { name: "Pricing", href: `${regionPrefix}/pricing` },
    { name: "Blog", href: `${regionPrefix}/blog` },
  ];

  const handleMouseEnter = (menu: "learn" | "tools" | "brokers" | "propFirms") => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleHeaderMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
  };

  const toggleMobileExpand = (name: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-[200] h-[58px] flex items-center select-none border-b transition-colors duration-200",
        isDarkMarketPage 
          ? "bg-[#0A0A0A] border-white/5 text-white" 
          : "bg-mkt-bg border-mkt-bd text-mkt-ink"
      )}
      onMouseEnter={handleHeaderMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center relative h-full">
        {/* Logo + Flag Pill */}
        <div className="flex items-center gap-3">
          <Link
            href={region === 'uk' ? "/" : `/${region}`}
            onMouseEnter={() => setActiveMenu(null)}
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
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 h-full">
          {navLinks.map((link) => {
            const isMegaMenu = ["Learn", "Tools", "Brokers", "Prop Firms"].includes(link.name);
            const menuKey = link.name === "Prop Firms" ? "propFirms" : (link.name.toLowerCase() as "learn" | "tools" | "brokers" | "propFirms");

            if (isMegaMenu) {
              return (
                <div
                  key={link.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(menuKey)}
                >
                  <button
                    className={cn(
                      "text-sm font-medium transition-colors duration-155 font-sans flex items-center gap-1 cursor-pointer h-full border-b-2 border-transparent",
                      activeMenu === menuKey
                        ? (isDarkMarketPage ? "text-[#C8F135] border-[#C8F135]" : "text-mkt-grn border-mkt-grn")
                        : (isDarkMarketPage ? "text-white/60 hover:text-white" : "text-mkt-i3 hover:text-mkt-ink")
                    )}
                  >
                    {link.name}
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      activeMenu === menuKey && "rotate-180"
                    )} />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setActiveMenu(null)}
                className={cn(
                  "text-sm font-medium transition-colors duration-155 font-sans h-full flex items-center border-b-2 border-transparent hover:border-b-2 hover:border-current",
                  isDarkMarketPage 
                    ? "text-white/60 hover:text-white" 
                    : "text-mkt-i3 hover:text-mkt-ink"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div 
          className="hidden lg:flex items-center gap-3"
          onMouseEnter={() => setActiveMenu(null)}
        >
          {user && isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "text-sm font-semibold transition-colors font-sans mr-2",
                isDarkMarketPage ? "text-[#C8F135] hover:text-[#D8F155]" : "text-mkt-grn hover:text-mkt-i2"
              )}
            >
              Control Panel
            </Link>
          )}
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
            "lg:hidden p-2 transition-colors z-[210]",
            isDarkMarketPage 
              ? "text-white/60 hover:text-white" 
              : "text-mkt-i3 hover:text-mkt-ink"
          )}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mega Menu Dropdown (Desktop) */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute left-6 right-6 top-[56px] rounded-b-2xl border-x border-b shadow-2xl p-6 grid grid-cols-12 gap-8 z-[190] backdrop-blur-md transition-colors duration-200 mx-auto max-w-[840px]",
                isDarkMarketPage
                  ? "bg-[#0C0C0D]/95 border-white/5 text-white shadow-black/80"
                  : "bg-white/95 border-mkt-bd text-mkt-ink shadow-neutral-200/50"
              )}
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
              }}
            >
              {/* Left side: Grid of Links (col-span-8) */}
              <div className="col-span-8 grid grid-cols-2 gap-x-6 gap-y-4">
                {megaMenus[activeMenu].links.map((link) => {
                  const Icon = link.icon;
                  const isPropFirmOrStore = link.href.startsWith("/prop-firms") || link.href.startsWith("/store");
                  const finalHref = isPropFirmOrStore ? link.href : `${regionPrefix}${link.href}`;
                  
                  return (
                    <Link
                      key={link.name}
                      href={finalHref}
                      className={cn(
                        "group/link flex gap-3 p-2.5 rounded-xl transition-all duration-200",
                        isDarkMarketPage
                          ? "hover:bg-white/5"
                          : "hover:bg-neutral-50"
                      )}
                      onClick={() => setActiveMenu(null)}
                    >
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", link.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-0.5 justify-center">
                        <span className={cn(
                          "text-sm font-semibold transition-colors font-sans",
                          isDarkMarketPage
                            ? "text-white group-hover/link:text-[#C8F135]"
                            : "text-mkt-ink group-hover/link:text-mkt-grn"
                        )}>
                          {link.name}
                        </span>
                        <span className={cn(
                          "text-xs font-sans",
                          isDarkMarketPage ? "text-neutral-400" : "text-mkt-i3"
                        )}>
                          {link.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Right side: Featured Showcase Card (col-span-4) */}
              <div className="col-span-4 flex">
                <Link
                  href={
                    megaMenus[activeMenu].featured.href.startsWith("/prop-firms") || megaMenus[activeMenu].featured.href.startsWith("/store")
                      ? megaMenus[activeMenu].featured.href
                      : `${regionPrefix}${megaMenus[activeMenu].featured.href}`
                  }
                  className="group/card relative flex flex-col justify-end w-full min-h-[220px] rounded-xl overflow-hidden p-5 border border-mkt-bd/20"
                  onClick={() => setActiveMenu(null)}
                >
                  {/* Background image container */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={megaMenus[activeMenu].featured.image}
                      alt={megaMenus[activeMenu].featured.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-t z-10 transition-opacity duration-300",
                      isDarkMarketPage
                        ? "from-[#0A0A0A]/95 via-[#0A0A0A]/50 to-transparent group-hover/card:from-[#0A0A0A]"
                        : "from-black/90 via-black/40 to-transparent group-hover/card:from-black"
                    )} />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-20 space-y-1.5 text-white">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-[#C8F135] bg-[#C8F135]/10 px-2 py-0.5 rounded border border-[#C8F135]/20 uppercase w-fit block">
                      {megaMenus[activeMenu].featured.badge}
                    </span>
                    <h4 className="text-sm font-semibold leading-tight font-sans tracking-tight">
                      {megaMenus[activeMenu].featured.title}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans font-light">
                      {megaMenus[activeMenu].featured.desc}
                    </p>
                    <span className="text-[10px] font-semibold text-[#C8F135] group-hover/card:translate-x-1 transition-transform inline-flex items-center gap-1 font-mono uppercase tracking-wider mt-1">
                      Explore →
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          <nav className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">
            {navLinks.map((link) => {
              const isMegaMenu = ["Learn", "Tools", "Brokers", "Prop Firms"].includes(link.name);
              const menuKey = link.name === "Prop Firms" ? "propFirms" : (link.name.toLowerCase() as "learn" | "tools" | "brokers" | "propFirms");
              const isExpanded = !!mobileExpanded[link.name];

              if (isMegaMenu) {
                return (
                  <div key={link.name} className="flex flex-col border-b border-neutral-100 dark:border-white/5">
                    <button
                      onClick={() => toggleMobileExpand(link.name)}
                      className={cn(
                        "text-lg font-medium py-3 flex items-center justify-between transition-colors min-h-[48px] font-sans w-full text-left",
                        isDarkMarketPage ? "text-white/80 hover:text-white" : "text-mkt-i3 hover:text-mkt-ink"
                      )}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    </button>
                    
                    {/* Expanded sub-links */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-4 pt-1 flex flex-col gap-3">
                            {megaMenus[menuKey].links.map((subLink) => {
                              const SubIcon = subLink.icon;
                              const isPropFirmOrStore = subLink.href.startsWith("/prop-firms") || subLink.href.startsWith("/store");
                              const finalSubHref = isPropFirmOrStore ? subLink.href : `${regionPrefix}${subLink.href}`;
                              
                              return (
                                <Link
                                  key={subLink.name}
                                  href={finalSubHref}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setMobileExpanded({});
                                  }}
                                  className="flex items-center gap-3 py-1"
                                >
                                  <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", subLink.color)}>
                                    <SubIcon className="w-4 h-4" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={cn(
                                      "text-xs font-bold font-sans",
                                      isDarkMarketPage ? "text-white" : "text-mkt-ink"
                                    )}>
                                      {subLink.name}
                                    </span>
                                    <span className="text-[9px] text-neutral-400 font-sans">
                                      {subLink.desc}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                            
                            {/* Mobile featured showcase card */}
                            <Link
                              href={
                                megaMenus[menuKey].featured.href.startsWith("/prop-firms") || megaMenus[menuKey].featured.href.startsWith("/store")
                                  ? megaMenus[menuKey].featured.href
                                  : `${regionPrefix}${megaMenus[menuKey].featured.href}`
                              }
                              className={cn(
                                "mt-2 group/card relative flex flex-col justify-end w-full min-h-[90px] rounded-xl overflow-hidden p-4 border",
                                isDarkMarketPage ? "border-white/5 bg-white/[0.01]" : "border-neutral-100 bg-neutral-50/50"
                              )}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setMobileExpanded({});
                              }}
                            >
                              <div className="absolute inset-0 z-0">
                                <img
                                  src={megaMenus[menuKey].featured.image}
                                  alt={megaMenus[menuKey].featured.title}
                                  className="w-full h-full object-cover opacity-20"
                                />
                                <div className={cn(
                                  "absolute inset-0 bg-gradient-to-t z-10",
                                  isDarkMarketPage ? "from-black/95 via-black/40 to-transparent" : "from-black/90 via-black/30 to-transparent"
                                )} />
                              </div>
                              <div className="relative z-20 space-y-1 text-white">
                                <span className="text-[7px] font-mono font-bold tracking-widest text-[#C8F135] bg-[#C8F135]/15 px-1.5 py-0.5 rounded border border-[#C8F135]/25 uppercase w-fit block">
                                  {megaMenus[menuKey].featured.badge}
                                </span>
                                <h4 className="text-[11px] font-bold font-sans">
                                  {megaMenus[menuKey].featured.title}
                                </h4>
                                <p className="text-[9px] text-neutral-300 font-sans font-light leading-snug">
                                  {megaMenus[menuKey].featured.desc}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileExpanded({});
                  }}
                  className={cn(
                    "text-lg font-medium py-3 border-b flex items-center transition-colors min-h-[48px] font-sans",
                    isDarkMarketPage 
                      ? "text-white/80 hover:text-white border-white/5" 
                      : "text-mkt-i3 hover:text-mkt-ink border-neutral-100"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons at the bottom of drawer */}
          <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-neutral-100 dark:border-white/5">
            {user && isAdmin && (
              <Link
                href="/admin"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileExpanded({});
                }}
                className="text-center py-3 rounded-lg text-sm font-semibold border border-white/10 text-[#C8F135] min-h-[48px] flex items-center justify-center font-sans"
              >
                Control Panel
              </Link>
            )}
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setMobileExpanded({});
                }}
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileExpanded({});
                  }}
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
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setMobileExpanded({});
                  }}
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
