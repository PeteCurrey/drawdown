import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/market/MarketTicker";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { Region, REGIONS } from "@/lib/seo/hreflang";
import { headers } from "next/headers";

function getRegionFromPath(pathname: string): Region {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0) {
    const possibleRegion = segments[0] as Region;
    if ((REGIONS as string[]).includes(possibleRegion)) {
      return possibleRegion;
    }
  }
  return "uk";
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "/";
  const region = getRegionFromPath(pathname);

  return (
    <RegionalProvider region={region}>
      <div className="flex flex-col min-h-screen">
        <MarketTicker />
        <Navigation />
        <main className="flex-grow pt-[120px]">
          {children}
        </main>
        <Footer />
      </div>
    </RegionalProvider>
  );
}
