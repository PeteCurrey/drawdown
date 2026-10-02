// tests/lobby-personalisation.test.ts
// Unit tests for The Lobby personalisation, watchlists, saved stories, and Morning View feed generation

import test from "node:test";
import assert from "node:assert/strict";
import { 
  getDefaultPreferences, 
  buildPersonalLobbyFeed 
} from "../src/lib/lobby-personalisation.ts";
import type { LobbyArticle, LobbyEventItem } from "../src/types/lobby.ts";
import type { UserLobbyPreferences } from "../src/types/lobby-personalisation.ts";

const mockArticles: LobbyArticle[] = [
  {
    id: "art_p1",
    title: "Pepperstone Expands Overnight Spreads Analysis",
    slug: "pepperstone-overnight-spreads",
    excerpt: "Institutional liquidity overview on Pepperstone.",
    body: "Body text",
    category: "BROKERS",
    article_type: "BROKER WATCH",
    status: "PUBLISHED",
    importance: "featured",
    section: "broker_watch",
    author_name: "Drawdown Desk",
    data_confidence: "VERIFIED",
    reading_time_minutes: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    view_count: 50,
    related_broker_slugs: ["pepperstone"]
  },
  {
    id: "art_p2",
    title: "Bank of England Leaves Bank Rate Unchanged at 5.00%",
    slug: "boe-rate-decision-hold",
    excerpt: "Monetary Policy Committee votes 7-2 to hold.",
    body: "Macro analysis of MPC minutes.",
    category: "MACRO",
    article_type: "ANALYSIS",
    status: "PUBLISHED",
    importance: "lead",
    section: "lead_story",
    author_name: "Drawdown Desk",
    data_confidence: "VERIFIED",
    reading_time_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    view_count: 210,
    related_entities: ["Bank of England"]
  },
  {
    id: "art_p3",
    title: "FTMO Performance Guarantee Calibration",
    slug: "ftmo-performance-guarantee",
    excerpt: "Evaluation of FTMO challenge payout rules.",
    body: "Rules analysis.",
    category: "PROP FIRMS",
    article_type: "PROP FIRM WATCH",
    status: "PUBLISHED",
    importance: "standard",
    section: "prop_firm_watch",
    author_name: "Drawdown Desk",
    data_confidence: "VERIFIED",
    reading_time_minutes: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    view_count: 95,
    related_prop_firm_slugs: ["ftmo"]
  }
];

const mockEvents: LobbyEventItem[] = [
  {
    id: "evt_1",
    title: "US Initial Jobless Claims",
    currency: "USD",
    impact: "HIGH",
    event_time: new Date(Date.now() + 3600000).toISOString(),
    forecast: "220K"
  },
  {
    id: "evt_2",
    title: "UK GDP MoM",
    currency: "GBP",
    impact: "HIGH",
    event_time: new Date(Date.now() + 7200000).toISOString(),
    forecast: "0.2%"
  }
];

test("Personalisation: Default preferences provide a clean baseline with all alerts enabled", () => {
  const prefs = getDefaultPreferences("user_test_123");
  assert.equal(prefs.user_id, "user_test_123");
  assert.deepEqual(prefs.followed_markets, []);
  assert.deepEqual(prefs.followed_brokers, []);
  assert.deepEqual(prefs.followed_prop_firms, []);
  assert.equal(prefs.alert_new_articles, true);
  assert.equal(prefs.wire_digest_subscribed, true);
});

test("Personalisation: Unconfigured user receives general editorial feed fallback without error", () => {
  const prefs = getDefaultPreferences("user_new");
  const feed = buildPersonalLobbyFeed({
    userName: "Alex",
    preferences: prefs,
    allArticles: mockArticles,
    allEvents: mockEvents
  });

  assert.equal(feed.hasFollows, false);
  assert.equal(feed.userName, "Alex");
  assert.ok(feed.curatedArticles.length > 0);
  assert.ok(feed.recommendedTools.length > 0);
});

test("Personalisation: Explicit broker follow prioritises matching broker intelligence", () => {
  const prefs: UserLobbyPreferences = {
    ...getDefaultPreferences("user_broker_watcher"),
    followed_brokers: ["Pepperstone"]
  };

  const feed = buildPersonalLobbyFeed({
    userName: "Sarah",
    preferences: prefs,
    allArticles: mockArticles,
    allEvents: mockEvents
  });

  assert.equal(feed.hasFollows, true);
  assert.deepEqual(feed.followedBrokers, ["Pepperstone"]);
  // First article in feed should be the Pepperstone story
  assert.equal(feed.curatedArticles[0].id, "art_p1");
});

test("Personalisation: Explicit market currency follow filters upcoming catalysts", () => {
  const prefs: UserLobbyPreferences = {
    ...getDefaultPreferences("user_forex"),
    followed_markets: ["GBP"]
  };

  const feed = buildPersonalLobbyFeed({
    userName: "James",
    preferences: prefs,
    allArticles: mockArticles,
    allEvents: mockEvents
  });

  assert.equal(feed.matchedEvents.length, 1);
  assert.equal(feed.matchedEvents[0].currency, "GBP");
  assert.equal(feed.matchedEvents[0].title, "UK GDP MoM");
});

test("Personalisation Privacy: Follows are strictly explicit without algorithmic profiling", () => {
  const prefs: UserLobbyPreferences = {
    ...getDefaultPreferences("user_explicit"),
    followed_categories: ["MACRO"],
    followed_tools: ["forex-market-hours"]
  };

  const feed = buildPersonalLobbyFeed({
    userName: "Jordan",
    preferences: prefs,
    allArticles: mockArticles,
    allEvents: mockEvents
  });

  // Top curated article should match explicit MACRO category
  assert.equal(feed.curatedArticles[0].category, "MACRO");
  // Recommended tool should directly reflect explicit user tool choice
  assert.ok(feed.recommendedTools.some(t => t.slug === "forex-market-hours"));
});
