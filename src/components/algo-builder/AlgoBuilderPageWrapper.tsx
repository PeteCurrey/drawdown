"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Sets data-page="algo-builder" on <body> while this route is mounted.
 * This lets globals.css scope dark-theme overrides to this page only
 * without affecting any other dashboard route.
 */
export function AlgoBuilderPageWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.setAttribute("data-page", "algo-builder");
    return () => {
      document.body.removeAttribute("data-page");
    };
  }, []);

  return <>{children}</>;
}
