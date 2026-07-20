import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prop Firm Survival Kit | Pass Your Challenge",
  description: "The complete guide to passing prop firm challenges — drawdown rules decoded, position protocol, psychology frameworks and funded phase transition. Built by UK traders for UK traders.",
};

export default function PropSurvivalKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
