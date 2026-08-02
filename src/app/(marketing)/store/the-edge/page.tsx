import { Metadata } from "next";
import TheEdgeClient from "./TheEdgeClient";

export const metadata: Metadata = {
  title: "The Edge Manual — Advanced Trading Strategy & Proprietary Setups | Drawdown",
  description: "Stop being technically correct and still losing. Get Pete's advanced 100-page trading playbook covering liquidity theory, confluence, proprietary setups and the psychological edge. Instant PDF download.",
  openGraph: {
    title: "The Edge Manual — Advanced Strategy Playbook",
    description: "Liquidity theory, confluence trading, proprietary setups & the mental framework to stay consistent. 100 pages.",
  },
};

export default function TheEdgePage() {
  return <TheEdgeClient />;
}
