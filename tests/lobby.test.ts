import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { 
  categoryToSlug, 
  slugToCategory, 
  LOBBY_CATEGORIES, 
  LOBBY_ARTICLE_TYPES,
  DRAWDOWN_TOOLS,
  DRAWDOWN_ENTITIES
} from "../src/lib/lobby.ts";
import { validateLobbyArticleGuardrails } from "../src/lib/lobby/guardrails.ts";
import { calculateTitleSimilarity, detectDuplicateArticle } from "../src/lib/lobby/duplicate-detection.ts";
import { verifyEventFeasibility, generateStructuredDraft } from "../src/lib/lobby/intelligence.ts";
import type { LobbyArticle, LobbyEventItem } from "../src/types/lobby.ts";

const rootDir = path.resolve(import.meta.dirname, "..");

function readFile(relPath: string): string {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Primary & Secondary Navigation Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby IA: Navigation.tsx includes The Lobby header CTA linking to /lobby", () => {
  const navContent = readFile("src/components/layout/Navigation.tsx");
  assert.ok(
    navContent.includes('href="/lobby"'),
    "Header navigation must include a CTA linking to /lobby"
  );
  assert.ok(
    navContent.includes("The Lobby"),
    "Header navigation CTA must display 'The Lobby'"
  );
  assert.ok(
    !navContent.includes('{ name: "The Lobby", href: "/lobby" }'),
    "The Lobby should be elevated to a header CTA rather than a standard navLink"
  );
});

