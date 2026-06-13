"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/market/MarketTicker";
import { DynamicRegionalProvider } from "@/components/layout/DynamicRegionalProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check if current path is a homepage (including regional sub-routes)
  const isHomepage = pathname === "/" || pathname === "/au" || pathname === "/us" || pathname === "/sg" || pathname === "/hk";

  return (
    <DynamicRegionalProvider>
      <div className="marketing flex flex-col min-h-screen bg-background-primary text-text-primary">
        {!isHomepage && <MarketTicker />}
        {!isHomepage && <Navigation />}
        <main className={isHomepage ? "flex-grow" : "flex-grow pt-[120px]"}>
          {children}
        </main>
        {!isHomepage && <Footer />}
      </div>
    </DynamicRegionalProvider>
  );
}
