"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Settings, Sliders, Bell, ExternalLink, ArrowRight, Bookmark } from "lucide-react";
import type { PersonalLobbyFeed, UserLobbyPreferences } from "../../types/lobby-personalisation";
import { LobbyImage } from "./LobbyImage";
import { BookmarkButton } from "./BookmarkButton";
import { categoryToSlug } from "../../lib/lobby-constants";

interface YourLobbyFeedProps {
  feed: PersonalLobbyFeed;
  userPreferences: UserLobbyPreferences;
  onRefresh?: () => void;
}

export function YourLobbyFeed({ feed, userPreferences }: YourLobbyFeedProps) {
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState<UserLobbyPreferences>(userPreferences);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Group stories by interest area
  const brokerStories = feed.curatedArticles.filter(a => a.category === "BROKERS" || a.article_type === "BROKER WATCH");
  const propFirmStories = feed.curatedArticles.filter(a => a.category === "PROP FIRMS" || a.article_type === "PROP FIRM WATCH");
  const platformStories = feed.curatedArticles.filter(a => a.category === "PLATFORMS" || a.article_type === "PLATFORM SPOTLIGHT");
  const mainFeedStories = feed.curatedArticles.filter(a => 
    !brokerStories.includes(a) && !propFirmStories.includes(a) && !platformStories.includes(a)
  );

  async function handleTogglePref(key: keyof UserLobbyPreferences, value: any) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    setSavingPrefs(true);
    try {
      await fetch("/api/lobby/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next)
      });
    } catch {
      // Revert if error
      setPrefs(prefs);
    } finally {
      setSavingPrefs(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* ─── GREETING & PERSONAL HEADER ─────────────────────────────────────── */}
      <div className="border-b-2 border-white pb-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1">
              {feed.greeting}, {feed.userName || 'Trader'}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              YOUR LOBBY
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/lobby/saved"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Saved Stories
            </Link>
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              Customise Feed
            </button>
          </div>
        </div>

        {/* Followed Tags Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-900">
          <span className="font-mono text-[10px] uppercase text-zinc-400 mr-2">
            YOUR WATCHLIST:
          </span>
          {feed.hasFollows ? (
            <>
              {feed.followedMarkets.map(m => (
                <span key={m} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {m}
                </span>
              ))}
              {feed.followedBrokers.map(b => (
                <span key={b} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-950/40 border border-blue-900/60 text-blue-300">
                  {b}
                </span>
              ))}
              {feed.followedPropFirms.map(pf => (
                <span key={pf} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-purple-950/40 border border-purple-900/60 text-purple-300">
                  {pf}
                </span>
              ))}
              {feed.followedPlatforms.map(p => (
                <span key={p} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950/40 border border-emerald-900/60 text-emerald-300">
                  {p}
                </span>
              ))}
            </>
          ) : (
            <span className="font-mono text-[11px] text-zinc-400">
              No custom watchlist configured yet. Showing editorial market feed. Click &quot;Customise Feed&quot; to follow markets, brokers & platforms.
            </span>
          )}
        </div>
      </div>

      {/* ─── PREFERENCES MODAL / DRAWER (IF EXPANDED) ────────────────────────── */}
      {showPreferences && (
        <div className="bg-zinc-900/80 border border-zinc-800 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-mono text-sm uppercase tracking-wider text-white font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Watchlist & Intelligence Preferences
            </h3>
            <button
              onClick={() => setShowPreferences(false)}
              className="font-mono text-xs text-zinc-400 hover:text-white"
            >
              [CLOSE]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="block font-mono text-xs uppercase text-zinc-400 mb-2">
                Followed Markets (e.g. FOREX, INDICES, COMMODITIES, CRYPTO)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['FOREX', 'INDICES', 'COMMODITIES', 'CRYPTO', 'RATES'].map(m => {
                  const active = prefs.followed_markets.includes(m);
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        const next = active 
                          ? prefs.followed_markets.filter(x => x !== m)
                          : [...prefs.followed_markets, m];
                        handleTogglePref("followed_markets", next);
                      }}
                      className={`px-2.5 py-1 font-mono text-xs uppercase border transition-colors ${
                        active 
                          ? "bg-blue-600 text-white border-blue-500" 
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {active ? `✓ ${m}` : `+ ${m}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-zinc-400 mb-2">
                Followed Brokers & Prop Firms
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Pepperstone', 'IG Markets', 'IC Markets', 'FTMO', 'The5ers', 'Funding Pips'].map(ent => {
                  const active = prefs.followed_brokers.includes(ent) || prefs.followed_prop_firms.includes(ent);
                  return (
                    <button
                      key={ent}
                      onClick={() => {
                        const isBroker = ['Pepperstone', 'IG Markets', 'IC Markets'].includes(ent);
                        const field = isBroker ? 'followed_brokers' : 'followed_prop_firms';
                        const current = prefs[field];
                        const next = current.includes(ent)
                          ? current.filter(x => x !== ent)
                          : [...current, ent];
                        handleTogglePref(field, next);
                      }}
                      className={`px-2.5 py-1 font-mono text-xs uppercase border transition-colors ${
                        active 
                          ? "bg-purple-600 text-white border-purple-500" 
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      {active ? `✓ ${ent}` : `+ ${ent}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Alert settings */}
            <div className="md:col-span-2 pt-4 border-t border-zinc-800">
              <h4 className="font-mono text-xs uppercase text-zinc-400 mb-3 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                Alert Preferences (Explicit User Controls)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'alert_new_articles', label: 'New Articles in Followed Topics' },
                  { key: 'alert_broker_updates', label: 'Watched Broker Changes' },
                  { key: 'alert_prop_firm_updates', label: 'Watched Prop Firm Rules' },
                  { key: 'alert_market_events', label: 'Important Macro Events' },
                  { key: 'alert_drawdown_updates', label: 'Drawdown Tool Releases' },
                  { key: 'wire_digest_subscribed', label: 'The Wire Email Briefing' },
                ].map(({ key, label }) => {
                  const active = (prefs as any)[key];
                  return (
                    <label key={key} className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => handleTogglePref(key as keyof UserLobbyPreferences, e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-950 text-blue-500 focus:ring-0"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPCOMING EVENTS MATCHING YOUR MARKETS ──────────────────────────── */}
      {feed.matchedEvents.length > 0 && (
        <section className="border border-zinc-800 bg-zinc-950 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
            <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              UPCOMING CATALYSTS IN YOUR MARKETS
            </h2>
            <span className="font-mono text-[10px] text-zinc-500 uppercase">
              NEXT 24 HOURS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {feed.matchedEvents.map((evt) => (
              <div key={evt.id} className="p-3 bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="font-bold text-white px-1.5 py-0.5 bg-zinc-800 border border-zinc-700">
                      {evt.currency || 'MARKET'}
                    </span>
                    <span className={`px-1.5 py-0.5 uppercase tracking-wider ${
                      evt.impact === 'HIGH' || evt.importance === 'HIGH' || evt.importance === 'URGENT' ? 'text-red-400 bg-red-950/50' : 'text-zinc-400 bg-zinc-800'
                    }`}>
                      {evt.impact || evt.importance}
                    </span>
                  </div>
                  <h4 className="font-sans text-xs font-medium text-zinc-200 line-clamp-2">
                    {evt.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{new Date(evt.event_time || evt.discovered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {evt.forecast && <span>F: {evt.forecast}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── NEW STORIES IN YOUR LOBBY ──────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-zinc-800 pb-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-300 font-bold">
            NEW STORIES // CURATED FOR YOUR WATCHLIST
          </h2>
          <span className="font-mono text-xs text-zinc-400">
            {mainFeedStories.length} RECENT ARTICLES
          </span>
        </div>

        {mainFeedStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeedStories.map((article) => {
              const categorySlug = categoryToSlug(article.category as any);
              const articleHref = `/lobby/${categorySlug}/${article.slug}`;

              return (
                <article key={article.id} className="flex flex-col justify-between border border-zinc-800 bg-zinc-950 p-5 group hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase mb-3">
                      <span className="text-zinc-300 font-semibold">{article.category}</span>
                      <BookmarkButton articleId={article.id} />
                    </div>

                    <Link href={articleHref} className="block group">
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="font-sans text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                          {article.excerpt}
                        </p>
                      )}
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>{article.reading_time_minutes || 4} MIN READ</span>
                    <Link href={articleHref} className="text-zinc-300 hover:text-white flex items-center gap-1">
                      READ STORY <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-800 p-8 text-center bg-zinc-950">
            <p className="font-mono text-xs uppercase text-zinc-400">
              No new stories matching your exact watchlist in the last 24 hours.
            </p>
          </div>
        )}
      </section>

      {/* ─── BROKER & PROP FIRM UPDATES ─────────────────────────────────────── */}
      {(brokerStories.length > 0 || propFirmStories.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-900">
          {brokerStories.length > 0 && (
            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-blue-400 font-bold mb-4 pb-2 border-b border-zinc-800">
                BROKER DEVELOPMENTS
              </h3>
              <div className="space-y-4">
                {brokerStories.slice(0, 3).map(art => (
                  <Link
                    key={art.id}
                    href={`/lobby/${categoryToSlug(art.category as any)}/${art.slug}`}
                    className="block group"
                  >
                    <h4 className="font-serif text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {art.title}
                    </h4>
                    <span className="font-mono text-[10px] text-zinc-400 mt-1 block">
                      Source: {art.primary_source_name || 'Direct Announcement'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {propFirmStories.length > 0 && (
            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-purple-400 font-bold mb-4 pb-2 border-b border-zinc-800">
                PROP FIRM RULE WATCH
              </h3>
              <div className="space-y-4">
                {propFirmStories.slice(0, 3).map(art => (
                  <Link
                    key={art.id}
                    href={`/lobby/${categoryToSlug(art.category as any)}/${art.slug}`}
                    className="block group"
                  >
                    <h4 className="font-serif text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {art.title}
                    </h4>
                    <span className="font-mono text-[10px] text-zinc-400 mt-1 block">
                      Source: {art.primary_source_name || 'Prop Firm Desk'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ─── RECOMMENDED DRAWDOWN TOOLS ─────────────────────────────────────── */}
      {feed.recommendedTools.length > 0 && (
        <section className="border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-bold">
              DRAWDOWN TOOLS FOR YOUR TRADING TODAY
            </h3>
            <span className="font-mono text-[10px] text-zinc-400 uppercase">
              EXECUTION & RISK AUDIT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {feed.recommendedTools.map(tool => (
              <Link
                key={tool.slug}
                href={tool.href}
                className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <h4 className="font-mono text-sm font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>{tool.reason}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
