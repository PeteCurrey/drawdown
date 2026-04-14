"use client";

import { useState } from "react";
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
  LogOut
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardStatusBar } from "@/components/market/DashboardStatusBar";

const sidebarLinks = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learn", href: "/learn", icon: Library },
  { name: "Live Sessions", href: "/live", icon: Video },
  { name: "AI Tools", href: "/tools", icon: Wrench },
  { name: "Community", href: "/community", icon: Users },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-background-primary overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-background-surface border-r border-border-slate transition-all duration-300 flex flex-col z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="text-xl font-display font-extrabold tracking-widest uppercase">
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

        <div className="p-4 border-t border-border-slate">
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
      <div className="flex-grow flex flex-col overflow-hidden">
        <DashboardStatusBar />

        <main className="flex-grow overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
