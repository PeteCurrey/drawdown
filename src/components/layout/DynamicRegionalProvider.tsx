"use client";

import { usePathname } from "next/navigation";
import { RegionalProvider } from "./RegionalLayout";
import { Region } from "@/lib/seo/hreflang";

export function DynamicRegionalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Detect region from first segment of pathname
  // e.g. /us/something -> us
  // e.g. /au -> au
  // e.g. / -> uk (default)
  const segments = pathname.split('/').filter(Boolean);
  let region: Region = "uk";
  
  if (segments.length > 0) {
    const possibleRegion = segments[0] as Region;
    if (["us", "au", "sg", "hk", "uk"].includes(possibleRegion)) {
      region = possibleRegion;
    }
  }

  return (
    <RegionalProvider region={region}>
      {children}
    </RegionalProvider>
  );
}
