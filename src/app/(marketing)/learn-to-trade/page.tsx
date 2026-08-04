import { Metadata } from "next";
import { LearnHubClient } from "@/components/learn/LearnHubClient";

export const metadata: Metadata = {
  title: "Learn to Trade | Professional Trading Education & Academy",
  description: "Master the financial markets with our structured, institutional-grade trading curriculum. From market microstructure to mathematical risk management.",
};

export default function LearnHubPage() {
  return <LearnHubClient />;
}

