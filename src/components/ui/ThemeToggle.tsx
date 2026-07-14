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
    <div className="flex items-center gap-1 p-1 bg-[#F7F7F7] border border-mkt-bd rounded-full">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "light" ? "bg-mkt-ink text-white shadow-lg" : "text-mkt-i2 hover:text-mkt-ink"
        )}
        aria-label="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "dark" ? "bg-mkt-ink text-white shadow-lg" : "text-mkt-i2 hover:text-mkt-ink"
        )}
        aria-label="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-1.5 rounded-full transition-all duration-300",
          theme === "system" ? "bg-mkt-ink text-white shadow-lg" : "text-mkt-i2 hover:text-mkt-ink"
        )}
        aria-label="System Theme"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
