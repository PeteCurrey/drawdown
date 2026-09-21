"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  sectionId?: string;
}

const LOBBY_NAV_ITEMS: NavItem[] = [
  { name: "HOME", href: "/lobby" },
  { name: "YOUR LOBBY", href: "/lobby?view=your-lobby" },
  { name: "THE WIRE", href: "/wire" },
  { name: "WHAT'S HAPPENING", href: "/lobby#whats-happening", sectionId: "whats-happening" },
  { name: "WATCHLIST", href: "/lobby#watchlist", sectionId: "watchlist" },
  { name: "MARKETS", href: "/lobby/markets" },
  { name: "BROKERS", href: "/lobby/brokers" },
  { name: "PROP FIRMS", href: "/lobby/prop-firms" },
  { name: "PLATFORMS", href: "/lobby/platforms" },
  { name: "TRADES", href: "/lobby/trades" },
  { name: "EXPLAINED", href: "/lobby/explained" },
  { name: "DRAWDOWN DESK", href: "/lobby/drawdown" },
  { name: "COMING UP", href: "/lobby#coming-up", sectionId: "coming-up" },
];

export interface LobbyNavProps {
  activeCategory?: string;
}

export function LobbyNav({ activeCategory }: LobbyNavProps = {}) {
  const pathname = usePathname();

  const isLobbyHome = pathname === "/lobby";

  return (
    <nav 
      aria-label="The Lobby Secondary Navigation"
      className="sticky top-[56px] z-40 w-full border-b border-[#DEDDD8] bg-[#FFFFFF]/95 backdrop-blur-md transition-colors"
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[44px]">
        {/* Horizontal scroll container with fading edge mask */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap pr-8 py-1">
            {LOBBY_NAV_ITEMS.map((item) => {
              const isHomeActive = item.href === "/lobby" && isLobbyHome;
              const isCategoryActive = !isLobbyHome && item.href !== "/lobby" && pathname.startsWith(item.href);
              const isActive = isHomeActive || isCategoryActive;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[11px] font-mono uppercase tracking-[0.14em] transition-colors duration-150 py-1 border-b-2 border-transparent",
                    isActive
                      ? "text-[#16213E] border-[#16213E] font-bold"
                      : "text-[#4B5157] hover:text-[#0B0E12]"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          {/* Subtle gradient right fade to indicate scrollable content on small screens */}
          <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-[#FFFFFF] to-transparent lg:hidden" />
        </div>

        {/* Search & Archive Jump */}
        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-[#DEDDD8] shrink-0">
          <Link
            href="/lobby/archive"
            className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#4B5157] hover:text-[#16213E] transition-colors"
          >
            ARCHIVE
          </Link>
          <Link
            href="/lobby/search"
            aria-label="Search The Lobby"
            className="p-1.5 text-[#4B5157] hover:text-[#16213E] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
