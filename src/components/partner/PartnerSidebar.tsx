"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Link as LinkIcon, 
  Users, 
  Image as ImageIcon,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

const partnerLinks = [
  { name: "Overview", href: "/partner", icon: LayoutDashboard },
  { name: "Referrals", href: "/partner/referrals", icon: Users },
  { name: "Analytics", href: "/partner/analytics", icon: BarChart3 },
  { name: "Link Generator", href: "/partner/links", icon: LinkIcon },
  { name: "Creative Assets", href: "/partner/assets", icon: ImageIcon },
  { name: "Support", href: "/partner/support", icon: HelpCircle },
  { name: "Student View", href: "/dashboard", icon: LayoutDashboard, variant: 'secondary' },
];

export function PartnerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();
  const supabase = createClient();

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
    <aside 
      className={cn(
        "bg-background-surface border-r border-border-slate transition-all duration-300 flex flex-col z-30 theme-transition",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="text-base font-display font-extrabold tracking-wider uppercase text-text-primary truncate">
             Partner Hub
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
        {partnerLinks.map((link) => {
          const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-premium group",
                  isActive 
                    ? "bg-accent/10 text-accent border-l-2 border-accent" 
                    : (link as any).variant === 'secondary'
                      ? "text-text-tertiary hover:text-text-primary mt-8 border-t border-border-slate/30"
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
  );
}
