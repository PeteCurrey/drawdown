import type { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import BrokersAllClient from "./BrokersAllClient";

export const metadata: Metadata = getMetadata({
  title: "Compare Regulated Brokers & Trading Platforms | Drawdown",
  description:
    "Independent broker and trading platform reviews covering regulation, execution, fees, platforms and capital protection.",
  path: "/brokers/all",
});

export default function BrokersAllPage() {
  return <BrokersAllClient />;
}
