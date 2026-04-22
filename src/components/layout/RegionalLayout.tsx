"use client";

import React, { createContext, useContext } from "react";
import { Region, REGIONS } from "@/lib/seo/hreflang";

interface RegionalContextType {
  region: Region;
  label: string;
  currency: string;
  currencySymbol: string;
  regulatoryBody: string;
  riskDisclaimer: string;
}

const RegionalContext = createContext<RegionalContextType | undefined>(undefined);

export function useRegion() {
  const context = useContext(RegionalContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionalProvider");
  }
  return context;
}

interface RegionalProviderProps {
  region: Region;
  children: React.ReactNode;
}

const REGIONAL_METADATA: Record<Region, Partial<RegionalContextType>> = {
  uk: {
    currencySymbol: "£",
    regulatoryBody: "FCA (Financial Conduct Authority)",
    riskDisclaimer: "Spread betting and CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 74% of retail investor accounts lose money when trading spread bets and CFDs with this provider.",
  },
  au: {
    currencySymbol: "A$",
    regulatoryBody: "ASIC (Australian Securities and Investments Commission)",
    riskDisclaimer: "Trading derivatives carries a high level of risk to your capital and you should only trade with money you can afford to lose. ASIC leverage limits for retail clients apply (1:30 for major forex pairs).",
  },
  us: {
    currencySymbol: "$",
    regulatoryBody: "CFTC (Commodity Futures Trading Commission) & NFA",
    riskDisclaimer: "Trading foreign exchange on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. CFTC/NFA leverage limits apply (1:50 for major forex).",
  },
  sg: {
    currencySymbol: "S$",
    regulatoryBody: "MAS (Monetary Authority of Singapore)",
    riskDisclaimer: "Contracts for Difference (CFDs) are speculative products. MAS leverage limits for retail clients apply (1:20 for forex). No capital gains tax applies to trading profits in Singapore.",
  },
  hk: {
    currencySymbol: "HK$",
    regulatoryBody: "SFC (Securities and Futures Commission)",
    riskDisclaimer: "Leveraged foreign exchange trading is risky. SFC Type 3 licensing rules apply. No capital gains tax applies to trading profits in Hong Kong.",
  },
};

export function RegionalProvider({ region, children }: RegionalProviderProps) {
  const metadata = REGIONAL_METADATA[region];
  const regionInfo = REGIONS[region];
  
  const value: RegionalContextType = {
    region,
    label: regionInfo.label,
    currency: regionInfo.currency,
    currencySymbol: metadata.currencySymbol || "$",
    regulatoryBody: metadata.regulatoryBody || "",
    riskDisclaimer: metadata.riskDisclaimer || "",
  };

  return (
    <RegionalContext.Provider value={value}>
      {children}
    </RegionalContext.Provider>
  );
}
