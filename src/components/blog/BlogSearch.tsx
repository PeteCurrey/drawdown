"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page"); // Reset pagination on new search
    router.push(`/blog?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("page");
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-white border border-[#E5E5E5] hover:border-[#CCCCCC] focus:border-accent focus:outline-none px-4 py-2.5 pl-10 pr-10 text-xs font-mono rounded-none text-slate-800 placeholder-slate-400 transition-colors"
        />
        <div className="absolute left-3.5 text-slate-400">
          <Search className="w-3.5 h-3.5" />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
