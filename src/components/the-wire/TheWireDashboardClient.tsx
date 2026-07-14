"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ToastProvider, useToast } from "@/components/notifications/ToastProvider";
import {
  TrendingUp, TrendingDown, Newspaper, Clock, ExternalLink,
  ChevronDown, ChevronUp, Filter, AlertCircle, Zap, Calendar,
  RefreshCw, BookOpen, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import type { NewsItem } from "@/lib/news";
import ReactMarkdown from "react-markdown";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DailyBrief {
  id: string;
  subject: string;
  content_text: string;
  type: string;
  created_at: string;
}

interface Tick {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePct: number;
}

interface CalendarEvent {
  event: string;
  country: string;
  impact: "high" | "medium" | "low";
  actual: string | null;
  estimate: string | null;
  prev: string | null;
  time: number; // unix
}

interface Props {
  initialBriefs: DailyBrief[];
  initialNews: NewsItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatPrice(p: number, sym: string) {
  if (sym === "BTCUSD" || sym === "SPX500") return p.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (sym === "USDJPY") return p.toFixed(3);
  return p.toFixed(5);
}

function briefTag(created_at: string) {
  const h = new Date(created_at).getUTCHours();
  if (h < 12) return "// MORNING BRIEF";
  if (h < 18) return "// AFTERNOON BRIEF";
  return "// EVENING BRIEF";
}

const CATEGORIES = ["ALL", "FOREX", "UK", "US", "CRYPTO", "COMMODITIES"] as const;
type Category = typeof CATEGORIES[number];

const CAT_MAP: Record<Category, string[]> = {
  ALL: [],
  FOREX: ["forex"],
  UK: ["uk-markets"],
  US: ["us-markets"],
  CRYPTO: ["crypto"],
  COMMODITIES: ["commodities"],
};

const IMPACT_STYLE: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-gray-100 text-gray-500 border-gray-200",
};

// ─── Inner component (uses useToast) ─────────────────────────────────────────

function WireInner({ initialBriefs, initialNews }: Props) {
  const { addToast } = useToast();

  // Market ticker
  const [ticks, setTicks] = useState<Tick[]>([]);
  const prevTicks = useRef<Map<string, number>>(new Map());

  // Briefs
  const [briefs] = useState<DailyBrief[]>(initialBriefs);
  const [expandedBrief, setExpandedBrief] = useState<string | null>(
    initialBriefs[0]?.id ?? null
  );

  // News
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [category, setCategory] = useState<Category>("ALL");
  const [loadingNews, setLoadingNews] = useState(false);
  const [aiExplain, setAiExplain] = useState<Record<number, { loading: boolean; text: string }>>({});

  // Calendar
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [loadingCal, setLoadingCal] = useState(true);

  // ── Ticker poll ──────────────────────────────────────────────────────────
  const fetchTicks = useCallback(async () => {
    try {
      const res = await fetch("/api/the-wire/snapshot");
      if (!res.ok) return;
      const data: Tick[] = await res.json();
      setTicks((prev) => {
        // Flash detection — handled via prevTicks ref
        data.forEach((t) => {
          const old = prevTicks.current.get(t.symbol);
          if (old !== undefined && old !== t.price) {
            prevTicks.current.set(t.symbol, t.price);
          } else {
            prevTicks.current.set(t.symbol, t.price);
          }
        });
        return data;
      });
    } catch {}
  }, []);

  useEffect(() => {
    fetchTicks();
    const iv = setInterval(fetchTicks, 30_000);
    return () => clearInterval(iv);
  }, [fetchTicks]);

  // ── News poll ────────────────────────────────────────────────────────────
  const fetchNews = useCallback(async (silent = true) => {
    if (!silent) setLoadingNews(true);
    try {
      const res = await fetch("/api/news/feed");
      if (!res.ok) return;
      const fresh: NewsItem[] = await res.json();
      setNews((prev) => {
        // Detect new high-impact articles
        const prevUrls = new Set(prev.map((a) => a.url));
        const newItems = fresh.filter((a) => !prevUrls.has(a.url));
        const highImpact = newItems.filter(
          (a) =>
            a.categories.includes("forex") ||
            a.categories.includes("uk-markets") ||
            a.categories.includes("us-markets")
        );
        if (highImpact.length > 0) {
          addToast({
            type: "news",
            title: highImpact[0].title,
            body: `${highImpact[0].source} · ${highImpact.length > 1 ? `+${highImpact.length - 1} more` : ""}`,
          });
        }
        return fresh;
      });
    } catch {} finally {
      setLoadingNews(false);
    }
  }, [addToast]);

  useEffect(() => {
    const iv = setInterval(() => fetchNews(true), 180_000); // every 3 min
    return () => clearInterval(iv);
  }, [fetchNews]);

  // ── Calendar ─────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/market/calendar");
        if (!res.ok) return;
        const raw = await res.json();
        const events: CalendarEvent[] = (Array.isArray(raw) ? raw : raw.economicCalendar ?? [])
          .filter((e: any) => e.impact === "high" || e.impact === "medium")
          .slice(0, 20);
        setCalEvents(events);
      } catch {} finally {
        setLoadingCal(false);
      }
    })();
  }, []);

  // ── AI Explain ───────────────────────────────────────────────────────────
  const handleAIExplain = useCallback(async (idx: number, item: NewsItem) => {
    if (aiExplain[idx]?.text) {
      // Toggle off
      setAiExplain((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      return;
    }
    setAiExplain((prev) => ({ ...prev, [idx]: { loading: true, text: "" } }));
    try {
      const res = await fetch("/api/ai/explain-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });
      const data = await res.json();
      setAiExplain((prev) => ({
        ...prev,
        [idx]: { loading: false, text: data.explanation ?? data.text ?? "No explanation available." },
      }));
    } catch {
      setAiExplain((prev) => ({ ...prev, [idx]: { loading: false, text: "Failed to load explanation." } }));
    }
  }, [aiExplain]);

  // ── Filtered news ────────────────────────────────────────────────────────
  const filteredNews = news.filter((a) => {
    if (category === "ALL") return true;
    const cats = CAT_MAP[category];
    return cats.some((c) => a.categories.includes(c));
  });

  // ── Calendar countdown ───────────────────────────────────────────────────
  const nextHighEvent = calEvents.find(
    (e) => e.impact === "high" && e.time * 1000 > Date.now()
  );

  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!nextHighEvent) return;
    const tick = () => {
      const diff = nextHighEvent.time * 1000 - Date.now();
      if (diff < 0) { setCountdown("Now"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${h > 0 ? `${h}h ` : ""}${m}m ${s}s`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [nextHighEvent]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-8">

      {/* ── Market Ticker Bar ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm overflow-hidden">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
          <span className="text-[9px] font-mono uppercase tracking-widest text-gray-400 shrink-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Live
          </span>
          {ticks.length === 0 ? (
            <span className="text-[10px] font-mono text-gray-300">Loading prices…</span>
          ) : (
            ticks.map((t) => {
              const up = t.changePct >= 0;
              return (
                <div key={t.symbol} className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">{t.label}</span>
                  <span className="text-[11px] font-mono font-black text-gray-900">{formatPrice(t.price, t.symbol)}</span>
                  <span className={cn(
                    "flex items-center gap-0.5 text-[9px] font-mono font-bold",
                    up ? "text-emerald-600" : "text-red-500"
                  )}>
                    {up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {up ? "+" : ""}{t.changePct.toFixed(2)}%
                  </span>
                  <span className="text-gray-200">|</span>
                </div>
              );
            })
          )}
          <button onClick={fetchTicks} className="ml-auto shrink-0 text-gray-300 hover:text-teal-500 transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Next Event Countdown ───────────────────────────────────────────── */}
      {nextHighEvent && countdown && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-red-400 block">Next High-Impact Event</span>
              <span className="text-xs font-bold text-red-700">{nextHighEvent.event} · {nextHighEvent.country}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[9px] font-mono uppercase tracking-widest text-red-400 block">Time Remaining</span>
            <span className="text-sm font-mono font-black text-red-600 tabular-nums">{countdown}</span>
          </div>
        </div>
      )}

      {/* ── Main Grid: Briefs (left) + News (right) ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

        {/* ── Left: Intelligence Briefs ──────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-teal-500 font-mono text-[9px] uppercase tracking-widest block mb-0.5">// Briefs</span>
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wide">Intelligence Briefs</h2>
            </div>
            <span className="text-[9px] font-mono text-gray-400">{briefs.length} briefs</span>
          </div>

          {briefs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <BookOpen className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-mono text-gray-400">No briefs yet today</p>
              <p className="text-[11px] text-gray-300 mt-1">Morning briefs publish at 07:00 GMT</p>
            </div>
          ) : (
            briefs.map((brief) => {
              const isExpanded = expandedBrief === brief.id;
              const tag = briefTag(brief.created_at);
              // Use subject as title and content_text as content
              const title = brief.subject || "Intelligence Brief";
              const content = brief.content_text || "";

              return (
                <div
                  key={brief.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Brief header */}
                  <button
                    onClick={() => setExpandedBrief(isExpanded ? null : brief.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-teal-500 font-mono text-[9px] uppercase tracking-widest">{tag}</span>
                        <span className="text-[9px] font-mono text-gray-300">
                          <Clock className="w-2.5 h-2.5 inline mr-0.5" />
                          {timeAgo(brief.created_at)}
                        </span>
                      </div>
                      <h3 className="text-sm font-display font-bold text-gray-900 leading-snug line-clamp-2">
                        {title || "Intelligence Brief"}
                      </h3>
                    </div>
                    <div className="shrink-0 mt-1">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                      }
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && content && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="prose prose-sm prose-gray max-w-none pt-4 text-[13px] leading-relaxed font-mono
                        prose-headings:font-display prose-headings:text-gray-900 prose-headings:text-xs prose-headings:uppercase prose-headings:tracking-wide prose-headings:mt-4 prose-headings:mb-2
                        prose-strong:text-gray-900 prose-strong:font-bold
                        prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-3
                        prose-ul:text-gray-600 prose-li:text-[12px]
                        prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                      <div className="pt-4 border-t border-gray-100 mt-4">
                        <span className="text-[10px] font-mono text-gray-300">
                          {new Date(brief.created_at).toLocaleString("en-GB", {
                            weekday: "short", day: "numeric", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })} GMT
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Right: Live News Feed ──────────────────────────────────────── */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-teal-500 font-mono text-[9px] uppercase tracking-widest block mb-0.5">// Feed</span>
              <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wide">Live News</h2>
            </div>
            <button
              onClick={() => fetchNews(false)}
              disabled={loadingNews}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-widest border border-gray-200 rounded-xl hover:border-teal-400 hover:text-teal-600 transition-all disabled:opacity-50"
            >
              <RefreshCw className={cn("w-3 h-3", loadingNews && "animate-spin")} />
              Refresh
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-lg border transition-all",
                  category === cat
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:border-teal-300 hover:text-teal-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News cards */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
            {filteredNews.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <Filter className="w-6 h-6 text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-mono text-gray-400">No articles in this category</p>
              </div>
            ) : (
              filteredNews.map((article, idx) => {
                const explain = aiExplain[idx];
                return (
                  <div key={`${article.url}-${idx}`} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-150 group">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Source + time */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[8px] font-mono font-bold bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded uppercase">
                              {article.source}
                            </span>
                            {article.categories.slice(0, 2).map((cat) => (
                              <span key={cat} className="text-[8px] font-mono bg-teal-50 text-teal-600 border border-teal-100 px-1.5 py-0.5 rounded uppercase">
                                {cat.replace("-", " ")}
                              </span>
                            ))}
                            <span className="text-[9px] font-mono text-gray-300 ml-auto shrink-0">
                              {timeAgo(article.publishedAt)}
                            </span>
                          </div>

                          {/* Headline */}
                          <h3 className="text-[13px] font-bold text-gray-900 leading-snug mb-1.5 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>

                        {/* Thumbnail */}
                        {article.imageUrl && (
                          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={article.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleAIExplain(idx, article)}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-lg border transition-all",
                            explain?.text
                              ? "bg-teal-500 text-white border-teal-500"
                              : "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-500 hover:text-white hover:border-teal-500"
                          )}
                          disabled={explain?.loading}
                        >
                          <Zap className={cn("w-2.5 h-2.5", explain?.loading && "animate-pulse")} />
                          {explain?.loading ? "Analysing…" : explain?.text ? "Hide AI" : "AI Explain"}
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono font-bold uppercase bg-gray-50 text-gray-500 border border-gray-200 rounded-lg hover:border-gray-400 transition-all"
                        >
                          Read Article
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* AI Explanation panel */}
                    {(explain?.loading || explain?.text) && (
                      <div className="px-4 pb-4">
                        <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5">
                          {explain.loading ? (
                            <div className="flex items-center gap-2">
                              <Zap className="w-3 h-3 text-teal-500 animate-pulse" />
                              <span className="text-[10px] font-mono text-teal-600">AI is analysing market impact…</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Zap className="w-3 h-3 text-teal-500" />
                                <span className="text-[9px] font-mono font-bold text-teal-600 uppercase tracking-widest">AI Market Analysis</span>
                              </div>
                              <p className="text-[11px] text-gray-700 leading-relaxed font-mono whitespace-pre-wrap">{explain.text}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Economic Calendar ──────────────────────────────────────────────── */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <span className="text-teal-500 font-mono text-[9px] uppercase tracking-widest block mb-0.5">// Events</span>
            <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wide">Economic Calendar</h2>
            <p className="text-[9px] font-mono text-text-tertiary">High and medium impact events — live from Finnhub</p>
          </div>
        </div>

        {loadingCal ? (
          <div className="flex items-center gap-2 py-8 justify-center">
            <RefreshCw className="w-4 h-4 text-gray-300 animate-spin" />
            <span className="text-xs font-mono text-gray-300">Loading calendar…</span>
          </div>
        ) : calEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm font-mono text-gray-400">No upcoming high-impact events</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Time (UTC)", "Event", "Country", "Impact", "Previous", "Estimate", "Actual"].map((h) => (
                    <th key={h} className="text-left text-[9px] font-mono uppercase tracking-widest text-gray-400 pb-3 pr-4 first:pl-0">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {calEvents.map((ev, i) => {
                  const dt = new Date(ev.time * 1000);
                  const isPast = dt < new Date();
                  return (
                    <tr key={i} className={cn("hover:bg-gray-50 transition-colors", isPast && "opacity-50")}>
                      <td className="py-3 pr-4 text-[10px] font-mono text-gray-500 tabular-nums whitespace-nowrap">
                        {dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        <span className="text-[9px] text-gray-300 block">
                          {dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[11px] font-bold text-gray-800 max-w-[200px]">
                        {ev.event}
                      </td>
                      <td className="py-3 pr-4 text-[10px] font-mono text-gray-500">{ev.country}</td>
                      <td className="py-3 pr-4">
                        <span className={cn("text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border", IMPACT_STYLE[ev.impact] ?? IMPACT_STYLE.low)}>
                          {ev.impact}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-[10px] font-mono text-gray-500 tabular-nums">{ev.prev ?? "—"}</td>
                      <td className="py-3 pr-4 text-[10px] font-mono text-gray-500 tabular-nums">{ev.estimate ?? "—"}</td>
                      <td className="py-3 text-[10px] font-mono font-bold tabular-nums">
                        <span className={cn(
                          ev.actual ? (
                            ev.estimate && parseFloat(ev.actual) > parseFloat(ev.estimate)
                              ? "text-emerald-600" : "text-red-500"
                          ) : "text-gray-300"
                        )}>
                          {ev.actual ?? "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Exported wrapper (provides toast context) ────────────────────────────────

export function TheWireDashboardClient(props: Props) {
  return (
    <ToastProvider>
      <WireInner {...props} />
    </ToastProvider>
  );
}
