"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { StructuredData } from "../StructuredData";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps = {}) {
  const pathname = usePathname();
  
  // Determine the items to display: use props if provided, otherwise parse the pathname
  const displayItems = items || pathname.split("/").filter(Boolean).map((path, index, arr) => ({
    label: path.replace(/-/g, " "),
    href: `/${arr.slice(0, index + 1).join("/")}`
  }));

  if (displayItems.length === 0) return null;

  const breadcrumbData = {
    itemListElement: [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://drawdown.trading"
      },
      ...displayItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label.charAt(0).toUpperCase() + item.label.slice(1),
        "item": `https://drawdown.trading${item.href.startsWith("/") ? "" : "/"}${item.href}`
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
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;

          return (
            <div key={`${item.href}-${index}`} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 opacity-20" />
              {isLast ? (
                <span className="text-text-secondary">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-accent transition-colors">
                  {item.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}

export default Breadcrumbs;
