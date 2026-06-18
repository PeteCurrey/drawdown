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
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside 
      className={cn(
        "bg-background-surface/80 backdrop-blur-md border-r border-border-slate/50 transition-all duration-300 flex flex-col z-30",
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
          className="p-1 hover:bg-neutral-100 transition-colors text-text-tertiary"
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
                "flex items-center gap-4 px-4 py-3 text-sm font-medium transition-all group rounded-lg mx-2",
                isActive 
                  ? "bg-[#0A0A0A] text-white" 
                  : link.variant === 'secondary'
                    ? "text-text-tertiary hover:text-text-primary hover:bg-neutral-100 mt-8 pt-4 border-t border-border-slate/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-neutral-100"
              )}
            >
              <link.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "group-hover:text-text-primary")} />
              {!isCollapsed && <span className="font-bold text-[13px]">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-slate/50 space-y-2 mt-auto mb-4">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-sm text-text-secondary hover:text-loss transition-colors group rounded-lg hover:bg-neutral-100"
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:text-loss" />
          {!isCollapsed && <span className="font-bold text-[13px]">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
