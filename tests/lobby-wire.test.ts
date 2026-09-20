// tests/lobby-wire.test.ts
// Unit and integration audit for The Wire briefing layer and Social Distribution Engine

import test from "node:test";
import assert from "node:assert/strict";
import { 
  generateWireSlug, 
  generateWireDraftFromLobby, 
  buildUtmUrl, 
  renderWireEmailHtml 
} from "../src/lib/wire.ts";
import { 
  adaptLobbyArticleToSocial, 
  generateSocialUtm, 
  resolveRelatedTool 
} from "../src/lib/social-engine.ts";
import type { LobbyArticle } from "../src/types/lobby.ts";
import type { WireEdition } from "../src/types/wire.ts";

const mockArticles: LobbyArticle[] = [
  {
    id: "art_1001",
    title: "Pepperstone Launches Extended Hours US Equity CFD Trading",
    slug: "pepperstone-extended-hours-us-equity-cfds",
    excerpt: "Pepperstone has introduced 24/5 access to top US equities via CFD wrappers with pre-market pricing.",
    body: "Full analytical breakdown of liquidity, overnight spread widening, and execution models.",
    category: "BROKERS",
    article_type: "BROKER WATCH",
    status: "PUBLISHED",
    importance: "featured",
    section: "broker_watch",
    author_name: "Drawdown Desk",
    primary_source_name: "Pepperstone Official Press Release",
    primary_source_url: "https://pepperstone.com/en/news/extended-hours",
    data_confidence: "VERIFIED",
    reading_time_minutes: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    view_count: 120,
    related_broker_slugs: ["pepperstone"]
  },
  {
    id: "art_1002",
    title: "FTMO Tightens Maximum Drawdown Trailing Thresholds for Swing Accounts",
    slug: "ftmo-tightens-drawdown-thresholds-swing",
    excerpt: "Prop firm FTMO announces calibrated drawdown limits to align with institutional risk covenants.",
    body: "Evaluating simulated survival probabilities across retail volatility regimes.",
    category: "PROP FIRMS",
    article_type: "PROP FIRM WATCH",
    status: "PUBLISHED",
    importance: "lead",
    section: "lead_story",
    author_name: "Drawdown Desk",
    primary_source_name: "FTMO Desk",
    data_confidence: "VERIFIED",
    reading_time_minutes: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    view_count: 340,
    related_prop_firm_slugs: ["ftmo"]
  }
];

test("The Wire: generateWireSlug creates deterministic hyphenated slug", () => {
  const fixedDate = new Date("2026-09-20T08:00:00Z");
  assert.equal(generateWireSlug("MORNING", fixedDate), "morning-2026-09-20");
  assert.equal(generateWireSlug("EVENING", fixedDate), "evening-2026-09-20");
  assert.equal(generateWireSlug("BREAKING", fixedDate), "breaking-2026-09-20");
});

test("The Wire: Draft curation preserves canonical Lobby article IDs without duplicate content", () => {
  const morningDraft = generateWireDraftFromLobby(mockArticles, "MORNING");

  assert.equal(morningDraft.edition.edition_type, "MORNING");
  assert.match(morningDraft.edition.title, /Morning Wire/);
  assert.equal(morningDraft.items.length, 2);

  // Verifies canonical linking
  assert.equal(morningDraft.items[0].article_id, "art_1001");
  assert.equal(morningDraft.items[1].article_id, "art_1002");

  // Verifies tool recommendation was attached
  assert.ok(morningDraft.items[0].recommended_tool_slug);
  assert.ok(morningDraft.items[1].recommended_tool_slug);
  assert.ok(morningDraft.items[0].why_it_matters);
});

test("The Wire: UTM builder produces accurate tracking URLs for Lobby and tools", () => {
  const url = buildUtmUrl({
    path: "/lobby/brokers/pepperstone-extended-hours-us-equity-cfds",
    source: "wire",
    medium: "briefing",
    campaign: "morning-2026-09-20",
    content: "item-01"
  });

  const parsed = new URL(url);
  assert.equal(parsed.pathname, "/lobby/brokers/pepperstone-extended-hours-us-equity-cfds");
  assert.equal(parsed.searchParams.get("utm_source"), "wire");
  assert.equal(parsed.searchParams.get("utm_medium"), "briefing");
  assert.equal(parsed.searchParams.get("utm_campaign"), "morning-2026-09-20");
  assert.equal(parsed.searchParams.get("utm_content"), "item-01");
});

test("Social Engine: Adapts Lobby article into native X, LinkedIn, and Instagram formats", () => {
  const drafts = adaptLobbyArticleToSocial(mockArticles[0]);

  // 1. X format verification
  assert.ok(drafts.x.hook.includes("DRAWDOWN LOBBY"));
  assert.ok(drafts.x.fullPost.includes("Pepperstone"));
  assert.ok(drafts.x.fullPost.includes("utm_source=x"));
  assert.ok(drafts.x.bullets.length >= 2);

  // 2. LinkedIn format verification
  assert.ok(drafts.linkedin.title.includes("Market Intelligence"));
  assert.ok(drafts.linkedin.takeaway.length > 20);
  assert.ok(drafts.linkedin.fullPost.includes("utm_source=linkedin"));
  assert.ok(drafts.linkedin.discussionPrompt.length > 10);

  // 3. Instagram format verification
  assert.ok(drafts.instagram.slides.length >= 3);
  assert.ok(drafts.instagram.caption.includes("#trading"));
  assert.ok(drafts.instagram.caption.includes("The Lobby"));
});

test("Social Engine: Related tool resolution maps broker stories to risk calculator", () => {
  const tool = resolveRelatedTool(mockArticles[0]);
  assert.ok(tool);
  assert.equal(tool?.slug, "drawdown-recovery-calculator");
});

test("The Wire: HTML email renderer formats canonical back-links and disclaimers", () => {
  const mockEdition: WireEdition = {
    id: "wire_01",
    edition_type: "MORNING",
    title: "The Morning Wire — 20 Sep 2026",
    slug: "morning-2026-09-20",
    status: "PUBLISHED",
    subject_line: "Drawdown Morning Wire",
    preview_text: "Top moves today",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: "item_01",
        edition_id: "wire_01",
        article_id: "art_1001",
        display_order: 1,
        item_title: "Pepperstone Launches Extended Hours",
        wire_summary: "Broker introduces 24/5 CFD trading.",
        why_it_matters: "Overnight risk liquidity exposure.",
        recommended_tool_slug: "drawdown-recovery-calculator",
        market_category: "BROKERS",
        created_at: new Date().toISOString(),
        article: {
          id: "art_1001",
          title: "Pepperstone Launches Extended Hours US Equity CFD Trading",
          slug: "pepperstone-extended-hours-us-equity-cfds",
          category: "BROKERS"
        }
      }
    ]
  };

  const html = renderWireEmailHtml(mockEdition);
  assert.ok(html.includes("THE WIRE"));
  assert.ok(html.includes("DRAWDOWN"));
  assert.ok(html.includes("Pepperstone Launches Extended Hours"));
  assert.ok(html.includes("Why It Matters:"));
  assert.ok(html.includes("Read Full Analysis on The Lobby"));
  assert.ok(html.includes("utm_source=wire"));
  assert.ok(html.includes("Drawdown Recovery Calculator"));
});
