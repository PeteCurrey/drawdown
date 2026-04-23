"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Brain, 
  Newspaper, 
  UserCircle,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/lib/capacitor';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Intel', href: '/dashboard/intelligence', icon: Brain },
  { name: 'News', href: '/dashboard/news', icon: Newspaper },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

export const NativeBottomNav = () => {
  const pathname = usePathname();

  // Handle haptic feedback on tap
  const handleTap = () => {
    triggerHaptic();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-surface border-t border-border-slate px-6 pb-safe-bottom pt-3 z-50 app-only">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleTap}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors group",
                isActive ? "text-accent" : "text-text-tertiary"
              )}
            >
              <div className={cn(
                "p-1 rounded-xl transition-colors",
                isActive ? "bg-accent/10" : "group-hover:bg-background-elevated"
              )}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
