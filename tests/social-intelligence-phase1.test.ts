// tests/social-intelligence-phase1.test.ts
import test from "node:test";
import assert from "node:assert/strict";

import { DeduplicationService } from "../src/lib/content-os/deduplication.ts";
import { NewsRadarEngine } from "../src/lib/content-os/news-radar.ts";
import { XApiProvider } from "../src/lib/data-platform/providers/x-provider.ts";
import { RssSocialProvider } from "../src/lib/data-platform/providers/rss-social-adapter.ts";
import { generateWireDraftFromLobby } from "../src/lib/wire.ts";
import type { NewsCandidate } from "../src/lib/content-os/types.ts";
import type { LobbyArticle } from "../src/types/lobby.ts";
import type { InvestorAttentionItem } from "../src/lib/lobby.ts";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Social Post Deduplication & Cross-Source Entity Linking
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 1 Deduplication: Exact platform post ID collision is rejected as duplicate", () => {
  const existingCandidates: Array<Pick<NewsCandidate, 'id' | 'source_url' | 'title' | 'duplicate_key' | 'published_at'> & {
    platform_post_id?: string | null;
    entity_references?: string[];
  }> = [
    {
      id: "cand-1",
      title: "Stanley Druckenmiller increases UK gilt exposure",
      source_url: "https://x.com/druckenmiller/status/1880000000000000001",
      duplicate_key: "evt_druckenmiller_gilt_bucket1",
      published_at: new Date().toISOString(),
      platform_post_id: "1880000000000000001",
      entity_references: ["GBP", "GILTS"]
    }
  ];

  // Incoming post with the same tweet ID but slightly different URL or text variation
  const incoming = {
    url: "https://x.com/druckenmiller/status/1880000000000000001?s=20",
    title: "Stanley Druckenmiller adds to UK gilts position",
    platformPostId: "1880000000000000001",
    entityReferences: ["GBP", "GILTS"],
    publishedAt: new Date().toISOString()
  };

  const result = DeduplicationService.evaluateDuplicate(incoming, existingCandidates);
  assert.equal(result.isDuplicate, true);
  assert.equal(result.matchedCandidateId, "cand-1");
  assert.match(result.reason || "", /Exact platform post ID collision/);
});

