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
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: Brain },
  { name: "Learn", href: "/dashboard/learn", icon: Library },
  { name: "Live Sessions", href: "/dashboard/live", icon: Video },
  { name: "AI Tools", href: "/dashboard/tools", icon: Wrench },
  { name: "Partner Portal", href: "/partner", icon: Share2 },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const pathname = usePathname();
  const supabase = createClient();

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
          return; // Skip showing wizard if we already know they onboarded locally
        }
        
        if (profile && !profile.has_onboarded) {
          setShowOnboarding(true);
        } else if (profile?.has_onboarded) {
          // Sync localStorage with DB state
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

  return (
    <div className="flex h-screen bg-background-primary overflow-hidden relative">
      {/* Premium Dashboard Background */}
      <div 
        className="absolute inset-0 z-0 opacity-15 mix-blend-screen pointer-events-none"
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
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all group rounded-lg mx-2",
                  isActive 
                    ? "bg-accent text-[#08090D]" 
                    : "text-text-secondary hover:text-text-primary hover:bg-background-elevated/40"
                )}
              >
                <link.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#08090D]" : "group-hover:text-text-primary")} />
                {!isCollapsed && <span className="font-bold text-[13px]">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-slate/50 space-y-2 mt-auto mb-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-sm text-text-secondary hover:text-loss transition-colors group rounded-lg hover:bg-background-elevated/40"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:text-loss" />
            {!isCollapsed && <span className="font-bold text-[13px]">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0 min-h-0 relative z-10">
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
