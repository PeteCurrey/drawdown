import React from "react";
import { PropSurvivalFloatingWidget } from "@/components/ui/PropSurvivalFloatingWidget";

export default function PropFirmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PropSurvivalFloatingWidget />
    </>
  );
}
