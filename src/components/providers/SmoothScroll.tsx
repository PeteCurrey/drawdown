"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function SmoothScroll() {
  return <ScrollReset />;
}

