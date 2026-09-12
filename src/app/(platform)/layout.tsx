"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Library, 
  BookOpen,
  Video, 
  Wrench, 
  Users, 
  UserCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Brain,
  Share2,
  ScanSearch,
  FileText,
  Calculator,
  Code,
  ShieldCheck,
  Terminal,
  Settings,
  Calendar,
  Bell,
  Newspaper,
  Building2,
  Trophy,
  CreditCard,
  Menu,
  Zap,
  Lock,
  Wallet,
  Gauge,
  Target,
  Sparkles,
  Cpu,
  Award,
  ClipboardCheck,
  PenLine,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  CheckSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { TierGate } from "@/components/dashboard/TierGate";
import { hasAccess, type SubscriptionTier } from "@/lib/tier-access";

// ─── Primary Workflow Navigation (The 7-stage OS) ─────────────────────────────
const workflowNavLinks = [
  { name: "Today",         href: "/dashboard",                    icon: LayoutDashboard },
  { name: "Prepare",      href: "/dashboard/prepare",             icon: ClipboardCheck },
  { name: "Plan",         href: "/dashboard/plan",                icon: PenLine },
  { name: "Journal",      href: "/dashboard/record",              icon: FileText },
  { name: "Review",       href: "/dashboard/review",              icon: CheckSquare },
  { name: "Improve",      href: "/dashboard/improve",             icon: TrendingUp },
  { name: "Library",      href: "/dashboard/learn",               icon: Library },
];

