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
  LogOut,
  Brain,
  Share2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardStatusBar } from "@/components/market/DashboardStatusBar";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: Brain },
  { name: "Learn", href: "/learn", icon: Library },
  { name: "Live Sessions", href: "/live", icon: Video },
  { name: "AI Tools", href: "/dashboard/tools", icon: Wrench },
  { name: "Partner Portal", href: "/partner", icon: Share2 },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as "dark" | "light";
    if (savedTheme) setTheme(savedTheme);

    async function checkOnboarding() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(data);
        if (data && !data.has_onboarded) {
          setShowOnboarding(true);
        }
      }
    }
    checkOnboarding();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("dashboard-theme", newTheme);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div 
      data-theme={theme}
      className="flex h-screen bg-background-primary overflow-hidden theme-transition"
    >
      {showOnboarding && profile && (
        <OnboardingWizard 
          userProfile={profile} 
          onComplete={() => setShowOnboarding(false)} 
        />
      )}
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-background-surface border-r border-border-slate transition-all duration-300 flex flex-col z-30 theme-transition",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="text-base font-display font-extrabold tracking-wider uppercase text-text-primary truncate">
              Drawdown
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-background-elevated transition-colors text-text-tertiary"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-8">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-premium group",
                  isActive 
                    ? "bg-accent/10 text-accent border-l-2 border-accent" 
                    : "text-text-secondary hover:text-text-primary hover:bg-background-elevated"
                )}
              >
                <link.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-accent" : "group-hover:text-text-primary")} />
                {!isCollapsed && <span className="uppercase tracking-widest text-[10px]">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-slate space-y-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} isCollapsed={isCollapsed} />
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-sm text-text-tertiary hover:text-loss transition-colors group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-loss" />
            {!isCollapsed && <span className="uppercase tracking-widest text-[10px]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0 min-h-0">
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
