"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { StructuredData } from "../StructuredData";

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const paths = pathname.split("/").filter(Boolean);
  
  const breadcrumbData = {
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://drawdown.trade"
      },
      ...paths.map((path, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " "),
        "item": `https://drawdown.trade/${paths.slice(0, index + 1).join("/")}`
      }))
    ]
  };

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbData} />
      <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">
        <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
        </Link>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const label = path.replace(/-/g, " ");

          return (
            <div key={path} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 opacity-20" />
              {isLast ? (
                <span className="text-text-secondary">{label}</span>
              ) : (
                <Link href={href} className="hover:text-accent transition-colors">
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
