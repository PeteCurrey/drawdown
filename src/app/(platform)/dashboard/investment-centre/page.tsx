import { Metadata } from "next";
import InvestmentCentreClient from "./InvestmentCentreClient";

export const metadata: Metadata = {
  title: "The Investment Centre | Autonomous Macro & Risk Engine — Drawdown",
  description: "Cross-Asset Macro Synthesis & Falsification-Gated Execution Terminal.",
};

export default function InvestmentCentrePage() {
  return <InvestmentCentreClient />;
}
