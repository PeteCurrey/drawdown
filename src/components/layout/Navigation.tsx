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
  Terminal,
  Newspaper,
  Award,
  Scale,
  ShieldCheck,
  Globe,
  Zap,
  Scan,
  LineChart,
  Calculator,
  Briefcase,
  GitBranch,
  FileText,
  HelpCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRegion } from "@/components/layout/RegionalLayout";
import { motion, AnimatePresence } from "framer-motion";

const megaMenus = {
  curriculum: {
    links: [
      { name: "Phases 1-2 (Foundation)", desc: "Ground Zero & Chart Reader modules", href: "/courses/phase-1-2", icon: BookOpen },
      { name: "Phases 3-4 (Edge)", desc: "Strategist & Advanced Execution", href: "/courses/phase-3-4", icon: Activity },
      { name: "Phases 5-6 (Mastery)", desc: "System Builder & Portfolio Management", href: "/courses/phase-5-6", icon: TrendingUp },
      { name: "Start Phase 1 Free", desc: "No credit card or registration required", href: "/courses/ground-zero", icon: Sparkles },
      { name: "Deploy Your Algo", desc: "From generated code to live chart.", href: "/courses/deploy-your-algo", icon: Terminal },
      { name: "Institutional Accelerator", desc: "Premium 6-Week Live Cohort (£1,500+)", href: "/institutional-accelerator", icon: Award, badge: "COHORT" },
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
      { name: "Signal Centre", desc: "AI consensus signals — Claude + GPT-4o + Grok", href: "/signal-centre", icon: Zap, badge: "NEW" },
      { name: "AI Trade Journal", desc: "Upload CSV logs to extract emotional profiles", href: "/tools/ai-trade-journal", icon: BookOpen },
      { name: "Risk Calculator", desc: "Kelly allocation relative to drawdown limits", href: "/tools/risk-calculator", icon: Calculator },
      { name: "AI Market Scanner", desc: "Monitors order flow delta across 40+ pairs", href: "/tools/ai-market-scanner", icon: Scan },
      { name: "Strategy Backtester", desc: "Test strategies against years of historical price data", href: "/tools/strategy-backtester", icon: LineChart },
      { name: "Algo Strategy Builder", desc: "Automatically generate Pine Script & Python", href: "/tools/algo-strategy-builder", icon: Terminal },
      { name: "Daily Intelligence Brief", desc: "Pre-market institutional flow breakdowns", href: "/tools/intelligence-hub", icon: Newspaper }
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
      { name: "Best UK Brokers", desc: "Pete's hand-picked regulated selections", href: "/brokers", icon: Award },
      { name: "Compare Brokers", desc: "Head-to-head spreads, fees, and leverage", href: "/compare", icon: Scale },
      { name: "All Brokers List", desc: "Full specifications comparison table", href: "/brokers/all", icon: ShieldCheck },
      { name: "Pepperstone Review", desc: "Deep dive into raw execution and fees", href: "/brokers/pepperstone", icon: TrendingUp },
      { name: "IG Markets Review", desc: "Industry leader for spread betting & CFDs", href: "/brokers/ig-markets", icon: Globe },
      { name: "IC Markets Review", desc: "Top choice for high-volume automated logic", href: "/brokers/ic-markets", icon: Zap }
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
      { name: "Best Prop Firms", desc: "Top-rated funded account evaluations", href: "/prop-firms", icon: Briefcase },
      { name: "Compare Prop Firms", desc: "Head-to-head evaluation rules and fees", href: "/prop-firms/compare", icon: Scale },
      { name: "FTMO Review", desc: "The industry standard evaluation benchmark", href: "/prop-firms/ftmo", icon: TrendingUp },
      { name: "The5ers Review", desc: "Flexible rules and excellent scaling plans", href: "/prop-firms/the5ers", icon: GitBranch },
      { name: "Funding Pips Review", desc: "Low-cost challenges with rapid payouts", href: "/prop-firms/funding-pips", icon: Zap },
      { name: "Prop Survival Kit", desc: "Blueprint to pass and keep funded accounts", href: "/store/prop-survival-kit", icon: FileText },
      { name: "Prop Firm Quiz", desc: "Find the perfect firm for your style", href: "/prop-firms/quiz", icon: HelpCircle }
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

const menuAccents = {
  curriculum: {
    light: "#0F3D8C", // Professional deep institutional blue accent
    dark: "#60A5FA",  // Crisp high-contrast dark-mode sky blue
  },
  tools: {
    light: "#007A78", // Technical algorithmic emerald/teal accent
    dark: "#34D399",  // Vibrant terminal digital green
  },
  brokers: {
    light: "#9A6D00", // Authoritative gold/bronze premium accent
    dark: "#FBBF24",  // Radiant compliance metallic amber gold
  },
  propFirms: {
    light: "#7C3AED", // Royal/premium purple accent
    dark: "#A78BFA",  // Vibrant high-contrast lavender
  }
};

export function Navigation() {
  const { region } = useRegion();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  const [activeMenu, setActiveMenu] = useState<"curriculum" | "tools" | "brokers" | "propFirms" | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Dynamic theme detection for black-background pages
  const normalizedPathname = pathname ? pathname.replace(/^\/(au|us|sg|hk)/, "") : "";
  const isDarkPage = (
    normalizedPathname === "/markets" || 
    (normalizedPathname.startsWith("/markets/") &&
     !normalizedPathname.startsWith("/markets/analysis") &&
     !normalizedPathname.startsWith("/markets/pulse")) ||
    normalizedPathname === "/blog/coffeezilla-alexg-trading-education" ||
    normalizedPathname === "/blog/why-trading-gurus-use-demo-accounts" ||
    normalizedPathname === "/blog/trading-education-business-model" ||
    normalizedPathname === "/store/prop-survival-kit"
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  const regionPrefix = region === "uk" ? "" : `/${region}`;

  const getLocalizedHref = (href: string) => {
    if (!regionPrefix) return href;
    if (href === "/") return regionPrefix;

    const regionalizedPaths = [
      "/pricing",
      "/brokers",
      "/compare",
      "/prop-firms",
      "/how-to",
      "/best",
      "/tools/tradingview"
    ];

    const isRegionalized = regionalizedPaths.some(
      p => href === p || href.startsWith(p + "/")
    );

    if (isRegionalized) {
      return `${regionPrefix}${href}`;
    }
    return href;
  };

  const navLinks = [
    { name: "Curriculum", href: getLocalizedHref("/courses") },
    { name: "Tools", href: getLocalizedHref("/tools") },
    { name: "Brokers", href: getLocalizedHref("/brokers") },
    { name: "Prop Firms", href: getLocalizedHref("/prop-firms") },
    { name: "Markets", href: getLocalizedHref("/markets") },
    { name: "Pricing", href: getLocalizedHref("/pricing") },
    { name: "Blog", href: getLocalizedHref("/blog") },
  ];

  const handleMouseEnter = (menu: "curriculum" | "tools" | "brokers" | "propFirms") => {
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

  const toggleMobileExpand = (name: string) => {
    setMobileExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Contrast-safe colors
  const activeColor = isDarkPage ? "var(--paper-0)" : "var(--signal-navy)";
  const inactiveColor = isDarkPage ? "rgba(255, 255, 255, 0.6)" : "var(--graphite-600)";
  const hoverColor = isDarkPage ? "var(--paper-0)" : "var(--ink-950)";
  const headerBg = isDarkPage ? "var(--ink-950)" : "var(--paper-0)";
  const borderColor = isScrolled 
    ? (isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)") 
    : "transparent";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-[200] h-[58px] flex items-center select-none transition-all duration-150",
        isScrolled ? "border-b" : ""
      )}
      style={{
        backgroundColor: headerBg,
        borderColor: borderColor,
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full relative">
        <Link
          href={region === "uk" ? "/" : `/${region}`}
          onMouseEnter={() => setActiveMenu(null)}
          className="font-display text-[22px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-80"
          style={{ color: isDarkPage ? "var(--paper-0)" : "var(--ink-950)" }}
        >
          Drawdown
        </Link>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isMegaMenu = ["Curriculum", "Tools", "Brokers", "Prop Firms"].includes(link.name);
            const menuKey = (
              link.name === "Prop Firms" ? "propFirms" : link.name.toLowerCase()
            ) as "curriculum" | "tools" | "brokers" | "propFirms";
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));

            if (isMegaMenu) {
              return (
                <div
                  key={link.name}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => handleMouseEnter(menuKey)}
                >
                  <Link
                    href={link.href}
                    onClick={() => setActiveMenu(null)}
                    className="text-[14px] font-medium font-sans flex items-center gap-1.5 transition-colors duration-150 h-full"
                    style={{
                      color: isActive || activeMenu === menuKey ? activeColor : inactiveColor,
                    }}
                  >
                    {link.name}
                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", activeMenu === menuKey && "rotate-180")} />
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className="text-[14px] font-medium font-sans h-full flex items-center transition-colors duration-150"
                style={{ color: isActive ? activeColor : inactiveColor }}
                onMouseEnter={(e) => {
                  setActiveMenu(null);
                  e.currentTarget.style.color = hoverColor;
                }}
                onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? activeColor : inactiveColor)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-4" onMouseEnter={() => setActiveMenu(null)}>
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-[13px] font-medium transition-opacity"
              style={{ 
                backgroundColor: isDarkPage ? "var(--paper-0)" : "var(--signal-navy)", 
                color: isDarkPage ? "var(--ink-950)" : "#FAFAF9", 
                borderRadius: 0 
              }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium transition-colors font-sans"
                style={{ color: inactiveColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = inactiveColor)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-[13px] font-medium transition-opacity hover:opacity-90"
                style={{ 
                  backgroundColor: isDarkPage ? "var(--paper-0)" : "var(--signal-navy)", 
                  color: isDarkPage ? "var(--ink-950)" : "#FAFAF9", 
                  borderRadius: 0 
                }}
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2"
          style={{ color: isDarkPage ? "var(--paper-0)" : "var(--ink-950)" }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>

        {/* Desktop Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 right-0 top-[58px] p-8 grid grid-cols-12 gap-8 z-[190] mx-auto border-x border-b shadow-md"
              style={{
                backgroundColor: headerBg,
                borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)",
                borderRadius: 0,
              }}
              onMouseEnter={() => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
              }}
            >
              {/* Links Grid */}
              <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-6">
                {megaMenus[activeMenu].links.map((link) => {
                  const Icon = link.icon;
                  const finalHref = getLocalizedHref(link.href);

                  // Resolve the active accent color based on theme page mode
                  const accentColor = isDarkPage 
                    ? menuAccents[activeMenu].dark 
                    : menuAccents[activeMenu].light;

                  return (
                    <Link
                      key={link.name}
                      href={finalHref}
                      className="group flex gap-4 pl-0 hover:pl-3 border-l-2 border-transparent transition-all duration-300 select-none"
                      style={{
                        borderLeftColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = accentColor;
                        e.currentTarget.style.paddingLeft = "12px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = "transparent";
                        e.currentTarget.style.paddingLeft = "0px";
                      }}
                      onClick={() => setActiveMenu(null)}
                    >
                      <div 
                        className="mt-0.5 shrink-0 transition-colors duration-300" 
                        style={{ color: inactiveColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = accentColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = inactiveColor;
                        }}
                      >
                        <Icon className="w-5 h-5 transition-colors duration-300 group-hover:text-[var(--accent-color)]" style={{ "--accent-color": accentColor } as any} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span 
                          className="text-[14px] font-semibold font-sans flex items-center gap-2 transition-colors duration-300" 
                          style={{ color: hoverColor }}
                        >
                          <span className="group-hover:text-[var(--accent-color)] transition-colors duration-300" style={{ "--accent-color": accentColor } as any}>
                            {link.name}
                          </span>
                          {(link as any).badge && (
                            <span 
                              className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 transition-colors duration-300 group-hover:bg-[var(--accent-color)] group-hover:text-white" 
                              style={{ 
                                backgroundColor: isDarkPage ? "var(--paper-0)" : "var(--ink-950)", 
                                color: isDarkPage ? "var(--ink-950)" : "var(--paper-0)", 
                                borderRadius: 0,
                                "--accent-color": accentColor
                              } as any}
                            >
                              {(link as any).badge}
                            </span>
                          )}
                        </span>
                        <span className="text-[13px] font-sans transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-white" style={{ color: inactiveColor }}>
                          {link.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Featured Showcase */}
              <div 
                className="col-span-4 flex flex-col h-full border transition-all duration-300" 
                style={{ 
                  borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)", 
                  borderRadius: 0 
                }}
                onMouseEnter={(e) => {
                  const accentColor = isDarkPage 
                    ? menuAccents[activeMenu].dark 
                    : menuAccents[activeMenu].light;
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Link
                  href={getLocalizedHref(megaMenus[activeMenu].featured.href)}
                  className="flex flex-col h-full transition-all duration-300 group"
                  onClick={() => setActiveMenu(null)}
                >
                  <div 
                    className="h-[140px] w-full border-b relative overflow-hidden" 
                    style={{ borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)" }}
                  >
                    <img
                      src={megaMenus[activeMenu].featured.image}
                      alt={megaMenus[activeMenu].featured.title}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105",
                        isDarkPage ? "opacity-40" : "opacity-85 group-hover:opacity-100"
                      )}
                    />
                  </div>
                  <div 
                    className="p-5 flex flex-col flex-1 transition-colors duration-300" 
                    style={{ backgroundColor: isDarkPage ? "rgba(255, 255, 255, 0.03)" : "var(--paper-100)" }}
                  >
                    <span 
                      className="text-[10px] font-mono tracking-wider mb-2 font-semibold transition-colors duration-300 group-hover:text-[var(--accent-color)]" 
                      style={{ 
                        color: inactiveColor,
                        "--accent-color": isDarkPage ? menuAccents[activeMenu].dark : menuAccents[activeMenu].light
                      } as any}
                    >
                      {megaMenus[activeMenu].featured.badge}
                    </span>
                    <h4 className="text-[15px] font-semibold font-sans mb-1" style={{ color: hoverColor }}>
                      {megaMenus[activeMenu].featured.title}
                    </h4>
                    <p className="text-[13px] font-sans leading-snug" style={{ color: inactiveColor }}>
                      {megaMenus[activeMenu].featured.desc}
                    </p>
                    <span 
                      className="mt-auto pt-4 text-[12px] font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1" 
                      style={{ 
                        color: hoverColor,
                      }}
                    >
                      <span className="group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all duration-300" style={{ "--accent-color": isDarkPage ? menuAccents[activeMenu].dark : menuAccents[activeMenu].light } as any}>
                        Explore →
                      </span>
                    </span>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-[58px] z-[199] lg:hidden flex flex-col px-6 py-6 border-t overflow-y-auto"
          style={{
            backgroundColor: headerBg,
            borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isMegaMenu = ["Curriculum", "Tools", "Brokers", "Prop Firms"].includes(link.name);
              const menuKey = (
                link.name === "Prop Firms" ? "propFirms" : link.name.toLowerCase()
              ) as "curriculum" | "tools" | "brokers" | "propFirms";
              const isExpanded = !!mobileExpanded[link.name];

              if (isMegaMenu) {
                return (
                  <div key={link.name} className="flex flex-col border-b" style={{ borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)" }}>
                    <button
                      onClick={() => toggleMobileExpand(link.name)}
                      className="text-[18px] font-medium py-3 flex items-center justify-between w-full text-left"
                      style={{ color: hoverColor }}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", isExpanded && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
              initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-4 pt-2 flex flex-col gap-4">
                            {megaMenus[menuKey].links.map((subLink) => {
                              const SubIcon = subLink.icon;
                              const finalSubHref = getLocalizedHref(subLink.href);

                              const accentColor = isDarkPage 
                                ? menuAccents[menuKey].dark 
                                : menuAccents[menuKey].light;

                              return (
                                <Link
                                  key={subLink.name}
                                  href={finalSubHref}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setMobileExpanded({});
                                  }}
                                  className="flex items-start gap-3 pl-3 border-l"
                                  style={{ borderLeftColor: `${accentColor}40` }}
                                >
                                  <div className="mt-0.5" style={{ color: accentColor }}>
                                    <SubIcon className="w-4 h-4" strokeWidth={1.5} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] font-medium font-sans" style={{ color: hoverColor }}>
                                      {subLink.name}
                                    </span>
                                    <span className="text-[12px] font-sans" style={{ color: inactiveColor }}>
                                      {subLink.desc}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
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
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[18px] font-medium py-3 border-b"
                  style={{
                    color: hoverColor,
                    borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)",
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-col gap-3 pb-8">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 text-[14px] font-medium text-center border"
              style={{
                color: hoverColor,
                borderColor: isDarkPage ? "rgba(255, 255, 255, 0.1)" : "var(--line-200)",
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
                backgroundColor: isDarkPage ? "var(--paper-0)" : "var(--signal-navy)",
                color: isDarkPage ? "var(--ink-950)" : "#FAFAF9",
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
