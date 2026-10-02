import { Metadata } from "next";
import ManualBundleClient from "./ManualBundleClient";

export const metadata: Metadata = {
  title: "Complete Manual Collection Bundle — Save £58 | Drawdown Store",
  description: "Equip your trading desk with Drawdown's full playbook collection: Prop Firm Survival Kit, How to Trade, and The Edge Manual in one permanent PDF bundle.",
  openGraph: {
    title: "Complete Manual Collection Bundle — Drawdown",
    description: "Get all three flagship systematic playbooks by Pete Currey in a single download bundle and save £58.",
  },
};

export default function ManualBundlePage() {
  return <ManualBundleClient />;
}