test("Phase 1 Deduplication: Multi-source discussion on the same entity within 24h links to parent event", () => {
  const now = new Date();
  const existingCandidates: Array<Pick<NewsCandidate, 'id' | 'source_url' | 'title' | 'duplicate_key' | 'published_at'> & {
    platform_post_id?: string | null;
    entity_references?: string[];
  }> = [
    {
      id: "parent-story-1",
      title: "Pepperstone announces fee restructuring for European indices",
      source_url: "https://financialnews.com/pepperstone-fees-2026",
      duplicate_key: "evt_pepperstone_fees_bucket1",
      published_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      platform_post_id: null,
      entity_references: ["Pepperstone", "FTSE"]
    }
  ];

  // Investor tweet discussing Pepperstone 2 hours later
  const incomingTweet = {
    url: "https://x.com/trader_desk/status/1880000000000000002",
    title: "@trader_desk: Pepperstone spread reduction on FTSE is significant for intraday execution",
    platformPostId: "1880000000000000002",
    entityReferences: ["Pepperstone"],
    publishedAt: now.toISOString()
  };

  const result = DeduplicationService.evaluateDuplicate(incomingTweet, existingCandidates);
  assert.equal(result.isDuplicate, false);
  assert.equal(result.isCorroboratingAttention, true);
  assert.equal(result.parentEventId, "parent-story-1");
  assert.equal(result.matchedEntity, "Pepperstone");
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Epistemic Separation & Claim vs Fact Integrity
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 1 Epistemic Separation: NewsRadarEngine preserves separate claim, facts, and interpretation", () => {
  const incoming = [
    {
      title: "@fund_manager: NVDA datacenter orders accelerating beyond street estimates",
      url: "https://x.com/fund_manager/status/1880000000000000003",
      source: "X (Twitter)",
      trustTier: "tier_3_secondary" as const,
      summary: "Datacenter lead times extending to 32 weeks according to channel checks.",
      sourceClaim: "Datacenter lead times extending to 32 weeks according to channel checks.",
      verifiedFacts: [
        {
          claim: "NVIDIA reported Q2 Datacenter revenue of $26.3B, up 154% YoY",
          source: "SEC Form 10-Q (FY2026 Q2)",
          source_url: "https://sec.gov/edgar/nvda-10q"
        }
      ],
      drawdownInterpretation: "Monitored desk highlighting hardware demand resilience ahead of quarterly earnings.",
      platformPostId: "1880000000000000003",
      authorHandle: "fund_manager",
      entities: ["NVDA"],
      symbols: ["NVDA"]
    }
  ];

  const { candidatesToInsert } = NewsRadarEngine.processIncomingBatch(incoming, []);
  assert.equal(candidatesToInsert.length, 1);

  const cand = candidatesToInsert[0];
  // Verify strict separation
  assert.equal(cand.source_claim, "Datacenter lead times extending to 32 weeks according to channel checks.");
  assert.equal(cand.author_handle, "fund_manager");
  assert.equal(cand.platform_post_id, "1880000000000000003");
  assert.equal(cand.verified_facts?.length, 1);
  assert.equal(cand.verified_facts?.[0].source, "SEC Form 10-Q (FY2026 Q2)");
  assert.match(cand.drawdown_interpretation || "", /Monitored desk highlighting hardware demand resilience/);
  // Human approval strictly required
  assert.equal(cand.editorial_status, "new");
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Provider Truthful State Enforcement (Rule 18 & 22)
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 1 Provider Truthfulness: XApiProvider reports NOT_CONFIGURED when bearer token is absent", async () => {
  const savedToken = process.env.X_API_BEARER_TOKEN;
  const savedAltToken = process.env.TWITTER_BEARER_TOKEN;
  try {
    delete process.env.X_API_BEARER_TOKEN;
    delete process.env.TWITTER_BEARER_TOKEN;

    const provider = new XApiProvider();
    const health = await provider.checkHealth();
    assert.equal(health.isAvailable, false);
    assert.equal(health.status, "NOT_CONFIGURED");

    const timeline = await provider.fetchUserTimeline({
      sourceId: "src-x",
      name: "Test Desk",
      handle: "@testdesk",
      platform: "x",
      category: "investor",
      reliability: "COMMUNITY"
    });

    assert.equal(timeline.status, "NOT_CONFIGURED");
    assert.equal(timeline.posts.length, 0); // Strictly zero fabricated posts
  } finally {
    if (savedToken) process.env.X_API_BEARER_TOKEN = savedToken;
    if (savedAltToken) process.env.TWITTER_BEARER_TOKEN = savedAltToken;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. The Wire Daily Briefing Integration
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 1 Wire Integration: Includes approved investor attention items with attribution", () => {
  const lobbyArticles: LobbyArticle[] = [
    {
      id: "art-1",
      title: "Bank of England Holds Bank Rate at 4.75%",
      slug: "boe-holds-bank-rate",
      category: "MACRO",
      article_type: "NEWS",
      status: "PUBLISHED",
      confidence: "VERIFIED",
      importance: "lead",
      section: "lead",
      author_name: "Drawdown Editorial",
      reading_time_minutes: 3,
      tags: ["boe", "gbp"],
      sources: [],
      related_article_slugs: [],
      related_tool_slugs: [],
      related_broker_slugs: [],
      related_prop_firm_slugs: [],
      related_platform_slugs: [],
      related_markets: ["GBPUSD"],
      schema_type: "NewsArticle",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      body: "Full body text...",
      excerpt: "Bank Rate held steady."
    }
  ];

  const attentionItems: InvestorAttentionItem[] = [
    {
      id: "cand-social-1",
      title: "Macro Desk notes unusual call volume on Brent Crude",
      source: "X (Twitter)",
      source_url: "https://x.com/macro_desk/status/1880000000000000099",
      author_handle: "macro_desk",
      published_at: new Date().toISOString(),
      discovered_at: new Date().toISOString(),
      entity_references: ["Crude Oil"],
      related_symbols: ["BRENT"],
      source_claim: "Unusual call skew detected on Brent $90 strikes for November expiration.",
      verified_facts: [
        {
          claim: "CME Group reported 28% increase in weekly call open interest",
          source: "CME Volume Report"
        }
      ],
      drawdown_interpretation: "Options skew implies heightened tail-risk hedging ahead of OPEC+ meeting.",
      investor_attention_score: 85
    }
  ];

  const wireDraft = generateWireDraftFromLobby(lobbyArticles, "MORNING", attentionItems);
  assert.equal(wireDraft.items.length, 2);

  const attentionWireItem = wireDraft.items.find(i => i.market_category === "INVESTOR ATTENTION");
  assert.ok(attentionWireItem);
  assert.match(attentionWireItem.item_title, /\[Investor Attention\]/);
  assert.match(attentionWireItem.wire_summary, /Source statement:/);
  assert.match(attentionWireItem.source_attribution || "", /@macro_desk/);
});
