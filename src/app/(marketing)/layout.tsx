"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { LobbyHeader } from "@/components/lobby/LobbyHeader";
import { Footer } from "@/components/layout/Footer";
import { DynamicRegionalProvider } from "@/components/layout/DynamicRegionalProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "/au" || pathname === "/us" || pathname === "/sg" || pathname === "/hk";
  const isLobby = pathname?.startsWith("/lobby");
  const isMarkets = pathname === "/markets" || pathname?.replace(/^\/(au|us|sg|hk)/, "").replace(/\/$/, "") === "/markets";

  return (
    <DynamicRegionalProvider>
      <div className="marketing flex flex-col min-h-screen bg-background-primary text-text-primary">
        {!isHomepage && (isLobby ? <LobbyHeader /> : <Navigation />)}
        <main className={isHomepage || isLobby ? "flex-grow" : isMarkets ? "flex-grow pt-[90px]" : "flex-grow pt-[58px]"}>
          {children}
        </main>
        {!isHomepage && <Footer />}
      </div>
    </DynamicRegionalProvider>
  );
}
