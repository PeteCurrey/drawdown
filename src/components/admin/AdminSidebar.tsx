"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Inbox, 
  BookOpen, 
  LayoutTemplate, 
  Search, 
  Network, 
  MessageSquare,
  Settings,
  ShieldAlert
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads Inbox", icon: Inbox },
  { href: "/admin/content", label: "Content & Institutes", icon: BookOpen },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: LayoutTemplate },
  { href: "/admin/seo", label: "SEO Suite", icon: Search },
  { href: "/admin/community", label: "Discord Manager", icon: MessageSquare },
  { href: "/admin/integrations", label: "API Integrations", icon: Network },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      <div className="flex items-center gap-4 px-6 mb-8">
        <ShieldAlert className="w-6 h-6 text-accent" />
        <div>
          <span className="text-accent font-mono text-[8px] uppercase tracking-widest block mb-0.5">// INTERNAL COMMAND</span>
          <h2 className="text-xl font-display font-bold uppercase tracking-tight">Admin.</h2>
        </div>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-accent text-background-primary shadow-lg shadow-accent/20" 
                  : "text-text-tertiary hover:bg-background-elevated hover:text-text-primary"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        
        <div className="pt-8 mt-8 border-t border-border-slate/30">
          <button className="w-full flex items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </nav>
    </aside>
  );
}
