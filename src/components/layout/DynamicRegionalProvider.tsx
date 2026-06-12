"use client";

import { usePathname } from "next/navigation";
import { RegionalProvider } from "./RegionalLayout";
import { Region, REGIONS } from "@/lib/seo/hreflang";

export function DynamicRegionalProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const segments = (pathname || "").split('/').filter(Boolean);
  let region: Region = "uk";
  
  if (segments.length > 0) {
    const possibleRegion = segments[0] as Region;
    if (Object.keys(REGIONS).includes(possibleRegion)) {
      region = possibleRegion;
    }
  }

  return (
    <RegionalProvider region={region}>
      {children}
    </RegionalProvider>
  );
}
