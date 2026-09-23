"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { LobbyHeader } from "@/components/lobby/LobbyHeader";
import { Footer } from "@/components/layout/Footer";
import { DynamicRegionalProvider } from "@/components/layout/DynamicRegionalProvider";
import { cn } from "@/lib/utils";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/" || pathname === "/au" || pathname === "/us" || pathname === "/sg" || pathname === "/hk";
  const isLobby = pathname?.startsWith("/lobby");
  const isMarkets = pathname === "/markets" || pathname?.replace(/^\/(au|us|sg|hk)/, "").replace(/\/$/, "") === "/markets";
  const CATEGORY_HUB_SLUGS = ["/markets/crypto", "/markets/indices", "/markets/forex", "/markets/commodities"];
  const isCategoryHub = CATEGORY_HUB_SLUGS.some(
    (slug) =>
      pathname === slug ||
      pathname === `${slug}/` ||
      pathname?.replace(/^\/(au|us|sg|hk|ca|de|ae|in|my|ph)/, "").replace(/\/$/, "") === slug
  );

  return (
    <DynamicRegionalProvider>
      <div className={cn("marketing flex flex-col min-h-screen text-text-primary", isCategoryHub ? "bg-[#0A0A0A]" : "bg-background-primary")}>
        {!isHomepage && (isLobby ? <LobbyHeader /> : <Navigation />)}
        <main className={isHomepage || isLobby ? "flex-grow" : isMarkets ? "flex-grow pt-[90px]" : "flex-grow pt-[58px]"}>
          {children}
        </main>
        {!isHomepage && <Footer theme={isCategoryHub ? "dark" : "light"} />}
      </div>
    </DynamicRegionalProvider>
  );
}
