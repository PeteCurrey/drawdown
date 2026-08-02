import { Metadata } from "next";
import HowToTradeClient from "./HowToTradeClient";

export const metadata: Metadata = {
  title: "How to Trade — 100-Page Institutional Trading Framework | Drawdown",
  description: "Stop guessing. Learn the exact institutional trading framework used to pass prop firm evaluations and trade consistently. 100 pages, immediate PDF download.",
  openGraph: {
    title: "How to Trade — Pete Currey's Complete Trading Framework",
    description: "100 pages. Market structure, sessions, execution, risk management. The foundation every serious trader needs.",
  },
};

export default function HowToTradePage() {
  return <HowToTradeClient />;
}
