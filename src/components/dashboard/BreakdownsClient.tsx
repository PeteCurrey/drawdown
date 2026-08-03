"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Calendar, 
  CheckSquare, 
  Search, 
  Maximize2, 
  Minimize2, 
  TrendingUp, 
  BookOpen, 
  Bookmark, 
  Clock,
  FileText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, Badge } from "@/components/dashboard/ui/primitives";
import { TradingViewWidget } from "@/components/dashboard/TradingViewWidget";
import { TradingViewCalendar } from "@/components/markets/TradingViewCalendar";

interface Breakdown {
  id: string;
  title: string;
  video_url: string | null;
  summary_md: string | null;
  week_of: string;
  published_at: string;
  tier_required?: string;
  created_at?: string;
}

interface BreakdownsClientProps {
  initialBreakdowns: Breakdown[];
  userTier?: string;
}

export default function BreakdownsClient({ initialBreakdowns, userTier = "foundation" }: BreakdownsClientProps) {
  const hasBreakdowns = initialBreakdowns && initialBreakdowns.length > 0;
  
  // Active breakdown state (default to latest)
  const [activeBreakdown, setActiveBreakdown] = useState<Breakdown | null>(
    hasBreakdowns ? initialBreakdowns[0] : null
  );

  // Layout states
  const [activeTab, setActiveTab] = useState<"video" | "notes" | "charts" | "calendar">("video");
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);

  // Notepad state
  const [personalNotes, setPersonalNotes] = useState<string>("");
  const [notesSavedStatus, setNotesSavedStatus] = useState<"Saved" | "Saving..." | "Idle">("Idle");

  // Checklist state
  const [checklist, setChecklist] = useState<{ id: string; text: string; checked: boolean }[]>([
    { id: "watch-video", text: "Watch Pete's Weekly Bias Session & Note Key Levels", checked: false },
    { id: "align-bias", text: "Align your daily directional bias with the weekly macro trend", checked: false },
    { id: "check-news", text: "Mark out High-Impact (Red Folder) economic events on your calendar", checked: false },
    { id: "liquidity-zones", text: "Mark buy-side and sell-side liquidity pools on your personal charts", checked: false },
    { id: "define-risk", text: "Define max trade risk percentage & weekly drawdown threshold", checked: false },
    { id: "journal-goals", text: "Log weekly objectives and session plan in your Trading Journal", checked: false }
  ]);

  // TradingView Symbol State
  const [selectedSymbol, setSelectedSymbol] = useState<string>("GBPUSD");

  // Filter/Search states for Archive
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const videoRef = useRef<HTMLDivElement>(null);

  // ── Local Storage Load/Save ──────────────────────────────────────────────────
  useEffect(() => {
    // Load onboarding preference
    const savedOnboarding = localStorage.getItem("drawdown_breakdowns_onboarding_hide");
    if (savedOnboarding === "true") setShowOnboarding(false);

    // Load checklist
    const savedChecklist = localStorage.getItem("drawdown_breakdowns_checklist_v2");
    if (savedChecklist) {
      try {
        setChecklist(JSON.parse(savedChecklist));
      } catch (e) {
        console.error("Error loading checklist", e);
      }
    }

    // Load personal notes
    const savedNotes = localStorage.getItem("drawdown_breakdowns_notepad_v2");
    if (savedNotes) setPersonalNotes(savedNotes);
  }, []);

  // Sync checklist changes
  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
    localStorage.setItem("drawdown_breakdowns_checklist_v2", JSON.stringify(updated));
  };

  // Sync personal notes (autosave with slight delay mimicking debouncer)
  useEffect(() => {
    if (personalNotes === "") return;
    setNotesSavedStatus("Saving...");
    const timeout = setTimeout(() => {
      localStorage.setItem("drawdown_breakdowns_notepad_v2", personalNotes);
      setNotesSavedStatus("Saved");
      const clearStatus = setTimeout(() => setNotesSavedStatus("Idle"), 2000);
      return () => clearTimeout(clearStatus);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [personalNotes]);

  // Trigger immediate save of notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPersonalNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    localStorage.setItem("drawdown_breakdowns_notepad_v2", personalNotes);
    setNotesSavedStatus("Saved");
    setTimeout(() => setNotesSavedStatus("Idle"), 2000);
  };

  // Calculate Checklist Progress
  const completedCount = checklist.filter(item => item.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Scroll helper to video block
  const handleSelectBreakdown = (b: Breakdown) => {
    setActiveBreakdown(b);
    setActiveTab("video");
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // ── Tag Categories & Searches ───────────────────────────────────────────────
  // Quick dynamic tag determination based on titles/summaries
  const getCategories = (b: Breakdown): string[] => {
    const categories = ["Macro"];
    const text = `${b.title} ${b.summary_md || ""}`.toLowerCase();
    if (text.includes("forex") || text.includes("usd") || text.includes("gbp") || text.includes("eur") || text.includes("dxy")) categories.push("Forex");
    if (text.includes("spx") || text.includes("nasdaq") || text.includes("indices") || text.includes("ftse") || text.includes("dax")) categories.push("Indices");
    if (text.includes("crypto") || text.includes("btc") || text.includes("eth")) categories.push("Crypto");
    if (text.includes("education") || text.includes("tutorial") || text.includes("rules") || text.includes("bias")) categories.push("Education");
    return categories;
  };

  const filteredPastBreakdowns = initialBreakdowns.filter(b => {
    const text = `${b.title} ${b.summary_md || ""}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    
    if (selectedTag === "all") return matchesSearch;
    const categories = getCategories(b).map(c => c.toLowerCase());
    return matchesSearch && categories.includes(selectedTag.toLowerCase());
  });

  // Format Date beautifully
  const formatBreakdownDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper to extract YouTube video ID or construct embed source URL
  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    
    // Support youtube shorts, standard watch, and embed formats
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      } else if (url.includes("shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0] || "";
      }
      return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
    }

    if (url.includes("vimeo.com")) {
      const vimeoId = url.split("vimeo.com/")[1]?.split("?")[0] || "";
      return `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
    }

    return url;
  };

  const activeVideoUrl = activeBreakdown ? getEmbedUrl(activeBreakdown.video_url) : "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── 1. ONBOARDING / INTRO EXPLANATION BANNER ─────────────────────────── */}
      {showOnboarding && (
        <div className="relative overflow-hidden rounded-2xl border border-[#F9771D]/10 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-6 md:p-8 text-white shadow-lg animate-in slide-in-from-top-4 duration-500">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#F9771D]/10 blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 -mb-20 w-48 h-48 rounded-full bg-blue-500/5 blur-3xl pointer-events-none"></div>
          
          <button 
            onClick={() => {
              setShowOnboarding(false);
              localStorage.setItem("drawdown_breakdowns_onboarding_hide", "true");
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            title="Dismiss introductory instructions"
          >
            <span className="text-xs font-mono tracking-wider hover:underline uppercase">✕ Close</span>
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F9771D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F9771D]"></span>
                </span>
                <Badge variant="accent">Weekly Pre-Market Intelligence</Badge>
                <span className="text-xs font-mono text-gray-400">Available on Foundation & above</span>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                Unlock Pete's Macro Playbook For The Week Ahead
              </h2>
              
              <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
                Every Sunday evening at <strong>6:00 PM GMT</strong>, Pete publishes an in-depth video session mapping the weekly bias. 
                Use this terminal to align your directional outlook, examine macroeconomic context, review key structural targets, 
                and construct a disciplined execution watchlist.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-[#F9771D]/20 flex items-center justify-center text-[#F9771D] font-bold text-xs font-mono">1</div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Top-Down Macro</h4>
                    <p className="text-[10px] text-gray-400">DXY analysis & central bank sentiment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs font-mono">2</div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Liquidity Mapping</h4>
                    <p className="text-[10px] text-gray-400">Marking key buy-side & sell-side zones</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs font-mono">3</div>
                  <div>
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider">Watchlist & Levels</h4>
                    <p className="text-[10px] text-gray-400">Concrete trading setups for your week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. ACTIVE PREPARATION TERMINAL WORKSPACE ─────────────────────────── */}
      {hasBreakdowns && activeBreakdown ? (
        <div ref={videoRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT CONTAINER (70% WIDTH ON LARGE): TABBED WORKSPACE & VIDEO PLAYER */}
          <div className={`${theaterMode ? "lg:col-span-3" : "lg:col-span-2"} space-y-6 transition-all duration-500`}>
            
            {/* Header with video details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#DEDDD8] p-5 rounded-2xl shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-xs text-text-tertiary">
                  <Calendar className="w-3.5 h-3.5 text-[#F9771D]" />
                  <span className="font-mono font-bold uppercase tracking-wider text-gray-500">
                    WEEK OF {formatBreakdownDate(activeBreakdown.week_of)}
                  </span>
                  {activeBreakdown.id === initialBreakdowns[0].id && (
                    <span className="bg-[#F9771D]/10 text-[#F9771D] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ml-1">LATEST RELEASE</span>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-bold text-[#1A1A1A] tracking-tight">{activeBreakdown.title}</h2>
              </div>

              {/* Tabs buttons */}
              <div className="flex flex-wrap gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-1.5 self-start sm:self-center shrink-0">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all ${
                    activeTab === "video" ? "bg-white text-[#1A1A1A] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Play className="w-3.5 h-3.5" /> Video
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all ${
                    activeTab === "notes" ? "bg-white text-[#1A1A1A] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Playbook
                </button>
                <button
                  onClick={() => setActiveTab("charts")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all ${
                    activeTab === "charts" ? "bg-white text-[#1A1A1A] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Charts
                </button>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all ${
                    activeTab === "calendar" ? "bg-white text-[#1A1A1A] shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> News
                </button>
              </div>
            </div>

            {/* Main view container based on tabs */}
            <div className="bg-white border border-[#DEDDD8] rounded-2xl overflow-hidden shadow-sm">
              
              {/* TAB 1: VIDEO SESSION */}
              {activeTab === "video" && (
                <div className="space-y-0">
                  <div className="aspect-video w-full bg-black relative group">
                    {activeBreakdown.video_url ? (
                      <iframe
                        src={activeVideoUrl}
                        className="w-full h-full border-0 absolute inset-0"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                        <span className="text-gray-400 text-sm font-mono uppercase tracking-widest">Video is processing...</span>
                      </div>
                    )}
                    
                    {/* Theater mode floating control bar */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-2">
                      <button
                        onClick={() => setTheaterMode(!theaterMode)}
                        className="bg-black/80 hover:bg-black border border-white/20 text-white rounded-lg p-2 flex items-center gap-1.5 text-xs font-mono uppercase font-bold transition-all backdrop-blur-sm"
                        title={theaterMode ? "Normal Mode" : "Theater Mode"}
                      >
                        {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        <span>{theaterMode ? "Collapse View" : "Theater Mode"}</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Subtle video meta-actions */}
                  <div className="bg-gray-50 border-t border-[#DEDDD8] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap gap-2 items-center text-gray-500">
                      <span className="font-mono">Active Bias:</span>
                      <span className="bg-emerald-500/10 text-emerald-600 font-mono font-bold px-2 py-0.5 rounded uppercase">BULLISH DXY</span>
                      <span className="bg-amber-500/10 text-amber-600 font-mono font-bold px-2 py-0.5 rounded uppercase">H4 LIQUIDITY SWEEP</span>
                    </div>
                    <button 
                      onClick={() => setTheaterMode(!theaterMode)}
                      className="text-gray-600 hover:text-black font-mono flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider"
                    >
                      {theaterMode ? "Collapse Video" : "Theater / Expand Mode"}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PLAYBOOK DETAILED NOTES */}
              {activeTab === "notes" && (
                <div className="p-6 md:p-8 space-y-6 max-h-[600px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <h3 className="font-display font-bold uppercase text-lg text-text-primary tracking-tight flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#F9771D]" /> Pete's Pre-Session Playbook
                    </h3>
                    <Badge variant="accent">Week of {formatShortDate(activeBreakdown.week_of)}</Badge>
                  </div>

                  {activeBreakdown.summary_md ? (
                    <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-a:text-[#F9771D] prose-blockquote:border-l-4 prose-blockquote:border-[#F9771D] prose-blockquote:bg-gray-50 prose-blockquote:p-4 text-text-primary leading-relaxed">
                      <ReactMarkdown>{activeBreakdown.summary_md}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-gray-400 font-mono">
                      No playbook markdown notes provided for this week's session.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TRADINGVIEW LIVE TERMINAL */}
              {activeTab === "charts" && (
                <div className="space-y-0">
                  {/* Symbol Selector Bar */}
                  <div className="bg-gray-50 border-b border-[#DEDDD8] px-4 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200">
                    <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mr-2 shrink-0">MARKET TERMINAL:</span>
                    {["GBPUSD", "EURUSD", "DXY", "SPX", "XAUUSD", "BTCUSD"].map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setSelectedSymbol(sym)}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-all tracking-wider shrink-0 ${
                          selectedSymbol === sym 
                            ? "bg-[#1A1A1A] text-white" 
                            : "bg-white hover:bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {sym === "DXY" ? "DXY (USD INDEX)" : sym === "SPX" ? "S&P 500 (SPX)" : sym === "XAUUSD" ? "GOLD (XAU)" : sym}
                      </button>
                    ))}
                  </div>

                  {/* TradingView Widget Wrapper */}
                  <div className="h-[520px] w-full bg-gray-50">
                    <TradingViewWidget 
                      symbol={
                        selectedSymbol === "DXY" ? "INDEX:DXY" :
                        selectedSymbol === "GBPUSD" ? "FX:GBPUSD" :
                        selectedSymbol === "EURUSD" ? "FX:EURUSD" :
                        selectedSymbol === "SPX" ? "SP:SPX" :
                        selectedSymbol === "XAUUSD" ? "TVC:GOLD" :
                        selectedSymbol === "BTCUSD" ? "BINANCE:BTCUSDT" : "FX:GBPUSD"
                      }
                      interval="240"
                      theme="light"
                      height={520}
                      containerId="breakdowns_live_terminal"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ECONOMIC CALENDAR */}
              {activeTab === "calendar" && (
                <div className="p-0">
                  <div className="bg-gray-50 border-b border-[#DEDDD8] px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-mono font-bold text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F9771D]" /> High-Impact Weekly Event Calendar
                      </h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">Filtered for G7 currencies to avoid low-volatility clutter.</p>
                    </div>
                    <Badge variant="profit">LIVE VOLATILITY</Badge>
                  </div>
                  
                  {/* Embed tradingview calendar */}
                  <div className="h-[550px] w-full bg-white relative">
                    <TradingViewCalendar countryFilter="us,gb,eu,jp,ca,ch,au" className="h-[550px]" />
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT CONTAINER (30% WIDTH): PRE-MARKET ROUTINE & WATCHLIST WRITER */}
          <div className={`${theaterMode ? "lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8" : "lg:col-span-1"} space-y-6 transition-all duration-500`}>
            
            {/* ── 2A. INTERACTIVE PRE-MARKET ROUTINE CHECKLIST ─────────────────── */}
            <Card className="border border-[#DEDDD8] p-6 space-y-4 shadow-sm bg-white rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4">
                <CheckSquare className="w-32 h-32 text-gray-900" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold uppercase text-xs tracking-widest text-[#1A1A1A] flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-[#F9771D]" /> PRE-MARKET PREP ROUTINE
                  </h3>
                  <Badge variant="accent" size="sm">{progressPercent}% DONE</Badge>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Disciplined routines make professional traders. Log yours weekly.</p>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-gray-600">
                  <span>WEEKLY COMPLETED STEPS</span>
                  <span>{completedCount} / {checklist.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#F9771D] to-[#F9771D]/80 h-full transition-all duration-500 rounded-full" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-3 pt-2">
                {checklist.map((item) => (
                  <label 
                    key={item.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      item.checked 
                        ? "bg-gray-50/50 border-gray-200 text-gray-500 line-through" 
                        : "bg-white hover:bg-gray-50/40 border-gray-200/80 text-gray-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#F9771D] focus:ring-[#F9771D] accent-[#F9771D]"
                    />
                    <span className="text-xs leading-normal font-mono select-none">{item.text}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* ── 2B. PERSONAL TRADING JOURNAL / WATCHLIST NOTEPAD ─────────────── */}
            <Card className="border border-[#DEDDD8] p-6 space-y-4 shadow-sm bg-white rounded-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold uppercase text-xs tracking-widest text-[#1A1A1A] flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#F9771D]" /> MY LEVELS & WATCHLIST
                  </h3>
                  
                  {/* Saving status indicator */}
                  <span className="text-[10px] font-mono text-gray-400">
                    {notesSavedStatus === "Saving..." ? (
                      <span className="text-[#F9771D] font-bold animate-pulse">● Autosaving...</span>
                    ) : notesSavedStatus === "Saved" ? (
                      <span className="text-emerald-500 font-bold">✓ Saved Locally</span>
                    ) : (
                      <span>Auto-saves locally</span>
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Draft your targets, Daily Biases, and high-interest levels below.</p>
              </div>

              {/* Textarea notepad */}
              <div className="relative">
                <textarea
                  value={personalNotes}
                  onChange={handleNotesChange}
                  onBlur={handleNotesBlur}
                  placeholder={`// Focus Watchlist\n// Daily Bias (EURUSD, GBPUSD, DXY)\n// Pete's Key Levels to respect\n// Personal notes on economic volatility...`}
                  className="w-full h-56 p-4 bg-gray-950 border border-gray-800 text-gray-100 font-mono text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-[#F9771D]/40 placeholder:text-gray-700 leading-relaxed resize-none shadow-inner"
                  spellCheck={false}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                <span>Markdown supported</span>
                <button
                  onClick={() => {
                    localStorage.setItem("drawdown_breakdowns_notepad_v2", personalNotes);
                    setNotesSavedStatus("Saved");
                    setTimeout(() => setNotesSavedStatus("Idle"), 2000);
                  }}
                  className="hover:text-[#F9771D] transition-colors uppercase font-bold"
                >
                  Force Save Notes
                </button>
              </div>
            </Card>

          </div>
        </div>
      ) : null}

      {/* ── 3. HISTORICAL ARCHIVE GRID (SEARCH & FILTERS) ────────────────────── */}
      {hasBreakdowns && initialBreakdowns.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-[#DEDDD8]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold font-mono text-[#6b7280] uppercase tracking-widest">Historical Playbook Archives</h2>
              <p className="text-xs text-[#555550] mt-1">Review Pete's past biases and see how structural targets played out over time.</p>
            </div>

            {/* Interactive Search Bar & Tag Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search past playbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#DEDDD8] rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#F9771D]/40 shadow-sm placeholder:text-gray-400"
                />
              </div>

              {/* Topic Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap bg-white border border-[#DEDDD8] rounded-xl p-1 shadow-sm">
                {[
                  { value: "all", label: "ALL" },
                  { value: "forex", label: "FOREX" },
                  { value: "indices", label: "INDICES" },
                  { value: "crypto", label: "CRYPTO" },
                  { value: "education", label: "EDUCATION" }
                ].map((tag) => (
                  <button
                    key={tag.value}
                    onClick={() => setSelectedTag(tag.value)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider uppercase transition-all ${
                      selectedTag === tag.value 
                        ? "bg-[#F9771D] text-white" 
                        : "text-gray-500 hover:text-gray-900 bg-transparent"
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Past Breakdowns Grid */}
          {filteredPastBreakdowns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPastBreakdowns.map((b) => {
                const isActive = activeBreakdown && activeBreakdown.id === b.id;
                const categories = getCategories(b);

                return (
                  <div 
                    key={b.id} 
                    onClick={() => handleSelectBreakdown(b)}
                    className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                      isActive 
                        ? "bg-[#F9771D]/5 border-[#F9771D] shadow-[0_4px_16px_rgba(249,119,29,0.08)] ring-1 ring-[#F9771D]/20" 
                        : "bg-white border-[#e5e7eb] hover:border-gray-300 hover:shadow-md hover:-translate-y-1"
                    }`}
                  >
                    <div className="relative">
                      {/* Video Thumbnail Simulation */}
                      <div className="aspect-video w-full bg-gray-950 relative flex items-center justify-center overflow-hidden">
                        {b.video_url && b.video_url.includes("v=") ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity" 
                            style={{ 
                              backgroundImage: `url(https://img.youtube.com/vi/${b.video_url.split('v=')[1]?.split('&')[0]}/hqdefault.jpg)` 
                            }}
                          ></div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-slate-800 opacity-60"></div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                        {/* Interactive Play Button Badge */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all z-10 ${
                          isActive 
                            ? "bg-[#F9771D] border-[#F9771D] text-white scale-110" 
                            : "bg-white/10 border-white/20 text-white backdrop-blur-md group-hover:bg-white group-hover:text-black group-hover:scale-105"
                        }`}>
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>

                        {/* Active playing indicator overlays */}
                        {isActive && (
                          <div className="absolute top-3 right-3 bg-[#F9771D] text-white text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="flex h-1.5 w-1.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                            </span>
                            Watching Now
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          <span>WEEK OF {formatShortDate(b.week_of)}</span>
                          <span className="text-gray-500 font-normal">G7 MACRO</span>
                        </div>
                        <h4 className={`font-display font-bold uppercase text-xs leading-snug group-hover:text-[#F9771D] transition-colors line-clamp-2 ${
                          isActive ? "text-[#F9771D]" : "text-[#1A1A1A]"
                        }`}>
                          {b.title}
                        </h4>
                      </div>

                      {/* Display Categories */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {categories.map((cat, i) => (
                          <span 
                            key={i} 
                            className="text-[8px] font-mono font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#DEDDD8] rounded-2xl py-12 text-center text-gray-500 font-mono text-xs">
              No historical playbooks matched your search criteria or tag filters.
            </div>
          )}
        </section>
      )}

    </div>
  );
}
