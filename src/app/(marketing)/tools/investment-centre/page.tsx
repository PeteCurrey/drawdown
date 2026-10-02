import { Metadata } from "next";
import InvestmentCentreMarketingClient from "../../investment-centre/InvestmentCentreMarketingClient";

export const metadata: Metadata = {
  title: "The Investment Centre | Autonomous Macro & Risk Engine — Drawdown",
  description: "Institutional cross-asset macro synthesis, tri-model AI council, and falsification-gated execution terminal.",
};

export default function ToolsInvestmentCentrePage() {
  return <InvestmentCentreMarketingClient />;
}
