"use client";

import { Navigation } from "@/components/layout/Navigation";
import { DynamicRegionalProvider } from "@/components/layout/DynamicRegionalProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DynamicRegionalProvider>
      <div className="marketing min-h-screen bg-background-primary">
        <Navigation />
        {children}
      </div>
    </DynamicRegionalProvider>
  );
}
