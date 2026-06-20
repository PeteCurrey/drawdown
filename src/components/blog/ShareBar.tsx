"use client";

import React, { useState, useEffect } from "react";
import { Mail, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareBarProps {
  title: string;
  className?: string;
}

export function ShareBar({ title, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url: ", err);
    }
  };

  const shareTargets = [
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
        </svg>
      )
    },
    {
      name: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: <Mail className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className={cn("flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-text-tertiary", className)}>
      <span className="font-bold">// SHARE:</span>
      <div className="flex items-center border border-[#E5E5E5] rounded-none divide-x divide-[#E5E5E5]">
        {shareTargets.map((target) => (
          <a
            key={target.name}
            href={target.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${target.name}`}
            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 hover:text-accent transition-colors"
          >
            {target.icon}
          </a>
        ))}
        <button
          onClick={handleCopy}
          title="Copy Link"
          className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 hover:text-accent transition-colors cursor-pointer bg-transparent border-none text-text-tertiary"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-profit" /> : <Link2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
