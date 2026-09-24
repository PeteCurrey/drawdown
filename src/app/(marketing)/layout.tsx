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
  const normalizedPathname = pathname
    ? pathname.replace(/^\/(au|us|sg|hk|ca|de|ae|in|my|ph)/, "").replace(/\/$/, "")
    : "";

  const isHomepage = pathname === "/" || pathname === "/au" || pathname === "/us" || pathname === "/sg" || pathname === "/hk";
  const isLobby = pathname?.startsWith("/lobby");
  const isMarkets = pathname === "/markets" || normalizedPathname === "/markets";
  const CATEGORY_HUB_SLUGS = ["/markets/crypto", "/markets/indices", "/markets/forex", "/markets/commodities"];
  const isCategoryHub = CATEGORY_HUB_SLUGS.some(
    (slug) =>
      pathname === slug ||
      pathname === `${slug}/` ||
      normalizedPathname === slug
  );

  // ── Prop-firm / store pages ────────────────────────────────────────────────
  const isPropFirmReview   = /^\/prop-firms\/(?!compare|quiz|how-to-pass)[^/]+$/.test(normalizedPathname);
  const isPropFirmCompare  = normalizedPathname === "/prop-firms/compare";
  const isPropSurvivalKit  = normalizedPathname === "/store/prop-survival-kit";
  const isDeployYourAlgo   = normalizedPathname === "/courses/deploy-your-algo";

  // ── Broker pages ───────────────────────────────────────────────────────────
  const isBrokerReview = /^\/brokers\/(?!all|how-to-choose|best-for-gold|quiz)[^/]+$/.test(normalizedPathname);
  const isBrokersAll   = normalizedPathname === "/brokers/all";

  // ── Broker/instrument compare (/compare, not /prop-firms/compare) ──────────
  const isBrokerComparePage = normalizedPathname === "/compare" || normalizedPathname.startsWith("/compare/");

  // ── Institutional accelerator ──────────────────────────────────────────────
  const isInstitutionalAccelerator = normalizedPathname === "/institutional-accelerator" ||
    normalizedPathname === "/institutional-accelerator/apply";

  // ── Dark store pages ───────────────────────────────────────────────────────
  const isDarkStorePage = (
    normalizedPathname === "/store/the-edge" ||
    normalizedPathname === "/store/how-to-trade" ||
    normalizedPathname === "/store/manual-bundle"
  );

  // ── Success / confirmation pages ───────────────────────────────────────────
  const isSuccessPage = (
    normalizedPathname.endsWith("/success") && (
      normalizedPathname.startsWith("/store/") ||
      normalizedPathname.startsWith("/courses/")
    )
  );

  // Pages where the hero extends behind the transparent fixed header (main pt-0)
  // The hero section itself must have enough top padding to clear the 58px nav.
  const isHeroTransparentHeader = (
    isPropFirmReview ||
    isPropFirmCompare ||
    isPropSurvivalKit ||
    isBrokerReview ||
    isBrokersAll ||
    isBrokerComparePage ||
    isInstitutionalAccelerator ||
    isDarkStorePage
  );

  // Pages with a dark background at the layout level
  const isDarkLayout = (
    isCategoryHub ||
    isHeroTransparentHeader ||
    isDeployYourAlgo ||
    isDarkStorePage ||
    isSuccessPage
  );

  // Pages requiring a dark footer
  const isDarkFooter = (
    isCategoryHub ||
    isDeployYourAlgo ||
    isBrokersAll ||
    isBrokerComparePage ||
    isInstitutionalAccelerator ||
    isDarkStorePage ||
    isSuccessPage
  );

  return (
    <DynamicRegionalProvider>
      <div className={cn("marketing flex flex-col min-h-screen text-text-primary", isDarkLayout ? "bg-[#0A0A0A]" : "bg-background-primary")}>
        {!isHomepage && (isLobby ? <LobbyHeader /> : <Navigation />)}
        <main
          className={
            isHomepage || isLobby || isHeroTransparentHeader
              ? "flex-grow pt-0"
              : isMarkets
              ? "flex-grow pt-[90px]"
              : "flex-grow pt-[58px]"
          }
        >
          {children}
        </main>
        {!isHomepage && <Footer theme={isDarkFooter ? "dark" : "light"} />}
      </div>
    </DynamicRegionalProvider>
  );
}
