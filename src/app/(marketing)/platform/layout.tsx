import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Platform — Drawdown",
  description: "Live market intelligence, AI-powered trading tools, and structured education — built for British traders who are serious about getting an edge.",
  alternates: {
    canonical: "https://drawdown.trading/platform",
  },
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
