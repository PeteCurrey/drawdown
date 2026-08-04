"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Inbox, 
  Calendar, 
  BookOpen 
} from "lucide-react";

const LMS_NAV_ITEMS = [
  { href: "/admin/accelerator", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/accelerator/cohorts", label: "Cohorts", icon: Layers },
  { href: "/admin/accelerator/students", label: "Student Roster", icon: Users },
  { href: "/admin/accelerator/milestones", label: "Milestones Queue", icon: Inbox },
  { href: "/admin/accelerator/sessions", label: "Workshops & 1:1s", icon: Calendar },
  { href: "/admin/accelerator/curriculum", label: "Curriculum Editor", icon: BookOpen },
];

export function AcceleratorSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-2 mb-8 shadow-sm">
      <div className="flex flex-wrap items-center gap-1">
        {LMS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-semibold transition-all",
                isActive
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
