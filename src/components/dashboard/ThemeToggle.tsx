"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
  isCollapsed?: boolean;
}

export function ThemeToggle({ theme, onToggle, isCollapsed }: ThemeToggleProps) {
  return (
    <div className={cn(
      "px-4 py-3 flex items-center gap-4 transition-all duration-300",
      isCollapsed ? "justify-center" : ""
    )}>
      <button
        onClick={onToggle}
        className={cn(
          "relative flex items-center gap-3 p-1 rounded-full border border-border-slate bg-background-elevated transition-premium hover:border-accent group",
          !isCollapsed ? "w-full" : "w-10 h-10 justify-center"
        )}
        aria-label="Toggle Theme"
      >
        <div className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full bg-background-primary transition-all duration-500",
          theme === "light" ? "translate-x-0" : !isCollapsed ? "translate-x-[calc(100%+8px)] lg:translate-x-[110px]" : "translate-x-0"
        )}>
          {theme === "light" ? (
            <Sun className="w-4 h-4 text-warning" />
          ) : (
            <Moon className="w-4 h-4 text-accent" />
          )}
        </div>
        
        {!isCollapsed && (
          <div className="flex-grow text-left pr-4">
             <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary group-hover:text-text-primary transition-colors">
               {theme === "light" ? "Light Mode" : "Dark Mode"}
             </span>
          </div>
        )}
      </button>
    </div>
  );
}
