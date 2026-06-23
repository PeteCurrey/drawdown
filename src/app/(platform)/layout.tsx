"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Library, 
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
  Bell,
  Newspaper,
  Building2,
  Trophy,
  CreditCard,
  Menu,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

// ─── Main Navigation (Top section 1) ──────────────────────────────────────────
const mainNavLinks = [
  { name: "Overview",            href: "/dashboard",                           icon: LayoutDashboard },
  { name: "Market Intelligence",  href: "/dashboard/market-intelligence",        icon: Brain },
  { name: "Curriculum",          href: "/dashboard/curriculum",                icon: Library },
  { name: "AI Trade Journal",    href: "/dashboard/journal",                   icon: FileText },
  { name: "Risk Calculator",     href: "/dashboard/tools/position-sizer",      icon: Calculator },
  { name: "Market Scanner",      href: "/dashboard/tools/technical-scanner",   icon: ScanSearch },
  { name: "Strategy Backtester",  href: "/dashboard/tools/backtester",          icon: Code }, // Representing flask/backtester
  { name: "Algo Builder",        href: "/dashboard/tools/algo-builder",        icon: Terminal },
  { name: "Signal Centre",       href: "/dashboard/signal-centre",             icon: Zap },
];

// ─── Platform Navigation (Section 2) ─────────────────────────────────────────
const platformLinks = [
  { name: "The Wire",     href: "/dashboard/the-wire",  icon: Newspaper, badge: "NEW" },
  { name: "Brokers",      href: "/brokers",             icon: Building2 },
  { name: "Prop Firms",   href: "/prop-firms",          icon: Trophy },
  { name: "Community",    href: "/dashboard/community", icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const pathname  = usePathname();
  const supabase  = createClient();

  useEffect(() => {
    async function checkOnboarding() {
      const locallyOnboarded = localStorage.getItem("drawdown_onboarded");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        const profile = data as any;
        setProfile(profile);
        
        if (locallyOnboarded === "true") {
          return;
        }
        
        if (profile && !profile.has_onboarded) {
          setShowOnboarding(true);
        } else if (profile?.has_onboarded) {
          localStorage.setItem("drawdown_onboarded", "true");
        }
      }
    }
    checkOnboarding();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Nav link custom layout matching Phase 1 Section 1 and Section 2
  function SidebarLink({ href, icon: Icon, name, badge }: { href: string; icon: React.ElementType; name: string; badge?: string }) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={cn(
          "w-full h-10 flex items-center transition-all duration-150 rounded-none relative",
          isCollapsed ? "justify-center px-0" : "px-3 gap-3",
          isActive 
            ? "bg-[#1A1A1A]/8 text-[#1A1A1A] font-medium border-l-[3px] border-[#F9771D]" 
            : "text-[#555550] hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
        )}
      >
        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#1A1A1A]" : "text-[#555550]")} />
        {!isCollapsed && <span className="text-[13px]">{name}</span>}
        {!isCollapsed && badge && (
          <span className="ml-auto text-[8px] font-bold font-mono tracking-wider bg-[#F9771D] text-white px-1.5 py-0.5 rounded-none">
            {badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-[#1A1A1A] font-sans antialiased">
      {/* Background SVG Noise Filter Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[99]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {showOnboarding && profile && (
        <OnboardingWizard 
          userProfile={profile} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {/* Top Navigation Bar — sticky so it stays in flow, no fixed offset needed */}
      <header className="sticky top-0 z-50 h-14 shrink-0 bg-white border-b border-[#DEDDD8] flex items-center justify-between px-6">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          {/* simple geometric shield outline with orange fill */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#F9771D]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3zm0 18.5c-3.3-.9-6-4.5-6-8.5V6.3l6-2.2 6 2.2V12c0 4-2.7 7.6-6 8.5z" />
          </svg>
          <span className="font-display font-semibold text-base tracking-tight text-[#1A1A1A]">
            Drawdown<sup className="text-[9px] font-normal text-[#555550] ml-0.5">.uk</sup>
          </span>
        </div>

        {/* Center: Tabs */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Overview", href: "/dashboard" },
            { label: "Market Intelligence", href: "/dashboard/market-intelligence" },
            { label: "Signal Centre", href: "/dashboard/signal-centre" },
            { label: "The Wire", href: "/dashboard/the-wire" },
          ].map(tab => {
            const isTabActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-[4px] transition-all duration-150",
                  isTabActive 
                    ? "bg-[#181818] text-white" 
                    : "text-[#555550] hover:bg-[#C8CBB8]/50 hover:text-[#1A1A1A]"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 pr-2 border-r border-[#C8CBB8] text-xs font-medium text-[#555550]">
            <span className="w-1.5 h-1.5 bg-[#18B880] rounded-full animate-pulse" />
            <span>Signal Centre</span>
          </div>

          <button className="p-2 hover:bg-[#C8CBB8]/40 transition-colors rounded-[4px] text-[#555550] hover:text-[#1A1A1A]">
            <Settings className="w-4 h-4" />
          </button>
          
          <Link href="/dashboard/the-wire" className="p-2 hover:bg-[#C8CBB8]/40 transition-colors rounded-[4px] text-[#555550] hover:text-[#1A1A1A] relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F9771D] rounded-full" />
          </Link>

          <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center text-white text-xs font-bold font-mono">
            {profile?.display_name ? profile.display_name.slice(0, 2).toUpperCase() : "PC"}
          </Link>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-[#C8CBB8]/40 transition-colors rounded-[4px] text-[#1A1A1A]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main shell container — flex-1 so it fills the remaining height below the sticky header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside 
          className={cn(
            "hidden md:flex flex-col bg-white border-r border-[#DEDDD8] transition-all duration-300 z-30 shrink-0",
            isCollapsed ? "w-14" : "w-[220px]"
          )}
        >
          {/* Toggle button */}
          <div className="p-3 flex justify-end">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-[#C8CBB8]/40 transition-colors rounded-[4px] text-[#555550]"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Section 1: Main navigation */}
          <div className="flex-1 overflow-y-auto space-y-0.5 py-2">
            {mainNavLinks.map(link => (
              <SidebarLink key={link.href} {...link} />
            ))}

            {/* Divider */}
            <div className="my-3 border-t border-[#DEDDD8]" />

            {/* Section 2: Platform links */}
            {platformLinks.map(link => (
              <SidebarLink key={link.href} {...link} />
            ))}
          </div>

          {/* Bottom links: profile summary / billing */}
          <div className="border-t border-[#DEDDD8] p-2 space-y-1">
            <SidebarLink href="/dashboard/profile" icon={CreditCard} name="Billing" />
            <SidebarLink href="/dashboard/profile" icon={Settings} name="Settings" />
            
            {/* User profile summary widget */}
            {!isCollapsed && (
              <div className="p-3 bg-[#1A1A1A]/5 flex items-center gap-2 mt-2">
                <div className="w-7 h-7 bg-[#181818] rounded-full text-white text-[10px] flex items-center justify-center font-bold font-mono">
                  {profile?.display_name ? profile.display_name.slice(0, 2).toUpperCase() : "PC"}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold truncate">{profile?.display_name || "Pete Currey"}</p>
                  <span className="text-[8px] font-mono font-black tracking-wider bg-[#F9771D] text-white px-1 py-0.2 ml-0 inline-block">
                    {profile?.subscription_tier?.toUpperCase() || "EDGE"}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="ml-auto p-1.5 hover:bg-[#CE6969]/10 text-[#555550] hover:text-[#CE6969] transition-colors rounded-[4px]"
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
              {mainNavLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-none hover:bg-white/10 text-sm font-medium"
                >
                  <link.icon className="w-5 h-5 text-[#8A8A85]" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="border-t border-[#333330] my-4" />
              {platformLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-none hover:bg-white/10 text-sm font-medium"
                >
                  <link.icon className="w-5 h-5 text-[#8A8A85]" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-[#333330] flex items-center justify-between">
              <span className="text-xs text-[#8A8A85]">Pete Currey</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-[#CE6969] font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area — overflow-y-auto on a flex-1 container with definite height = scroll works */}
        <div className="flex-1 overflow-y-auto min-w-0 bg-white pb-16 md:pb-0">
          <main className="p-6 md:p-10 select-text">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar (≤768px viewport) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#DEDDD8] flex items-center justify-around z-50">
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
                isTabActive ? "text-[#F9771D]" : "text-[#555550] hover:text-[#1A1A1A]"
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

