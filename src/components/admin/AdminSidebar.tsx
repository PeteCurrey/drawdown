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
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  Target,
  Brain,
  Mail,
  Link2,
  FileText
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/revenue", label: "Revenue & MRR", icon: Target },
  { href: "/admin/members", label: "Members Roster", icon: Users },
  { href: "/admin/events", label: "Live Events", icon: MessageSquare },
  { href: "/admin/content", label: "Content Delivery", icon: BookOpen },
  { href: "/admin/emails", label: "Emails History", icon: Mail },
  { href: "/admin/subscribers", label: "Email Subscribers", icon: Users },
  { href: "/admin/blog", label: "Blog Manager", icon: FileText },
  { href: "/admin/intelligence", label: "Intelligence Suite", icon: Brain },
  { href: "/admin/leads", label: "Leads Inbox", icon: Inbox },
  { href: "/admin/partners", label: "Partners", icon: Network },
  { href: "/admin/marketing", label: "Marketing & SEO", icon: Target },
  { href: "/admin/affiliates", label: "Affiliate Manager", icon: Link2 },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: LayoutTemplate },
  { href: "/admin/seo", label: "SEO Suite", icon: Search },
  { href: "/admin/community", label: "Discord Manager", icon: MessageSquare },
  { href: "/admin/integrations", label: "API Integrations", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      <div className="flex items-center gap-4 px-6 mb-8">
        <ShieldAlert className="w-6 h-6 text-mkt-grn" />
        <div>
          <span className="text-mkt-i4 font-mono text-[8px] uppercase tracking-widest block mb-0.5">// INTERNAL COMMAND</span>
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-mkt-ink">Admin.</h2>
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
                "w-full flex items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
                isActive 
                  ? "bg-mkt-ink text-white shadow-sm" 
                  : "text-mkt-i3 hover:bg-neutral-100 hover:text-mkt-ink"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
        
        <div className="pt-8 mt-8 border-t border-mkt-bd">
          <Link 
            href="/admin/settings"
            className={cn(
              "w-full flex items-center gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
              pathname.startsWith("/admin/settings")
                ? "bg-mkt-ink text-white shadow-sm"
                : "text-mkt-i3 hover:bg-neutral-100 hover:text-mkt-ink"
            )}
          >
            <Settings className="w-4 h-4" />
            Author Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}
