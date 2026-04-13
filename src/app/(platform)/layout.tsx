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
        {/* Top Bar Ticker */}
        <header className="h-14 border-b border-border-slate bg-background-surface flex items-center px-6 overflow-hidden">
          <div className="flex items-center gap-8 whitespace-nowrap animate-ticker">
            {[
              { symbol: "FTSE 100", price: "8,234.50", change: "+0.45%" },
              { symbol: "S&P 500", price: "5,432.12", change: "+1.23%" },
              { symbol: "BTC/USD", price: "64,231.00", change: "-0.87%" },
              { symbol: "GBP/USD", price: "1.2745", change: "+0.12%" },
              { symbol: "GOLD", price: "2,345.60", change: "+0.32%" },
            ].map((market, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-text-tertiary">{market.symbol}</span>
                <span className="text-text-primary font-bold">{market.price}</span>
                <span className={market.change.startsWith('+') ? 'text-profit' : 'text-loss'}>
                  {market.change}
                </span>
              </div>
            ))}
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
