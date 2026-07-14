export interface InternalLinkItem {
  title: string;
  href: string;
  category: string;
}

export function getRelatedLinks(currentPath: string): InternalLinkItem[] {
  const path = currentPath.toLowerCase();

  // 1. PROP FIRM PATHS
  if (path.includes("prop-firm") || path.includes("challenge") || path.includes("ftmo") || path.includes("5ers")) {
    return [
      { title: "Prop Firm Daily Loss Calculator", href: "/calculators/prop-firm-daily-loss", category: "Calculators" },
      { title: "Prop Firm Maximum Loss Calculator", href: "/calculators/prop-firm-maximum-loss", category: "Calculators" },
      { title: "FTMO vs The5%ers Comparison", href: "/compare/ftmo-vs-the5ers", category: "Comparisons" },
      { title: "Best Prop Firm for Swing Trading", href: "/best/best-prop-firm-for-swing-trading", category: "SEO Guides" }
    ];
  }

  // 2. CALCULATOR PATHS
  if (path.includes("calculator")) {
    return [
      { title: "Position Size Modeler", href: "/calculators/position-size", category: "Calculators" },
      { title: "Risk of Ruin Calculator", href: "/calculators/risk-of-ruin", category: "Calculators" },
      { title: "Drawdown Recovery Calculator", href: "/calculators/drawdown-recovery", category: "Calculators" },
      { title: "Best Broker for Scalping", href: "/best/broker-for-scalping-uk", category: "SEO Guides" }
    ];
  }

  // 3. BROKER PATHS
  if (path.includes("broker") || path.includes("ig") || path.includes("pepperstone") || path.includes("t212")) {
    return [
      { title: "Position Size Calculator", href: "/calculators/position-size", category: "Calculators" },
      { title: "IG Index vs Pepperstone Comparison", href: "/compare/ig-vs-pepperstone", category: "Comparisons" },
      { title: "Best Broker in UK Guide", href: "/best/forex-broker-uk", category: "SEO Guides" },
      { title: "Recommended Trading Tools", href: "/trading-tools", category: "Tools Review" }
    ];
  }

  // 4. TRADING TOOLS PATHS
  if (path.includes("tool") || path.includes("tradingview") || path.includes("tradervue") || path.includes("tester")) {
    return [
      { title: "Trading Tools Directory", href: "/trading-tools", category: "Tools Hub" },
      { title: "TradingView vs MetaTrader Comparison", href: "/compare/tradingview-vs-mt4", category: "Comparisons" },
      { title: "Pip Value Calculator", href: "/calculators/pip-value", category: "Calculators" },
      { title: "Best Trading Tool for Charting", href: "/best/best-trading-tool-for-charting", category: "SEO Guides" }
    ];
  }

  // DEFAULT FALLBACK
  return [
    { title: "Position Size Calculator", href: "/calculators/position-size", category: "Calculators" },
    { title: "Prop Firm Daily Loss Calculator", href: "/calculators/prop-firm-daily-loss", category: "Calculators" },
    { title: "Trading Tools Directory", href: "/trading-tools", category: "Tools Hub" },
    { title: "FTMO vs The5%ers Comparison", href: "/compare/ftmo-vs-the5ers", category: "Comparisons" }
  ];
}
