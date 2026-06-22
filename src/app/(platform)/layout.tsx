"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardStatusBar } from "@/components/market/DashboardStatusBar";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

// ─── Top-level nav items ──────────────────────────────────────────────────────
const topLinks = [
  { name: "Overview",       href: "/dashboard",                           icon: LayoutDashboard },
  { name: "Intelligence",   href: "/dashboard/intelligence",              icon: Brain },
  { name: "Daily Briefing", href: "/dashboard/intelligence/daily-report", icon: FileText },
  { name: "Live Sessions",  href: "/dashboard/live",                      icon: Video },
];

// ─── Learn submenu ────────────────────────────────────────────────────────────
const learnLinks = [
  { name: "Prop Firm Survival Kit", href: "/dashboard/courses/prop-firm-survival-kit", icon: ShieldCheck },
  { name: "Deploy Your Algo",      href: "/dashboard/courses/deploy-your-algo",      icon: Terminal },
];

// ─── Tools submenu ────────────────────────────────────────────────────────────
const toolsLinks = [
  { name: "Technical Scanner", href: "/dashboard/tools/technical-scanner", icon: ScanSearch },
  { name: "Position Sizer",    href: "/dashboard/tools/position-sizer",    icon: Calculator },
  { name: "Algo Builder",      href: "/dashboard/tools/algo-builder",      icon: Code },
];