// ─── Secondary Tool & Intelligence Navigation ─────────────────────────────────
const toolNavLinks = [
  { name: "Markets",          href: "/dashboard/market-intelligence",      icon: Brain },
  { name: "The Wire",         href: "/dashboard/the-wire",                 icon: Newspaper, badge: "NEW" },
  { name: "Signal Centre",    href: "/dashboard/signal-centre",            icon: Zap },
  { name: "Risk Calculator",  href: "/dashboard/tools/position-sizer",     icon: Calculator },
  { name: "Backtester",       href: "/dashboard/tools/backtester",         icon: Code },
  { name: "Scanner",          href: "/dashboard/tools/technical-scanner",  icon: ScanSearch },
  { name: "Funded Accounts",  href: "/dashboard/accounts",                 icon: Wallet },
  { name: "Brokers",          href: "/brokers",                            icon: Building2 },
  { name: "Prop Firms",       href: "/prop-firms",                         icon: Trophy },
  { name: "Community",        href: "/dashboard/community",                icon: Users },
  { name: "Weekly Breakdowns",href: "/dashboard/breakdowns",               icon: Video },
  { name: "Live Events",      href: "/dashboard/events",                   icon: Calendar },
  { name: "Mentorship",       href: "/dashboard/mentorship",               icon: UserCircle },
  { name: "Psychology Coach", href: "/dashboard/coach",                    icon: Sparkles },
  { name: "Curriculum",       href: "/dashboard/curriculum",               icon: BookOpen },
  { name: "Downloads",        href: "/dashboard/downloads",                icon: BookOpen },
  { name: "Market Call",      href: "/dashboard/market-call",              icon: Award, badge: "FREE" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeSignalCount, setActiveSignalCount] = useState<number | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(null);
  
  const pathname  = usePathname();
  const supabase  = createClient();

  useEffect(() => {
    async function fetchSignalCount() {
      try {
        const { count, error } = await supabase
          .from("signals")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);
        if (!error && count !== null) {
          setActiveSignalCount(count);
        }
      } catch (e) {
        console.error("Error fetching signal count:", e);
      }
    }

    fetchSignalCount();
    const interval = setInterval(fetchSignalCount, 60_000);
    return () => clearInterval(interval);
  }, [supabase]);

  useEffect(() => {
    async function checkOnboarding() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");

        // 1. Fetch existing profile
        let { data } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        let currentProfile = data as any;
        const metaTier = user.user_metadata?.subscription_tier;
        const metaRole = user.user_metadata?.role;
        const metaName = user.user_metadata?.full_name || user.user_metadata?.display_name || user.email?.split("@")[0] || "Trader";

        // 2. If profile is missing in DB, auto-provision with default 'free' tier
        if (!currentProfile) {
          const { data: newProfile } = await (supabase as any)
            .from('profiles')
            .upsert({
              id: user.id,
              display_name: metaName,
              full_name: metaName,
              subscription_tier: "free",
              subscription_status: "inactive",
              role: "student",
              email_preferences: {},
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' })
            .select()
            .single();

          currentProfile = newProfile || {
            id: user.id,
            display_name: metaName,
            subscription_tier: "free",
            subscription_status: "inactive",
            role: "student",
          };
        }

        setProfile(currentProfile);
        setSubscriptionTier((currentProfile?.subscription_tier as SubscriptionTier) ?? null);

        // 3. User-scoped localStorage check
        const userStorageKey = `drawdown_onboarded_${user.id}`;
        const locallyOnboardedForUser = localStorage.getItem(userStorageKey);
        const hasOnboardedDb = currentProfile?.email_preferences?.onboarding?.has_onboarded === true;

        if (hasOnboardedDb) {
          localStorage.setItem(userStorageKey, "true");
          localStorage.setItem("drawdown_onboarded", "true");
        } else if (locallyOnboardedForUser !== "true") {
          // Show wizard for every first-time sign in!
          setShowOnboarding(true);
        }
      }
    }
    checkOnboarding();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("drawdown_onboarded");
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getInitials = () => {
    if (profile?.display_name) {
      const parts = profile.display_name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (userEmail) {
      return userEmail.slice(0, 2).toUpperCase();
    }
    return "–";
  };

  // ─── Dark theme whitelist ───────────────────────────────────────────────────
  // RULE: dark theme is EXCLUSIVE to these routes only.
  // Exceptions: none beyond this list.
  // Note: AlgoStrategyBuilder's code-editor pane uses bg-[#0a0a0a] as a named
  //       terminal-pane exception — not a licence to darken any other element
  //       on that route.
  // Primary CTA buttons use bg-[#0A0A0A] / bg-[#181818] platform-wide by
  //       design (brand anchor). --tool-accent governs secondary elements only.
  const isDarkModulePage =
    (pathname.startsWith("/dashboard/curriculum/") && pathname !== "/dashboard/curriculum") ||
    pathname.startsWith("/dashboard/courses/") ||
    pathname.startsWith("/dashboard/investment-centre");

  // Nav link custom layout matching Phase 1 Section 1 and Section 2
  // Locked sidebar link for signal-centre tier users
  function LockedSidebarLink({ icon: Icon, name }: { icon: React.ElementType; name: string }) {
    return (
      <div
        title={`${name} — included in Foundation and above. Upgrade to unlock.`}
        className={cn(
          "w-full h-10 flex items-center rounded-none cursor-not-allowed opacity-35",
          isCollapsed ? "justify-center px-0" : "px-3 gap-3"
        )}
      >
        <Lock className={cn("w-4 h-4 shrink-0", isDarkModulePage ? "text-white/40" : "text-[#555550]")} />
        {!isCollapsed && <span className={cn("text-[13px]", isDarkModulePage ? "text-white/40" : "text-[#555550]")}>{name}</span>}
      </div>
    );
  }

  // Nav link
  function SidebarLink({ href, icon: Icon, name, badge }: { href: string; icon: React.ElementType; name: string; badge?: string }) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    const displayBadge = name === "Signal Centre" 
      ? (activeSignalCount !== null && activeSignalCount > 0 ? String(activeSignalCount) : undefined) 
      : badge;

    return (
      <Link
        href={href}
        className={cn(
          "w-full h-9 flex items-center transition-all duration-150 relative group rounded-md text-[13px]",
          isCollapsed ? "justify-center px-0" : "px-3 gap-2.5",
          isActive 
            ? isDarkModulePage
              ? "bg-[#C8F135]/15 text-white font-semibold border-l-[3px] border-[#C8F135]"
              : "bg-[#FFF4EC] text-[#1A1A1A] font-semibold border-l-[3px] border-[#F9771D]" 
            : isDarkModulePage
              ? "text-white/60 hover:text-white hover:bg-white/5"
              : "text-[#555550] hover:text-[#1A1A1A] hover:bg-[#F0EEE9]/70"
        )}
      >
        <div className="relative">
          <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? (isDarkModulePage ? "text-[#C8F135]" : "text-[#F9771D]") : (isDarkModulePage ? "text-white/50 group-hover:text-white" : "text-[#888882] group-hover:text-[#1A1A1A]"))} />
          {isCollapsed && displayBadge && (
            <span className={cn("absolute -top-1 -right-1 w-2 h-2 rounded-full", isDarkModulePage ? "bg-[#C8F135]" : "bg-[#F9771D]")} />
          )}
        </div>
        {!isCollapsed && <span className="font-medium truncate">{name}</span>}
        {!isCollapsed && displayBadge && (
          <span className={cn(
            "ml-auto text-[8px] font-semibold tracking-wider px-1.5 py-0.5 rounded",
            isDarkModulePage ? "bg-[#C8F135] text-black font-bold" : "bg-[#FFF4EC] text-[#F9771D] border border-[rgba(249,119,29,0.25)] font-bold"
          )}>
            {displayBadge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className={cn(
      "flex flex-col h-screen font-sans antialiased transition-colors duration-200 platform-container",
      isDarkModulePage ? "bg-[#0a0a0a] text-white dark-mode-page" : "bg-[#F7F7F5] text-[#1A1A1A]"
    )}>
      {showOnboarding && profile && (
        <OnboardingWizard 
          userProfile={profile} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {/* Top Navigation Bar */}
      <header className={cn(
        "sticky top-0 z-50 h-13 shrink-0 flex items-center justify-between px-5 transition-colors duration-200",
        isDarkModulePage 
          ? "bg-[#0a0a0a] border-b border-white/10 text-white" 
          : "bg-[#FAFAF9] border-b border-[#E8E6E1] text-[#1A1A1A]"
      )}>
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className={cn("w-5 h-5 transition-colors", isDarkModulePage ? "fill-[#C8F135]" : "fill-[#F9771D]")} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3zm0 18.5c-3.3-.9-6-4.5-6-8.5V6.3l6-2.2 6 2.2V12c0 4-2.7 7.6-6 8.5z" />
          </svg>
          <span className={cn("font-display font-bold text-sm tracking-tight", isDarkModulePage ? "text-white" : "text-[#1A1A1A]")}>
            Drawdown<sup className={cn("text-[9px] font-normal ml-0.5", isDarkModulePage ? "text-white/40" : "text-[#888882]")}>.uk</sup>
          </span>
        </div>

        {/* Center: Workflow stage tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#F0EEE9]/60 p-1 rounded-lg border border-[#E8E6E1]/50">
          {[
            { label: "Today",   href: "/dashboard" },
            { label: "Prepare", href: "/dashboard/prepare" },
            { label: "Plan",    href: "/dashboard/plan" },
            { label: "Journal", href: "/dashboard/record" },
            { label: "Review",  href: "/dashboard/review" },
            { label: "Improve", href: "/dashboard/improve" },
          ].map(tab => {
            const isTabActive = pathname === tab.href || (tab.href !== "/dashboard" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-all duration-150",
                  isTabActive 
                    ? isDarkModulePage
                      ? "bg-[#C8F135] text-black font-bold"
                      : "bg-white text-[#1A1A1A] font-semibold shadow-xs border border-[#E8E6E1]" 
                    : isDarkModulePage
                      ? "text-white/60 hover:bg-white/10 hover:text-white"
                      : "text-[#555550] hover:text-[#1A1A1A] hover:bg-white/50"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "hidden md:flex items-center gap-2 pr-2.5 text-xs font-medium",
            isDarkModulePage ? "border-r border-white/10 text-white/70" : "border-r border-[#E8E6E1] text-[#555550]"
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isDarkModulePage ? "bg-[#C8F135]" : "bg-[#18B880]")} />
            <span className="text-[11px] font-medium text-[#888882]">Signals</span>
          </div>

          <Link href="/dashboard/the-wire" className={cn("p-1.5 transition-colors rounded-md relative", isDarkModulePage ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-[#F0EEE9] text-[#555550] hover:text-[#1A1A1A]")}>
            <Bell className="w-4 h-4" />
            <span className={cn("absolute top-1 right-1 w-1.5 h-1.5 rounded-full", isDarkModulePage ? "bg-[#C8F135]" : "bg-[#F9771D]")} />
          </Link>

          <Link href="/dashboard/profile" className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold font-mono transition-colors", isDarkModulePage ? "bg-[#C8F135] text-black" : "bg-[#1A1A1A] text-white")}>
            {getInitials()}
          </Link>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn("md:hidden p-1.5 transition-colors rounded-md", isDarkModulePage ? "hover:bg-white/10 text-white" : "hover:bg-[#F0EEE9] text-[#1A1A1A]")}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main shell container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside 
          className={cn(
            "hidden md:flex flex-col transition-all duration-300 z-30 shrink-0",
            isDarkModulePage 
              ? "bg-[#0d0d0d] border-r border-white/10 text-white" 
              : "bg-[#FAFAF9] border-r border-[#E8E6E1] text-[#1A1A1A]",
            isCollapsed ? "w-14" : "w-[220px]"
          )}
        >
          {/* Toggle button */}
          <div className="p-3 flex justify-end">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("p-1 transition-colors rounded-md", isDarkModulePage ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-[#F0EEE9] text-[#888882] hover:text-[#1A1A1A]")}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Section 1: Workflow navigation (primary OS stages) */}
          <div className="flex-1 overflow-y-auto py-2" data-lenis-prevent>
            
            {/* Workflow group label */}
            {!isCollapsed && (
              <div className={cn(
                "px-3 mb-1.5 text-[10px] uppercase tracking-[0.08em] font-semibold",
                isDarkModulePage ? "text-white/30" : "text-[#888882]"
              )}>
                Workflow
              </div>
            )}

            <div className="space-y-0.5 px-2">
              {workflowNavLinks.map(link => {
                const isSignalCentreOnly = subscriptionTier === 'signal-centre';
                if (isSignalCentreOnly && link.href !== '/dashboard') {
                  return <LockedSidebarLink key={link.href} icon={link.icon} name={link.name} />;
                }
                return <SidebarLink key={link.href} {...link} />;
              })}
            </div>

            {/* Divider */}
            <div className={cn("my-3 border-t", isDarkModulePage ? "border-white/10" : "border-[#E8E6E1]")} />

            {/* Tools & Intelligence group label */}
            {!isCollapsed && (
              <div className={cn(
                "px-3 mb-1.5 text-[10px] uppercase tracking-[0.08em] font-semibold",
                isDarkModulePage ? "text-white/30" : "text-[#888882]"
              )}>
                Resources
              </div>
            )}

            <div className="space-y-0.5 px-2">
              {toolNavLinks.map(link => {
                const isSignalCentreOnly = subscriptionTier === 'signal-centre';
                const isSignalCentreLink = link.href === '/dashboard/signal-centre';
                if (isSignalCentreOnly && !isSignalCentreLink) {
                  return <LockedSidebarLink key={link.href} icon={link.icon} name={link.name} />;
                }
                return <SidebarLink key={link.href} {...link} />;
              })}
            </div>
          </div>

          {/* Bottom links: profile summary / billing */}
          <div className={cn("border-t p-2 space-y-1", isDarkModulePage ? "border-white/10" : "border-[#E8E6E1]")}>
            <SidebarLink href="/dashboard/profile" icon={CreditCard} name="Billing" />
            <SidebarLink href="/dashboard/profile" icon={Settings} name="Settings" />
            
            {/* User profile summary widget */}
            {!isCollapsed && (
              <div className={cn("p-2.5 flex items-center gap-2.5 mt-2 rounded-lg border transition-colors", isDarkModulePage ? "bg-white/5 border-white/10 text-white" : "bg-white border-[#E8E6E1] text-[#1A1A1A] shadow-xs")}>
                <div className={cn("w-7 h-7 rounded-full text-[10px] flex items-center justify-center font-bold font-mono", isDarkModulePage ? "bg-[#C8F135] text-black" : "bg-[#1A1A1A] text-white")}>
                  {getInitials()}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold truncate leading-tight">{profile?.display_name || "Trader"}</p>
                  <span className={cn("text-[8px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded inline-block mt-0.5", isDarkModulePage ? "bg-[#C8F135] text-black font-bold" : "bg-[#FFF4EC] text-[#F9771D] border border-[rgba(249,119,29,0.25)]")}>
                    {profile?.subscription_tier?.toUpperCase() || "FREE"}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className={cn("ml-auto p-1.5 transition-colors rounded-md", isDarkModulePage ? "hover:bg-red-500/20 text-white/50 hover:text-red-400" : "hover:bg-[#FDF2F2] text-[#888882] hover:text-[#CE6969]")}
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-[#181818]/95 z-40 md:hidden flex flex-col p-6 animate-in fade-in duration-200">
            <nav className="flex-1 overflow-y-auto space-y-2 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">Workflow</p>
              {workflowNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <link.icon className="w-5 h-5 text-[#8A8A85]" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="border-t border-[#333330] my-4" />
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2">Resources</p>
              {toolNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-md hover:bg-white/10 text-sm font-medium"
                >
                  <link.icon className="w-5 h-5 text-[#8A8A85]" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#333330] flex items-center justify-between">
              <span className="text-xs text-[#8A8A85]">{profile?.display_name || "Trader"}</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-[#CE6969] font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={cn("flex-1 overflow-y-auto min-w-0 pb-16 md:pb-0 transition-colors duration-200", isDarkModulePage ? "bg-[#0a0a0a] text-white" : "bg-[#F7F7F5] text-[#1A1A1A]")} data-lenis-prevent>
          <main className="p-6 md:p-8 select-text max-w-[1540px] mx-auto">
            {(() => {
              if (subscriptionTier === 'signal-centre') {
                const lockedPaths = [
                  '/dashboard/curriculum',
                  '/dashboard/journal',
                  '/dashboard/tools',
                  '/dashboard/community',
                  '/dashboard/market-intelligence',
                ];
                const isLocked = lockedPaths.some(p => pathname.startsWith(p));
                if (isLocked) {
                  return (
                    <TierGate
                      requiredTier="foundation"
                      currentTier={subscriptionTier}
                      featureName={pathname.split('/').pop()?.replace(/-/g, ' ')}
                    />
                  );
                }
              }
              return children;
            })()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar (≤768px viewport) */}
      <div className={cn("md:hidden fixed bottom-0 left-0 right-0 h-14 flex items-center justify-around z-50 border-t transition-colors", isDarkModulePage ? "bg-[#0d0d0d] border-white/10 text-white" : "bg-[#FAFAF9] border-[#E8E6E1] text-[#1A1A1A]")}>
        {[
          { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { label: "Markets", href: "/dashboard/market-intelligence", icon: Brain },
          { label: "Curriculum", href: "/dashboard/curriculum", icon: Library },
          { label: "Tools", href: "/dashboard/tools", icon: Wrench },
          { label: "Settings", href: "/dashboard/profile", icon: Settings },
        ].map(tab => {
          const isTabActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-colors",
                isTabActive 
                  ? (isDarkModulePage ? "text-[#C8F135]" : "text-[#F9771D]") 
                  : (isDarkModulePage ? "text-white/50 hover:text-white" : "text-[#888882] hover:text-[#1A1A1A]")
              )}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] uppercase tracking-tighter">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

