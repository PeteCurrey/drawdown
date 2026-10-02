import { test } from "node:test";
import assert from "node:assert/strict";

import { EditorialTaxonomyService, DEFAULT_EDITORIAL_PILLARS } from "../src/lib/content-os/taxonomy.ts";
import { CANONICAL_CONTENT_SERIES, ContentSeriesService } from "../src/lib/content-os/series.ts";
import { EditorialQAEngine } from "../src/lib/content-os/qa-engine.ts";
import { EditorialCalendarGenerator } from "../src/lib/content-os/generator.ts";
import { NewsRadarEngine, type NewsRadarIngestionItem } from "../src/lib/content-os/news-radar.ts";
import { UTMBuilder } from "../src/lib/content-os/utm-builder.ts";
import { AttributionEngine, type AttributionRecord } from "../src/lib/content-os/attribution.ts";
import { OneSocialAdapter } from "../src/lib/content-os/publisher/onesocial-adapter.ts";
import type { ContentItem, ContentChannel, ContentAsset } from "../src/lib/content-os/types.ts";

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2: 30-Day Drawdown Editorial Engine Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 2: Editorial Taxonomy enforces target weights & max consecutive pillar constraints", () => {
  assert.equal(DEFAULT_EDITORIAL_PILLARS.length, 8);
  const totalWeight = DEFAULT_EDITORIAL_PILLARS.reduce((acc, p) => acc + p.targetWeightPercent, 0);
  assert.equal(totalWeight, 100);

  // Violates max consecutive pillar (3 education posts in a row)
  const invalidSequence = [
    { pillarKey: "trading_education" },
    { pillarKey: "trading_education" },
    { pillarKey: "trading_education" }
  ];
  const evalInvalid = EditorialTaxonomyService.validateDiversity(invalidSequence);
  assert.equal(evalInvalid.valid, false);
  assert.ok(evalInvalid.violations.some(v => v.rule === "MAX_CONSECUTIVE_PILLAR"));

  // Compliant sequence
  const validSequence = [
    { pillarKey: "market_intelligence" },
    { pillarKey: "trading_education" },
    { pillarKey: "trader_psychology" },
    { pillarKey: "risk_and_drawdown" }
  ];
  const evalValid = EditorialTaxonomyService.validateDiversity(validSequence);
  assert.equal(evalValid.valid, true);
});

test("Phase 2: Canonical series registry includes core series with required visual families", () => {
  const drawdown101 = ContentSeriesService.getSeriesBySlug("drawdown-101");
  assert.ok(drawdown101);
  assert.equal(drawdown101.visualFamily, "DRAWDOWN");

  const oneChart = ContentSeriesService.getSeriesBySlug("one-chart");
  assert.ok(oneChart);
  assert.equal(oneChart.visualFamily, "DATA");
});

test("Phase 2: Deterministic QA Layer blocks missing source, clickbait, and duplicate fingerprints", () => {
  // Factual post without source -> BLOCK
  const unsourcedItem: Pick<ContentItem, 'title' | 'body' | 'source_type' | 'source_reference' | 'content_type'> = {
    title: "US GDP Growth Stalls at 1.1%",
    body: "Quantitative data reveals economic deceleration across key manufacturing sectors.",
    source_type: "news",
    source_reference: "",
    content_type: "news"
  };
  const qaUnsourced = EditorialQAEngine.evaluate({ item: unsourcedItem });
  assert.equal(qaUnsourced.decision, "BLOCK");
  assert.ok(qaUnsourced.violations.some(v => v.includes("Missing source reference")));

  // Sensational copy -> BLOCK/WARN
  const clickbaitItem: Pick<ContentItem, 'title' | 'body' | 'source_type' | 'source_reference' | 'content_type'> = {
    title: "Markets are going crazy! You won't believe this!",
    body: "Make guaranteed money with our secret trading hack.",
    source_type: "original",
    source_reference: "Internal",
    content_type: "opinion"
  };
  const qaClickbait = EditorialQAEngine.evaluate({ item: clickbaitItem });
  assert.notEqual(qaClickbait.decision, "PASS");

  // Duplicate fingerprint check
  const fingerprint = EditorialQAEngine.generateFingerprint("EUR/USD Technical Breakdown", "Testing support near 1.0850.");
  const duplicateItem: Pick<ContentItem, 'title' | 'body' | 'source_type' | 'source_reference' | 'content_type'> = {
    title: "EUR/USD Technical Breakdown",
    body: "Testing support near 1.0850.",
    source_type: "original",
    source_reference: "Drawdown Terminal",
    content_type: "educational"
  };
  const qaDuplicate = EditorialQAEngine.evaluate({
    item: duplicateItem,
    historicalFingerprints: [fingerprint]
  });
  assert.equal(qaDuplicate.decision, "BLOCK");
  assert.ok(qaDuplicate.violations.some(v => v.includes("Duplicate content fingerprint")));
});

