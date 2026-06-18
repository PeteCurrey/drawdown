"use client";

import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { DashboardStatusBar } from "@/components/market/DashboardStatusBar";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div 
      data-theme="light"
      className="marketing flex h-screen bg-background-primary text-text-primary overflow-hidden relative"
    >
      {/* Premium Dashboard Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      <PartnerSidebar />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden min-w-0 min-h-0 relative z-10">
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
