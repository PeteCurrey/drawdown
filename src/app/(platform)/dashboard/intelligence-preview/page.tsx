import { MarketIntelligencePanel } from "@/components/dashboard/MarketIntelligencePanel";

export default function MarketIntelligencePreviewPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F4EF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <MarketIntelligencePanel
        percentage={81}
        signal={{
          direction: "BUY",
          instrument: "XAU/USD",
          timeframe: "1H",
          entryLow: "2,341.20",
          entryHigh: "2,350.80",
          tp1: "2,368.00",
          tp2: "2,389.50",
          sl: "2,328.40",
        }}
      />
    </div>
  );
}
