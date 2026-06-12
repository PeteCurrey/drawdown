"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch and cascading renders
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-background-elevated border border-border-slate rounded-full">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "light" ? "bg-accent text-background-primary shadow-lg" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "dark" ? "bg-accent text-background-primary shadow-lg" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "system" ? "bg-accent text-background-primary shadow-lg" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="System Theme"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
