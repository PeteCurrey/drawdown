import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { MarketTicker } from "@/components/market/MarketTicker";
import { DynamicRegionalProvider } from "@/components/layout/DynamicRegionalProvider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicRegionalProvider>
      <div className="flex flex-col min-h-screen">
        <MarketTicker />
        <Navigation />
        <main className="flex-grow pt-[120px]">
          {children}
        </main>
        <Footer />
      </div>
    </DynamicRegionalProvider>
  );
}
