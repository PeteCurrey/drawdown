import React from "react";
import TradingViewBannerAnimated from "@/components/blog/TradingViewBannerAnimated";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-post-layout">
      {children}
      <div className="blog-affiliate-injection max-w-[720px] mx-auto px-6 mt-0 mb-16">
        <TradingViewBannerAnimated />
      </div>
    </div>
  );
}