test("Lobby IA: LobbyNav.tsx establishes all required secondary editorial links", () => {
  const lobbyNav = readFile("src/components/lobby/LobbyNav.tsx");
  const requiredNavs = [
    "HOME",
    "WHAT'S HAPPENING",
    "WATCHLIST",
    "MARKETS",
    "BROKERS",
    "PROP FIRMS",
    "PLATFORMS",
    "TRADES",
    "EXPLAINED",
    "DRAWDOWN DESK",
    "COMING UP"
  ];

  for (const item of requiredNavs) {
    assert.ok(
      lobbyNav.includes(item),
      `LobbyNav must include ${item}`
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Controlled Category Mapping Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Categories: Exactly 12 controlled categories exist and map bidirectionally", () => {
  assert.equal(LOBBY_CATEGORIES.length, 12, "Must support exactly 12 controlled categories");

  for (const category of LOBBY_CATEGORIES) {
    const slug = categoryToSlug(category);
    assert.ok(slug && slug.length > 0, `Slug must be valid for category ${category}`);
    assert.ok(!slug.includes(" "), `Slug must not contain spaces: ${slug}`);
    
    const resolved = slugToCategory(slug);
    assert.equal(resolved, category, `Bidirectional mapping failed for ${category} -> ${slug}`);
  }

  assert.equal(slugToCategory("invalid-category-xyz"), null, "Invalid category slug must return null");
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Structured Article Types & Tool References
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Article Types: All 9 structured types exist", () => {
  assert.equal(LOBBY_ARTICLE_TYPES.length, 9);
  assert.ok(LOBBY_ARTICLE_TYPES.includes("NEWS"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("ANALYSIS"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("EXPLAINER"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("BROKER WATCH"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("PROP FIRM WATCH"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("TRADE FEATURE"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("PLATFORM SPOTLIGHT"));
  assert.ok(LOBBY_ARTICLE_TYPES.includes("DRAWDOWN FEATURE"));
});

test("Lobby Internal Linking: Real Drawdown tools and entities are catalogued", () => {
  assert.ok(DRAWDOWN_TOOLS["position-size-calculator"], "Position size calculator must exist");
  assert.ok(DRAWDOWN_TOOLS["drawdown-recovery-calculator"], "Drawdown recovery calculator must exist");
  assert.ok(DRAWDOWN_TOOLS["signal-centre"], "Signal centre must exist");

  assert.ok(DRAWDOWN_ENTITIES["pepperstone"], "Pepperstone broker must exist");
  assert.ok(DRAWDOWN_ENTITIES["ftmo"], "FTMO prop firm must exist");
  assert.ok(DRAWDOWN_ENTITIES["tradingview"], "TradingView platform must exist");
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Quality Guardrails Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Guardrails: Drafts allow partial content but validate basic fields", () => {
  const minimalDraft: Partial<LobbyArticle> = {
    title: "Initial Draft Title",
    slug: "initial-draft-title",
    category: "MARKETS",
    article_type: "NEWS",
    status: "DRAFT"
  };

  const validation = validateLobbyArticleGuardrails(minimalDraft, "DRAFT");
  assert.equal(validation.isValid, true, "Draft should be valid even with short body");
});

test("Lobby Guardrails: Publication strictly blocks missing sources for News/Watch articles", () => {
  const newsWithoutSource: Partial<LobbyArticle> = {
    title: "Major Broker Increases Leverage Limits",
    slug: "broker-increases-leverage",
    category: "BROKERS",
    article_type: "BROKER WATCH",
    excerpt: "This is a detailed excerpt that is sufficiently long for publication requirements.",
    body: "This is a detailed body content that easily exceeds one hundred characters of comprehensive reporting.",
    status: "PUBLISHED",
    confidence: "VERIFIED",
    sources: []
  };

  const validation = validateLobbyArticleGuardrails(newsWithoutSource, "PUBLISHED");
  assert.equal(validation.canPublish, false, "Must not allow publishing news without verified source");
  assert.ok(validation.errors.some(e => e.includes("require at least one verified external")));
});

test("Lobby Guardrails: Rejects UNKNOWN data confidence on publication", () => {
  const unknownArticle: Partial<LobbyArticle> = {
    title: "Unverified Rumour Across Forums",
    slug: "unverified-rumour-forums",
    category: "PROP FIRMS",
    article_type: "NEWS",
    excerpt: "Sufficiently long excerpt describing an unverified rumour across online chatrooms.",
    body: "Sufficiently long body describing an unverified rumour across online chatrooms with over one hundred characters.",
    status: "PUBLISHED",
    confidence: "UNKNOWN",
    sources: [{ name: "Forum Post", url: "https://example.com/post", source_type: "Forum", classification: "secondary" }]
  };

  const validation = validateLobbyArticleGuardrails(unknownArticle, "PUBLISHED");
  assert.equal(validation.canPublish, false, "Must block publishing UNKNOWN confidence articles");
  assert.ok(validation.errors.some(e => e.includes("UNKNOWN")));
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Duplicate Detection Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Duplicate Detection: Identifies exact slug conflict", () => {
  const existing = [
    { id: "1", title: "FCA Alerts Traders on CFD Spreads", slug: "fca-alerts-cfd-spreads" }
  ];

  const result = detectDuplicateArticle("Different Title", "fca-alerts-cfd-spreads", existing);
  assert.equal(result.isDuplicate, true);
  assert.equal(result.similarityScore, 1.0);
  assert.match(result.reason || "", /Exact slug conflict/);
});

test("Lobby Duplicate Detection: Detects high-overlap duplicate headlines", () => {
  const existing = [
    { id: "1", title: "FCA Issues Supervisory Alert on CFD Margin Practices", slug: "fca-alert-cfd-margins" }
  ];

  const candidateTitle = "FCA Issues Supervisory Alert Regarding CFD Margin Practices";
  const result = detectDuplicateArticle(candidateTitle, "fca-new-slug", existing);
  assert.equal(result.isDuplicate, true);
  assert.ok(result.similarityScore > 0.75);
});

test("Lobby Duplicate Detection: Allows distinct articles without false positives", () => {
  const existing = [
    { id: "1", title: "FCA Issues Supervisory Alert on CFD Margin Practices", slug: "fca-alert-cfd-margins" }
  ];

  const distinctTitle = "Pepperstone Introduces New Liquidity Infrastructure in London";
  const result = detectDuplicateArticle(distinctTitle, "pepperstone-liquidity-infrastructure", existing);
  assert.equal(result.isDuplicate, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Intelligence & Event Feasibility Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Intelligence: Event verification rejects events without primary source", () => {
  const unverifiedEvent: Partial<LobbyEventItem> = {
    title: "Central Bank Considers Rate Cut",
    entity_references: ["Bank of England"]
  };

  const result = verifyEventFeasibility(unverifiedEvent);
  assert.equal(result.verified, false);
  assert.ok(result.reasons.some(r => r.includes("primary source")));
});

test("Lobby Intelligence: Structured draft generator maps tools without hallucinations", () => {
  const verifiedEvent = {
    title: "Major Broker Updates Spread Markup Schedule",
    summary: "Audited spread analysis confirms tighter GBP/USD spreads during London open.",
    classification: "BROKER" as const,
    importance: "HIGH" as const,
    entities: ["Pepperstone"],
    symbols: ["GBP/USD"],
    primarySource: {
      name: "Broker Documentation",
      url: "https://example.com/schedule",
      source_type: "Official",
      classification: "primary" as const
    },
    corroboratingSources: [],
    timestamp: "2026-09-20T10:00:00Z"
  };

  const draft = generateStructuredDraft(verifiedEvent);
  assert.equal(draft.headline, verifiedEvent.title);
  assert.ok(draft.relatedTools.includes("position-size-calculator"));
  assert.equal(draft.sources.length, 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Sitemap & RSS Conformance Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby SEO: sitemap.ts includes /lobby and all controlled categories", async () => {
  const sitemapPath = path.join(rootDir, "src/app/sitemap.ts");
  const { default: sitemap } = await import(sitemapPath);
  const items = await sitemap();

  assert.ok(Array.isArray(items), "sitemap() must return an array");

  const urls = items.map((i: any) => i.url);
  assert.ok(urls.includes("https://drawdown.trading/lobby"), "Must include /lobby");
  assert.ok(urls.includes("https://drawdown.trading/lobby/archive"), "Must include /lobby/archive");

  for (const cat of LOBBY_CATEGORIES) {
    const slug = categoryToSlug(cat);
    assert.ok(
      urls.includes(`https://drawdown.trading/lobby/${slug}`),
      `Sitemap must include category https://drawdown.trading/lobby/${slug}`
    );
  }
});

test("Lobby RSS: rss.xml route exists and returns valid Response structure", async () => {
  const rssRoutePath = path.join(rootDir, "src/app/(marketing)/lobby/rss.xml/route.ts");
  assert.ok(fs.existsSync(rssRoutePath), "src/app/(marketing)/lobby/rss.xml/route.ts must exist");
  
  const content = readFile("src/app/(marketing)/lobby/rss.xml/route.ts");
  assert.ok(content.includes('application/xml'), "RSS route must return XML content type");
  assert.ok(content.includes('<rss version="2.0"'), "RSS route must generate version 2.0 XML");
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Truthful Empty States Check
// ─────────────────────────────────────────────────────────────────────────────
test("Lobby Integrity: Empty states contain zero fake news or fabricated trades", () => {
  const emptyState = readFile("src/components/lobby/LobbyEmptyState.tsx");
  assert.ok(!emptyState.includes("lorem ipsum"), "Empty state must not contain placeholder lorem ipsum");
  assert.ok(emptyState.includes("NO STORIES PUBLISHED YET"), "Must display honest empty state");
});

test("Lobby Editorial Data: Coming Up events, Watchlist briefs, and Trade of the Month are structured and verified", async () => {
  const editorialModule = await import("../src/lib/lobby-editorial-data.ts");
  
  // Verify Coming Up events
  assert.ok(Array.isArray(editorialModule.VERIFIED_COMING_UP_EVENTS), "Coming up events must be an array");
  assert.ok(editorialModule.VERIFIED_COMING_UP_EVENTS.length >= 4, "Must have at least 4 upcoming scheduled events");
  for (const ev of editorialModule.VERIFIED_COMING_UP_EVENTS) {
    assert.ok(ev.event_name && ev.event_name.length > 5, "Event name must be specified");
    assert.ok(ev.date && ev.time, "Date and time must be specified");
    assert.ok(["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(ev.importance), "Must have valid importance");
  }

  // Verify Watchlist briefs
  assert.ok(Array.isArray(editorialModule.VERIFIED_WATCHLIST_ITEMS), "Watchlist items must be an array");
  assert.ok(editorialModule.VERIFIED_WATCHLIST_ITEMS.length >= 3, "Must have at least 3 watchlist items");
  for (const item of editorialModule.VERIFIED_WATCHLIST_ITEMS) {
    assert.ok(item.what && item.why_it_matters && item.when, "Watchlist item must have what, why_it_matters, and when");
  }

  // Verify Trade of the Month audit
  const trade = editorialModule.AUDITED_TRADE_CASE_STUDY;
  assert.ok(trade.instrument, "Trade case study must specify instrument");
  assert.ok(trade.entry && trade.stop && trade.target, "Trade case study must have complete geometric parameters");
  assert.ok(trade.historical_disclaimer?.includes("HISTORICAL EDUCATIONAL CASE STUDY ONLY"), "Must include mandatory disclaimer");
});

test("Lobby Masthead: Date format uses Europe/London timezone", () => {
  const mastheadContent = readFile("src/components/lobby/LobbyMasthead.tsx");
  assert.ok(mastheadContent.includes('timeZone: "Europe/London"'), "Lobby masthead must pin date to Europe/London timezone");
});

