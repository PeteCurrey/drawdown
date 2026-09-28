"use client";

import React, { useState, useMemo } from "react";
import { 
  Play, 
  Search, 
  Clock, 
  ShieldCheck, 
  Video, 
  ChevronRight, 
  MonitorPlay,
  X,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export interface RecordedSession {
  id: string;
  title: string;
  description: string | null;
  video_url?: string | null;
  duration?: string | null;
  category: string;
  created_at: string;
}

interface LearnArchiveClientProps {
  initialSessions: RecordedSession[];
}

const CATEGORIES = ["All Sessions", "Strategy", "Mindset", "Journal", "Recap"];

function getEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/watch")) {
    const v = url.split("v=")[1]?.split("&")[0];
    return v ? `https://www.youtube.com/embed/${v}` : null;
  }
  if (url.includes("youtu.be/")) {
    const v = url.split("youtu.be/")[1]?.split("?")[0];
    return v ? `https://www.youtube.com/embed/${v}` : null;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return url;
}

export function LearnArchiveClient({ initialSessions }: LearnArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Sessions");
  const [activeSession, setActiveSession] = useState<RecordedSession | null>(null);

  const filteredSessions = useMemo(() => {
    return initialSessions.filter((s) => {
      const matchesCategory =
        selectedCategory === "All Sessions" ||
        s.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialSessions, selectedCategory, searchQuery]);

  return (
    <div
      className="space-y-12 animate-in fade-in duration-700 pb-24"
      style={{
        "--tool-accent": "#0891b2",
        "--tool-accent-hover": "#0e7490",
        "--tool-accent-tint": "#ecfeff",
        "--tool-accent-border": "#a5f3fc",
        "--tool-accent-text": "#155e75",
      } as React.CSSProperties}
    >
      <PageHeader
        eyebrow="// KNOWLEDGE VAULT v1.0"
        title="The Library"
        description="Archived live sessions, curriculum deep-dives, and mindset briefings."
        badge={
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A85]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH ARCHIVE..."
              className="w-full bg-white border border-[#DEDDD8] pl-10 pr-8 py-2.5 text-[10px] font-mono uppercase outline-none focus:border-[#1A1A1A] text-[#1A1A1A] rounded-xl transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8A85] hover:text-[#1A1A1A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        }
      />

      {/* Categories Bar */}
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
                active
                  ? "bg-[#181818] text-white border-[#181818] hover:bg-[#333330]"
                  : "border-[#DEDDD8] bg-white text-[#555550] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="group flex flex-col bg-white border border-[#DEDDD8] rounded-xl overflow-hidden hover:border-[#1A1A1A] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all cursor-pointer"
              onClick={() => setActiveSession(session)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#F3F2EE] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/0 transition-colors">
                  <div className="p-4 rounded-full bg-[#181818]/10 border border-[#181818]/20 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-[#1A1A1A] fill-[#1A1A1A]" />
                  </div>
                </div>
                {session.duration && (
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 border border-[#DEDDD8] text-[9px] font-mono text-[#1A1A1A] rounded-md shadow-sm">
                    {session.duration}
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#181818] text-white text-[8px] font-bold uppercase tracking-widest rounded-md">
                  {session.category}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-display font-bold uppercase tracking-tight mb-2 group-hover:text-accent transition-colors leading-tight text-[#1A1A1A]">
                    {session.title}
                  </h3>
                  <p className="text-xs text-[#666660] leading-relaxed line-clamp-2">
                    {session.description || "In-depth trading masterclass and live session archive."}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E8E6E1] flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-[#8A8A85] uppercase">
                    <Clock className="w-3 h-3" /> {new Date(session.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-[#1A1A1A] group-hover:text-accent transition-colors">
                    Watch Now <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#DEDDD8] rounded-xl space-y-3">
          <MonitorPlay className="w-10 h-10 text-[#8A8A85] mx-auto opacity-40" />
          <h4 className="text-sm font-bold uppercase text-[#1A1A1A]">
            {searchQuery || selectedCategory !== "All Sessions"
              ? "No Sessions Found"
              : "Vault Archive Up To Date"}
          </h4>
          <p className="text-xs text-[#666660] max-w-md mx-auto">
            {searchQuery || selectedCategory !== "All Sessions"
              ? `No recorded briefings matched your filter "${searchQuery || selectedCategory}". Try resetting your filter to view all available recordings.`
              : "Live sessions and curriculum briefings are uploaded following London and New York broadcasts. New recordings appear automatically."}
          </p>
          {(searchQuery || selectedCategory !== "All Sessions") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Sessions");
              }}
              className="mt-2 px-4 py-2 text-[10px] font-mono uppercase bg-[#181818] text-white rounded-lg hover:bg-[#333330]"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Featured Insight Section */}
      <section className="bg-white border border-[#DEDDD8] p-10 relative overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] group">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4 aspect-video bg-[#F3F2EE] flex items-center justify-center border border-[#DEDDD8] rounded-lg">
            <MonitorPlay className="w-12 h-12 text-[#1A1A1A] opacity-30" />
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-[#18B880]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Featured Briefing</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-[#1A1A1A]">
              The 2026 Institutional Road Map
            </h2>
            <p className="text-sm text-[#666660] leading-relaxed max-w-2xl">
              Pete's core framework for identifying premium liquidity clusters in the current market cycle. Essential viewing for anyone entering Phase 2 of the curriculum.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard/curriculum"
                className="px-6 py-3 bg-[#181818] hover:bg-[#333330] text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl shadow-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Go to Curriculum Modules
              </a>
              <a
                href="/dashboard/the-wire"
                className="px-6 py-3 bg-white border border-[#DEDDD8] hover:border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest transition-all rounded-xl shadow-sm"
              >
                View The Wire
              </a>
            </div>
          </div>
        </div>
        {/* Background Decor */}
        <Video className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 text-[#1A1A1A] opacity-[0.02] pointer-events-none group-hover:rotate-12 transition-transform duration-1000" />
      </section>

      {/* Video Modal Player */}
      {activeSession && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDDD8] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-[#181818] text-white text-[9px] font-bold uppercase tracking-wider rounded">
                  {activeSession.category}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-tight text-[#1A1A1A] line-clamp-1">
                  {activeSession.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                className="p-1 rounded-lg text-[#8A8A85] hover:text-[#1A1A1A] hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
              {getEmbedUrl(activeSession.video_url) ? (
                <iframe
                  src={getEmbedUrl(activeSession.video_url)!}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center text-white space-y-3">
                  <MonitorPlay className="w-12 h-12 mx-auto text-gray-500" />
                  <p className="text-sm font-mono uppercase tracking-wider text-gray-300">
                    Recording In Processing Queue
                  </p>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    The master replay for this session is undergoing transcode and will be attached shortly.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 space-y-2 bg-[#FAFAF9] border-t border-[#E8E6E1]">
              <div className="flex items-center justify-between text-xs text-[#8A8A85] font-mono">
                <span>{new Date(activeSession.created_at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</span>
                {activeSession.duration && <span>Duration: {activeSession.duration}</span>}
              </div>
              <p className="text-xs text-[#555550] leading-relaxed">
                {activeSession.description || "Archived masterclass from Pete's trading desk."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
