"use client";

import { useState, useEffect } from "react";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { DashboardStatusBar } from "@/components/market/DashboardStatusBar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboard-theme") as "dark" | "light";
    if (savedTheme) setTheme(savedTheme);
  }, []);

  return (
    <div 
      data-theme={theme}
      className="flex h-screen bg-background-primary overflow-hidden theme-transition"
    >
      <PartnerSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0 min-h-0">
        <DashboardStatusBar />

        <main 
          className="flex-grow overflow-y-auto overflow-x-hidden p-6 md:p-10 min-h-0 relative"
          data-lenis-prevent
        >
          {children}
        </main>
      </div>
    </div>
  );
}
