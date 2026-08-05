import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works — The Drawdown Operating System",
  description: "A repeatable 7-stage trading process: Prepare, Plan, Execute Elsewhere, Record, Review, Improve, Repeat Weekly. Every Drawdown capability has a defined role.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