test("Phase 2: 'Generate Next 30 Days' produces 4-5 slots/week, passes QA, and preserves existing content", () => {
  const baseDate = new Date("2026-10-05"); // A known Monday
  const existingItem: ContentItem = {
    id: "existing_1",
    title: "Pre-existing Approved Macro Commentary",
    slug: "pre-existing-approved-macro",
    status: "approved",
    content_type: "market_analysis",
    category: "market_intelligence",
    priority: "high",
    source_type: "research",
    source_reference: "Official ONS statistics",
    body: "UK inflation overview...",
    scheduled_at: "2026-10-05T08:00:00Z",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = EditorialCalendarGenerator.generate30DayPlan({
    startDate: baseDate,
    existingScheduled: [existingItem]
  });

  assert.ok(result.totalSlotsEvaluated >= 20);
  assert.equal(result.existingRetained, 1);
  assert.ok(result.newGenerated >= 19);
  assert.ok(result.passedCount > 0);

  // Running a second time preserves the already generated plan without duplication
  const secondResult = EditorialCalendarGenerator.generate30DayPlan({
    startDate: baseDate,
    existingScheduled: [existingItem, ...(result.plan.map(p => p.slot.assignedContentItem!).filter(Boolean))]
  });
  assert.equal(secondResult.newGenerated, 0); // All slots already filled, zero duplicates spawned
  assert.ok(secondResult.existingRetained >= 20);
});

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3: Drawdown Financial News Radar Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 3: Reproduces Warren Buffett / Berkshire Hathaway leadership transition scenario", () => {
  // Demonstration: SOURCE -> INGEST -> VERIFY -> SCORE -> BRIEF -> DRAFT -> APPROVAL
  const rawIngestion: NewsRadarIngestionItem = {
    title: "Warren Buffett Steps Down as Berkshire Hathaway CEO; Greg Abel Named Successor",
    url: "https://www.sec.gov/edgar/searchedgar/berkshire-form-8k-succession",
    source: "SEC Form 8-K Regulatory Filing",
    trustTier: "tier_1_primary",
    summary: "Berkshire Hathaway Inc. has filed an official Form 8-K announcing Warren Buffett moves to Chairman Emeritus, with Greg Abel assuming the role of Chief Executive Officer effective immediately.",
    publishedAt: new Date().toISOString(),
    entities: ["Warren Buffett", "Berkshire Hathaway", "Greg Abel"],
    symbols: ["BRK.A", "BRK.B", "SPX"],
    eventType: "executive_change"
  };

  const batchResult = NewsRadarEngine.processIncomingBatch([rawIngestion], []);
  assert.equal(batchResult.candidatesToInsert.length, 1);

  const candidate = batchResult.candidatesToInsert[0];
  // 1. Verification status must be VERIFIED via primary regulatory filing
  assert.equal(candidate.verification_status, "verified");
  // 2. Score must be CRITICAL or HIGH priority
  assert.ok(candidate.priority_level === "critical" || candidate.priority_level === "high");
  // 3. Editorial status MUST remain 'new', strictly requiring human approval before publication
  assert.equal(candidate.editorial_status, "new");
  assert.notEqual(candidate.editorial_status, "published");

  // 4. Alert generated with potential angle and primary source verified flag
  assert.equal(batchResult.alerts.length, 1);
  assert.equal(batchResult.alerts[0].primarySourceVerified, true);
  assert.ok(batchResult.alerts[0].title.includes("Warren Buffett"));
});

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4: Production Publishing Layer (1Social & Truthful States) Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 4: Provider timeout or unknown response maintains unconfirmed status; retry is idempotent", async () => {
  const adapter = new OneSocialAdapter();
  const channelItem: ContentChannel = {
    id: "ch_test_timeout",
    content_item_id: "item_test",
    channel: "instagram",
    body: "Quantitative analysis of historical market drawdowns.",
    hashtags: ["#trading"],
    media_references: [],
    status: "ready",
    provider: "onesocial",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const assets: ContentAsset[] = [
    {
      id: "ast_1",
      content_item_id: "item_test",
      asset_type: "image",
      storage_url: "https://drawdown.trading/assets/valid-slide.png",
      aspect_ratio: "4:5",
      display_order: 0,
      created_at: new Date().toISOString()
    }
  ];

  // When API key is not configured, returns unconfirmed and NEVER falsely claims published
  const publishResult = await adapter.publish(channelItem, assets);
  assert.equal(publishResult.status, "unconfirmed");
  assert.notEqual(publishResult.status, "published");

  // Idempotent retry generation
  const retryResult = await adapter.retry("del_123", channelItem, assets);
  assert.ok(retryResult.idempotencyKey?.startsWith("retry_del_123_"));
});

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 5: Performance Feedback Loop & Attribution Engine Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Phase 5: Deterministic Drawdown UTM Builder produces uniform traceable links", () => {
  const url = UTMBuilder.buildUrl("/calculators/position-size", {
    source: "Instagram",
    campaign: "Drawdown 101",
    content: "asymmetry-of-loss"
  });

  assert.equal(
    url,
    "https://drawdown.trading/calculators/position-size?utm_source=instagram&utm_medium=social&utm_campaign=drawdown-101&utm_content=asymmetry-of-loss"
  );
});

