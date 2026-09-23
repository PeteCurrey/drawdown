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
  HelpCircle,
  SlidersHorizontal
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
      { name: "Position Size Calculator", desc: "Exact lot sizing, invalidation distance & cash risk", href: "/tools/position-size-calculator", icon: Calculator, badge: "FREE" },
      { name: "Drawdown Recovery", desc: "Loss asymmetry & break-even trades model", href: "/tools/drawdown-recovery-calculator", icon: Zap, badge: "FREE" },
      { name: "Pip Value Calculator", desc: "Multi-currency pip & point values across tiers", href: "/tools/pip-value-calculator", icon: Calculator, badge: "FREE" },
      { name: "Forex Market Hours", desc: "Live session clock with London/NY overlap radar", href: "/tools/forex-market-hours", icon: Newspaper, badge: "LIVE" },
      { name: "Risk of Ruin Calculator", desc: "Statistical probability of account loss & EV", href: "/tools/risk-of-ruin-calculator", icon: LineChart, badge: "FREE" },
      { name: "Plan My Trade", desc: "Interactive pre-trade sizing & discipline validation", href: "/dashboard/run-my-trade", icon: Zap, badge: "CORE" },
      { name: "Signal Centre", desc: "AI consensus signals — Claude + GPT-4o + Grok", href: "/signal-centre", icon: Zap, badge: "AI" },
      { name: "AI Trade Journal", desc: "Upload CSV logs to extract emotional profiles", href: "/tools/ai-trade-journal", icon: BookOpen },
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
  },
  markets: {
    links: [
      { name: "Market Screener", desc: "Live cross-asset scanner with RSI momentum & MSS bias", href: "/markets/screener", icon: SlidersHorizontal, badge: "LIVE" },
      { name: "Market Overview", desc: "Command center for global financial assets", href: "/markets", icon: Globe },
      { name: "Market Pulse", desc: "Real-time ticker stream and session sentiment", href: "/markets/pulse", icon: Activity, badge: "PULSE" },
      { name: "Forex Hub", desc: "Majors and crosses with institutional levels", href: "/markets/forex", icon: TrendingUp },
      { name: "Commodities Hub", desc: "Gold, Silver, WTI Crude Oil & Nat Gas", href: "/markets/commodities", icon: Zap },
      { name: "Indices Hub", desc: "US500, NAS100, UK100, GER40 & JPN225", href: "/markets/indices", icon: LineChart },
      { name: "Crypto Hub", desc: "24/7 digital asset flow and Bitcoin dominance", href: "/markets/crypto", icon: ShieldCheck },
    ],
    featured: {
      image: "/images/tools/ai-market-scanner.png",
      badge: "LIVE SCANNER",
      title: "Market Screener",
      desc: "Scan 32+ global financial assets with real-time prices, 24h performance, RSI momentum, and Market Structure Shift bias.",
      href: "/markets/screener"
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
  },
  markets: {
    light: "#16213E", // Signature Drawdown navy
    dark: "#C8F135",  // High-contrast neon lime for dark markets pages
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

  const [activeMenu, setActiveMenu] = useState<"curriculum" | "tools" | "brokers" | "propFirms" | "markets" | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Dynamic theme detection for black-background pages
  const normalizedPathname = pathname ? pathname.replace(/^\/(au|us|sg|hk)/, "") : "";
  const isDarkPage = (
    normalizedPathname === "/markets" || 
    (normalizedPathname.startsWith("/markets/") &&
     !normalizedPathname.startsWith("/markets/analysis") &&
     !normalizedPathname.startsWith("/markets/pulse") &&
     !normalizedPathname.startsWith("/markets/screener")) ||
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

  const handleMouseEnter = (menu: "curriculum" | "tools" | "brokers" | "propFirms" | "markets") => {
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

  const isDarkMarketsHeader = (
    normalizedPathname === "/markets" ||
    normalizedPathname === "/markets/" ||
    normalizedPathname === "/markets/crypto" ||
    normalizedPathname === "/markets/crypto/" ||
    normalizedPathname === "/markets/indices" ||
    normalizedPathname === "/markets/indices/" ||
    normalizedPathname === "/markets/forex" ||
    normalizedPathname === "/markets/forex/" ||
    normalizedPathname === "/markets/commodities" ||
    normalizedPathname === "/markets/commodities/"
  );
  const hasTopTicker = normalizedPathname === "/markets" || normalizedPathname === "/markets/";

  // Contrast-safe colors
  const activeColor = isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--accent)";
  const inactiveColor = isDarkMarketsHeader ? "rgba(255, 255, 255, 0.75)" : isDarkPage ? "var(--text-secondary)" : "var(--text-secondary)";
  const hoverColor = isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--text-primary)";
  const headerBg = isDarkMarketsHeader
    ? "rgba(10, 10, 10, 0.95)"
    : (isScrolled || isMobileMenuOpen)
    ? (isDarkPage ? "rgba(11, 14, 18, 0.85)" : "rgba(255, 255, 255, 0.85)") 
    : "transparent";
  const borderColor = isDarkMarketsHeader
    ? "rgba(255, 255, 255, 0.1)"
    : isScrolled 
    ? "var(--border-subtle)" 
    : "transparent";

  return (
    <header
      className={cn(
        "fixed left-0 w-full z-[200] h-[58px] flex items-center select-none transition-all duration-200",
        hasTopTicker ? "top-8 border-b" : "top-0",
        !hasTopTicker && (isDarkMarketsHeader || isScrolled ? "border-b shadow-[0_1px_3px_rgba(0,0,0,0.02)]" : "border-b-0")
      )}
      style={{
        backgroundColor: headerBg,
        borderColor: borderColor,
        backdropFilter: isDarkMarketsHeader || isScrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: isDarkMarketsHeader || isScrolled ? "blur(16px)" : "none",
      }}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full relative">
        <Link
          href={region === "uk" ? "/" : `/${region}`}
          onMouseEnter={() => setActiveMenu(null)}
          className="font-display text-[22px] font-semibold tracking-[-0.02em] transition-opacity hover:opacity-80 outline-none focus-visible:outline-none"
          style={{ color: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--text-primary)" }}
        >
          Drawdown
        </Link>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navLinks.map((link) => {
            const isMegaMenu = ["Curriculum", "Tools", "Brokers", "Prop Firms", "Markets"].includes(link.name);
            const menuKey = (
              link.name === "Prop Firms" ? "propFirms" : link.name.toLowerCase()
            ) as "curriculum" | "tools" | "brokers" | "propFirms" | "markets";
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
                    className="text-[14px] font-medium font-sans flex items-center gap-1.5 transition-colors duration-150 h-full outline-none focus-visible:outline-none"
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
                className="text-[14px] font-medium font-sans h-full flex items-center transition-colors duration-150 outline-none focus-visible:outline-none"
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

        <div className="hidden lg:flex items-center gap-3" onMouseEnter={() => setActiveMenu(null)}>
          <Link
            href="/lobby"
            className="px-3.5 py-1.5 text-[13px] font-medium font-sans flex items-center gap-2 border transition-all hover:opacity-90 outline-none focus-visible:outline-none"
            style={{
              color: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--text-primary)",
              borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.2)" : isDarkPage ? "rgba(255, 255, 255, 0.2)" : "var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              backgroundColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.05)" : isDarkPage ? "rgba(255, 255, 255, 0.05)" : "transparent",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            The Lobby
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90 outline-none focus-visible:outline-none"
              style={{ 
                backgroundColor: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--accent)", 
                color: isDarkMarketsHeader ? "#0A0A0A" : isDarkPage ? "var(--text-primary)" : "var(--surface-base)", 
                borderRadius: "var(--radius-md)" 
              }}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90 outline-none focus-visible:outline-none"
              style={{ 
                backgroundColor: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--accent)", 
                color: isDarkMarketsHeader ? "#0A0A0A" : isDarkPage ? "var(--text-primary)" : "var(--surface-base)", 
                borderRadius: "var(--radius-md)" 
              }}
            >
              Login
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 outline-none focus-visible:outline-none"
          style={{ color: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--text-primary)" }}
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
                backgroundColor: isDarkMarketsHeader ? "#0D1117" : "var(--surface-overlay)",
                borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                boxShadow: isDarkMarketsHeader ? "0 20px 40px rgba(0,0,0,0.6)" : "var(--elev-3)",
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
                      className={cn(
                        "group flex gap-4 pl-0 hover:pl-3 border-l-2 border-transparent transition-all duration-300 select-none outline-none focus-visible:outline-none",
                        isDarkMarketsHeader && "hover:bg-white/[0.03] py-1.5 px-2 rounded-r-lg"
                      )}
                      style={{
                        borderLeftColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = accentColor;
                        e.currentTarget.style.paddingLeft = "12px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = "transparent";
                        e.currentTarget.style.paddingLeft = isDarkMarketsHeader ? "8px" : "0px";
                      }}
                      onClick={() => setActiveMenu(null)}
                    >
                      <div 
                        className="mt-0.5 shrink-0 transition-colors duration-300" 
                        style={{ color: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.7)" : inactiveColor }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = accentColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = isDarkMarketsHeader ? "rgba(255, 255, 255, 0.7)" : inactiveColor;
                        }}
                      >
                        <Icon className="w-5 h-5 transition-colors duration-300 group-hover:text-[var(--accent-color)]" style={{ "--accent-color": accentColor } as any} strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span 
                          className="text-[14px] font-semibold font-sans flex items-center gap-2 transition-colors duration-300" 
                          style={{ color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor }}
                        >
                          <span className="group-hover:text-[var(--accent-color)] transition-colors duration-300" style={{ "--accent-color": accentColor } as any}>
                            {link.name}
                          </span>
                          {(link as any).badge && (
                            <span 
                              className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 transition-colors duration-300" 
                              style={{ 
                                background: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--accent-muted)", 
                                color: isDarkMarketsHeader ? "#FFFFFF" : "var(--accent)", 
                                borderRadius: "var(--radius-pill)",
                              }}
                            >
                              {(link as any).badge}
                            </span>
                          )}
                        </span>
                        <span 
                          className={cn(
                            "text-[13px] font-sans transition-colors duration-300",
                            isDarkMarketsHeader ? "group-hover:text-white" : "group-hover:text-gray-900 dark:group-hover:text-white"
                          )} 
                          style={{ color: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.7)" : inactiveColor }}
                        >
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
                  borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)", 
                  borderRadius: "var(--radius-md)",
                  backgroundColor: isDarkMarketsHeader ? "#111418" : "transparent"
                }}
                onMouseEnter={(e) => {
                  const accentColor = isDarkPage 
                    ? menuAccents[activeMenu].dark 
                    : menuAccents[activeMenu].light;
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = isDarkMarketsHeader ? `0 4px 20px ${accentColor}25` : `0 4px 20px ${accentColor}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Link
                  href={getLocalizedHref(megaMenus[activeMenu].featured.href)}
                  className="flex flex-col h-full transition-all duration-300 group outline-none focus-visible:outline-none"
                  onClick={() => setActiveMenu(null)}
                >
                  <div 
                    className="h-[140px] w-full border-b relative overflow-hidden" 
                    style={{ borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)" }}
                  >
                    <img
                      src={megaMenus[activeMenu].featured.image}
                      alt={megaMenus[activeMenu].featured.title}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105",
                        isDarkMarketsHeader ? "opacity-60 group-hover:opacity-85" : isDarkPage ? "opacity-40" : "opacity-85 group-hover:opacity-100"
                      )}
                    />
                  </div>
                  <div 
                    className="p-5 flex flex-col flex-1 transition-colors duration-300" 
                    style={{ backgroundColor: isDarkMarketsHeader ? "#111418" : "var(--surface-raised)" }}
                  >
                    <span 
                      className="text-[10px] font-mono tracking-wider mb-2 font-semibold transition-colors duration-300 group-hover:text-[var(--accent-color)]" 
                      style={{ 
                        color: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.6)" : inactiveColor,
                        "--accent-color": isDarkPage ? menuAccents[activeMenu].dark : menuAccents[activeMenu].light
                      } as any}
                    >
                      {megaMenus[activeMenu].featured.badge}
                    </span>
                    <h4 
                      className="text-[15px] font-semibold font-sans mb-1 transition-colors duration-300" 
                      style={{ color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor }}
                    >
                      {megaMenus[activeMenu].featured.title}
                    </h4>
                    <p 
                      className={cn(
                        "text-[13px] font-sans leading-snug transition-colors duration-300",
                        isDarkMarketsHeader ? "group-hover:text-white/95" : ""
                      )} 
                      style={{ color: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.7)" : inactiveColor }}
                    >
                      {megaMenus[activeMenu].featured.desc}
                    </p>
                    <span 
                      className="mt-auto pt-4 text-[12px] font-mono uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1" 
                      style={{ 
                        color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor,
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
          className={cn(
            "fixed inset-0 z-[199] lg:hidden flex flex-col px-6 py-6 border-t overflow-y-auto",
            hasTopTicker ? "top-[90px]" : "top-[58px]"
          )}
          style={{
            backgroundColor: isDarkMarketsHeader ? "#0A0A0A" : headerBg,
            borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)",
          }}
        >
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isMegaMenu = ["Curriculum", "Tools", "Brokers", "Prop Firms", "Markets"].includes(link.name);
              const menuKey = (
                link.name === "Prop Firms" ? "propFirms" : link.name.toLowerCase()
              ) as "curriculum" | "tools" | "brokers" | "propFirms" | "markets";
              const isExpanded = !!mobileExpanded[link.name];

              if (isMegaMenu) {
                return (
                  <div key={link.name} className="flex flex-col border-b" style={{ borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)" }}>
                    <button
                      onClick={() => toggleMobileExpand(link.name)}
                      className="text-[18px] font-medium py-3 flex items-center justify-between w-full text-left outline-none focus-visible:outline-none"
                      style={{ color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor }}
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
                                  className="flex items-start gap-3 pl-3 border-l outline-none focus-visible:outline-none"
                                  style={{ borderLeftColor: `${accentColor}40` }}
                                >
                                  <div className="mt-0.5" style={{ color: accentColor }}>
                                    <SubIcon className="w-4 h-4" strokeWidth={1.5} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] font-medium font-sans" style={{ color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor }}>
                                      {subLink.name}
                                    </span>
                                    <span className="text-[12px] font-sans" style={{ color: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.7)" : inactiveColor }}>
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
                  className="text-[18px] font-medium py-3 border-b outline-none focus-visible:outline-none"
                  style={{
                    color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor,
                    borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.1)" : "var(--border-subtle)",
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 flex flex-col gap-3 pb-8">
            <Link
              href="/lobby"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 text-[14px] font-medium text-center flex items-center justify-center gap-2 border transition-colors outline-none focus-visible:outline-none"
              style={{
                color: isDarkMarketsHeader ? "#FFFFFF" : hoverColor,
                borderColor: isDarkMarketsHeader ? "rgba(255, 255, 255, 0.2)" : "var(--border-subtle)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              The Lobby
            </Link>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 text-[14px] font-semibold text-center outline-none focus-visible:outline-none"
                style={{
                  backgroundColor: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--accent)",
                  color: isDarkMarketsHeader ? "#0A0A0A" : isDarkPage ? "var(--text-primary)" : "var(--surface-base)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 text-[14px] font-semibold text-center outline-none focus-visible:outline-none"
                style={{
                  backgroundColor: isDarkMarketsHeader ? "#FFFFFF" : isDarkPage ? "var(--surface-base)" : "var(--accent)",
                  color: isDarkMarketsHeader ? "#0A0A0A" : isDarkPage ? "var(--text-primary)" : "var(--surface-base)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
