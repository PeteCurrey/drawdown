import React from "react";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-post-layout">
      {children}
    </div>
  );
}
