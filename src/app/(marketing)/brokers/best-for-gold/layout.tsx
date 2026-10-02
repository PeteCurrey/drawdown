import { Metadata } from "next";

// ── SEO Phase 1 — noindex until empirical data is verified ────────────────────
// This page contains broker rankings that have not yet been verified by
// live-account testing against our methodology. Until first-party test records
// are published at /research/broker-testing, this page must remain noindex.
// Remove this export (and delete this file) once the data is verified.
export const metadata: Metadata = {
  title: "Best Brokers for Gold Trading | Drawdown",
  description:
    "Reviewing the top brokers for gold (XAU/USD) trading based on spreads, execution speed and regulation. Rankings are updated as empirical test data is collected.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function BestForGoldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