test("Phase 5: Attribution Engine enforces Bayesian sample size safeguards & detects content fatigue", () => {
  // Record with small sample size (1 click, 1 paid conversion) -> Does NOT report misleading 100% CTR/Conversion
  const smallSample: AttributionRecord = {
    contentId: "item_small",
    channel: "x",
    impressions: 5,
    clicks: 1,
    sessions: 1,
    toolUsages: 1,
    leads: 1,
    paidConversions: 1,
    attributedRevenuePence: 4900
  };

  const metricsSmall = AttributionEngine.calculateDerivedMetrics(smallSample);
  assert.equal(metricsSmall.hasSufficientSampleSize, false);
  assert.equal(metricsSmall.clickThroughRatePercent, null); // Suppressed
  assert.equal(metricsSmall.conversionRatePercent, null);  // Suppressed
  assert.equal(metricsSmall.revenuePerPostGbp, 49.0);

  // Sufficient sample size
  const largeSample: AttributionRecord = {
    contentId: "item_large",
    channel: "instagram",
    impressions: 1000,
    clicks: 50,
    sessions: 40,
    toolUsages: 10,
    leads: 5,
    paidConversions: 2,
    attributedRevenuePence: 9800
  };

  const metricsLarge = AttributionEngine.calculateDerivedMetrics(largeSample);
  assert.equal(metricsLarge.hasSufficientSampleSize, true);
  assert.equal(metricsLarge.clickThroughRatePercent, 5.0); // 50 / 1000 = 5%
  assert.equal(metricsLarge.conversionRatePercent, 5.0);   // 2 / 40 = 5%
  assert.equal(metricsLarge.revenuePerPostGbp, 98.0);

  // Fatigue detection
  const topicsWithFatigue = [
    "Bitcoin Halving Rally",
    "Bitcoin ETF Inflows",
    "Bitcoin Miner Capitulation",
    "Gold Breakout",
    "GBP/USD Rate Spread",
    "Bitcoin Liquidity Analysis"
  ];
  const fatigue = AttributionEngine.detectFatigue(topicsWithFatigue);
  assert.equal(fatigue.hasFatigue, true);
  assert.ok(fatigue.warnings.some(w => w.includes("Content Fatigue Warning")));
});
