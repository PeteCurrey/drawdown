import type { ReactNode } from "react";

/**
 * Layout for /dashboard/tools/algo-builder only.
 * Adds data-page="algo-builder" via a client wrapper so CSS can scope
 * dark-theme overrides to this route without touching the shared layout.
 */
import { AlgoBuilderPageWrapper } from "@/components/algo-builder/AlgoBuilderPageWrapper";

export default function AlgoBuilderLayout({ children }: { children: ReactNode }) {
  return <AlgoBuilderPageWrapper>{children}</AlgoBuilderPageWrapper>;
}
