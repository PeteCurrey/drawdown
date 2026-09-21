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
  // Check if current path is a homepage (including regional sub-routes)
  const isHomepage = pathname === "/" || pathname === "/au" || pathname === "/us" || pathname === "/sg" || pathname === "/hk";
  const isLobby = pathname?.startsWith("/lobby");

  return (
    <DynamicRegionalProvider>
      <div className="marketing flex flex-col min-h-screen bg-background-primary text-text-primary">
        {!isHomepage && (isLobby ? <LobbyHeader /> : <Navigation />)}
        <main className={isHomepage || isLobby ? "flex-grow" : "flex-grow pt-[58px]"}>
          {children}
        </main>
        {!isHomepage && <Footer />}
      </div>
    </DynamicRegionalProvider>
  );
}