// ─── Bottom nav items ─────────────────────────────────────────────────────────
const bottomLinks = [
  { name: "Partner Portal", href: "/partner",             icon: Share2 },
  { name: "Community",      href: "/dashboard/community", icon: Users },
  { name: "Profile",        href: "/dashboard/profile",   icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed]       = useState(false);
  const [toolsOpen, setToolsOpen]           = useState(false);
  const [learnOpen, setLearnOpen]           = useState(false);
  const [profile, setProfile]               = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const pathname  = usePathname();
  const supabase  = createClient();

  // Auto-open tools/learn submenus when on corresponding routes
  const onToolsRoute = toolsLinks.some(l => pathname.startsWith(l.href)) ||
    pathname === "/dashboard/tools";
  const onLearnRoute = learnLinks.some(l => pathname.startsWith(l.href)) ||
    pathname === "/dashboard/learn" || pathname.startsWith("/dashboard/courses");

  useEffect(() => {
    if (onToolsRoute) setToolsOpen(true);
  }, [onToolsRoute]);

  useEffect(() => {
    if (onLearnRoute) setLearnOpen(true);
  }, [onLearnRoute]);

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
  }, []); // eslint-disable-line

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ── Shared link style ───────────────────────────────────────────────────────
  function NavLink({ href, icon: Icon, name }: { href: string; icon: React.ElementType; name: string }) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center transition-all group rounded-lg mx-2",
          isCollapsed
            ? "justify-center py-3"
            : "gap-4 px-4 py-3",
          isActive
            ? "bg-[#0A0A0A] text-white"
            : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
        )}
      >
        <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-text-primary")} />
        {!isCollapsed && <span className="font-bold text-[13px]">{name}</span>}
      </Link>
    );
  }

  return (
    <div className="marketing flex h-screen bg-background-primary text-text-primary overflow-hidden relative" data-theme="light">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {showOnboarding && profile && (
        <OnboardingWizard 
          userProfile={profile} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-background-surface/80 backdrop-blur-md border-r border-border-slate/50 transition-all duration-300 flex flex-col z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo / collapse toggle */}
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="text-base font-display font-extrabold tracking-wider uppercase text-text-primary truncate">
              Drawdown
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-neutral-100 transition-colors text-text-tertiary"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-1 mt-8 overflow-y-auto">

          {/* Top-level links */}
          {topLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}

          {/* ── Learn collapsible group ── */}
          <div className="mx-2">
            {/* Learn header button */}
            <button
              onClick={() => {
                if (!isCollapsed) setLearnOpen(o => !o);
                else window.location.href = "/dashboard/learn";
              }}
              className={cn(
                "w-full flex items-center transition-all group rounded-lg",
                isCollapsed
                  ? "justify-center py-3"
                  : "gap-4 px-4 py-3",
                onLearnRoute
                  ? "bg-[#0A0A0A] text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
              )}
            >
              <Library className={cn(
                "w-5 h-5 shrink-0",
                onLearnRoute ? "text-white" : "group-hover:text-text-primary"
              )} />
              {!isCollapsed && (
                <>
                  <span className="font-bold text-[13px] flex-1 text-left">Learn</span>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    learnOpen ? "rotate-180" : ""
                  )} />
                </>
              )}
            </button>

            {/* Submenu — only when sidebar expanded */}
            {!isCollapsed && learnOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-neutral-200 pl-3">
                {learnLinks.map(link => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-[12px] font-medium rounded-lg transition-all group",
                        isActive
                          ? "bg-[#0A0A0A] text-white"
                          : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
                      )}
                    >
                      <link.icon className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "group-hover:text-text-primary"
                      )} />
                      <span className="font-bold">{link.name}</span>
                    </Link>
                  );
                })}
                <div className="flex items-center gap-3 px-3 py-2 text-[11px] font-medium text-text-tertiary select-none">
                  <span>More coming soon...</span>
                </div>
              </div>
            )}

            {/* Collapsed state: show learn icons individually */}
            {isCollapsed && (
              <div className="mt-1 space-y-1">
                {learnLinks.map(link => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-center px-4 py-2.5 rounded-lg transition-all group",
                        isActive
                          ? "bg-[#0A0A0A] text-white"
                          : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
                      )}
                      title={link.name}
                    >
                      <link.icon className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "group-hover:text-text-primary"
                      )} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Tools collapsible group ── */}
          <div className="mx-2">
            {/* Tools header button */}
            <button
              onClick={() => {
                if (!isCollapsed) setToolsOpen(o => !o);
                else window.location.href = "/dashboard/tools";
              }}
              className={cn(
                "w-full flex items-center transition-all group rounded-lg",
                isCollapsed
                  ? "justify-center py-3"
                  : "gap-4 px-4 py-3",
                onToolsRoute
                  ? "bg-[#0A0A0A] text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
              )}
            >
              <Wrench className={cn(
                "w-5 h-5 shrink-0",
                onToolsRoute ? "text-white" : "group-hover:text-text-primary"
              )} />
              {!isCollapsed && (
                <>
                  <span className="font-bold text-[13px] flex-1 text-left">Tools</span>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    toolsOpen ? "rotate-180" : ""
                  )} />
                </>
              )}
            </button>

            {/* Submenu — only when sidebar expanded */}
            {!isCollapsed && toolsOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-neutral-200 pl-3">
                {toolsLinks.map(link => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-[12px] font-medium rounded-lg transition-all group",
                        isActive
                          ? "bg-[#0A0A0A] text-white"
                          : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
                      )}
                    >
                      <link.icon className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "group-hover:text-text-primary"
                      )} />
                      <span className="font-bold">{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Collapsed state: show tool icons individually */}
            {isCollapsed && (
              <div className="mt-1 space-y-1">
                {toolsLinks.map(link => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-center px-4 py-2.5 rounded-lg transition-all group",
                        isActive
                          ? "bg-[#0A0A0A] text-white"
                          : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
                      )}
                      title={link.name}
                    >
                      <link.icon className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-white" : "group-hover:text-text-primary"
                      )} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom nav links */}
          {bottomLinks.map(link => (
            <NavLink key={link.href} {...link} />
          ))}

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border-slate/50 space-y-2 mt-auto mb-4">
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center transition-colors group rounded-lg hover:bg-neutral-100 text-text-secondary hover:text-loss",
              isCollapsed ? "justify-center py-3" : "gap-4 px-4 py-3"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-loss" />
            {!isCollapsed && <span className="font-bold text-[13px]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0 min-h-0 relative z-10 pt-4">
        <DashboardStatusBar />

        <main 
          className="flex-grow overflow-y-auto overflow-x-hidden p-6 md:p-10 min-h-0 relative"
          data-lenis-prevent
        >
          {children}
        </main>
      </div>
    </div>
  );
}

