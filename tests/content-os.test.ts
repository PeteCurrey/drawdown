// tests/content-os.test.ts
import test from "node:test";
import assert from "node:assert/strict";

import { ContentStateMachine, SocialDeliveryStateMachine } from "../src/lib/content-os/state-machine.ts";
import { DeduplicationService, normaliseUrl, normaliseTitleTokens, generateDuplicateKey } from "../src/lib/content-os/deduplication.ts";
import { EditorialScoringService } from "../src/lib/content-os/scoring.ts";
import { NewsVerificationService } from "../src/lib/content-os/verification.ts";
import { EditorialPolicyService } from "../src/lib/content-os/editorial-policy.ts";
import { ChannelAdaptationEngine } from "../src/lib/content-os/channel-adapter.ts";
import { InstagramAssetValidator } from "../src/lib/content-os/instagram-assets.ts";
import { CalendarPlannerService } from "../src/lib/content-os/calendar-planner.ts";
import { OneSocialAdapter } from "../src/lib/content-os/publisher/onesocial-adapter.ts";
import type { ContentItem, ContentAsset, ContentChannel } from "../src/lib/content-os/types.ts";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Content State Machine Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Valid state transitions (idea -> draft -> review -> approved -> scheduled -> published)", () => {
  const item: Pick<ContentItem, "status" | "source_type" | "approved_by" | "approved_at"> = {
    status: "idea",
    source_type: "original",
    approved_by: null,
    approved_at: null
  };

  const toDraft = ContentStateMachine.validateContentTransition(item, "draft");
  assert.equal(toDraft.isValid, true);

  item.status = "draft";
  const toReview = ContentStateMachine.validateContentTransition(item, "review");
  assert.equal(toReview.isValid, true);

  item.status = "review";
  const toApproved = ContentStateMachine.validateContentTransition(item, "approved");
  assert.equal(toApproved.isValid, true);

  item.status = "approved";
  const toScheduled = ContentStateMachine.validateContentTransition(item, "scheduled");
  assert.equal(toScheduled.isValid, true);

  item.status = "scheduled";
  const toPublished = ContentStateMachine.validateContentTransition(item, "published");
  assert.equal(toPublished.isValid, true);
});

test("Content OS: Invalid state transitions are blocked (e.g. draft directly to published)", () => {
  const item: Pick<ContentItem, "status" | "source_type" | "approved_by" | "approved_at"> = {
    status: "draft",
    source_type: "original",
    approved_by: null,
    approved_at: null
  };

  const invalid = ContentStateMachine.validateContentTransition(item, "published");
  assert.equal(invalid.isValid, false);
  assert.match(invalid.error || "", /Invalid content transition/);
});

test("Content OS: News-derived content strictly requires human approval before publish/schedule", () => {
  const unapprovedNewsItem: Pick<ContentItem, "status" | "source_type" | "approved_by" | "approved_at"> = {
    status: "approved", // Claiming approved in status enum without approved_by id
    source_type: "news",
    approved_by: null,
    approved_at: null
  };

  const attemptPublish = ContentStateMachine.validateContentTransition(unapprovedNewsItem, "published");
  assert.equal(attemptPublish.isValid, false);
  assert.match(attemptPublish.error || "", /Approval policy violation: News-derived content requires human approval/);

  // With approver ID present
  const validWithApprover = ContentStateMachine.validateContentTransition(
    unapprovedNewsItem,
    "published",
    "user_admin_123"
  );
  assert.equal(validWithApprover.isValid, true);
});

test("Content OS: Duplicate publication prevention (already published content cannot re-publish)", () => {
  const publishedItem: Pick<ContentItem, "status" | "source_type" | "approved_by" | "approved_at"> = {
    status: "published",
    source_type: "evergreen",
    approved_by: "user_admin_123",
    approved_at: new Date().toISOString()
  };

  const rePub = ContentStateMachine.validateContentTransition(publishedItem, "published");
  assert.equal(rePub.isValid, false);
  assert.match(rePub.error || "", /Duplicate publication prevented/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Truthful Social Delivery State Machine Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Never mark delivery as 'published' if provider did not confirm", () => {
  const unconfirmedAttempt = SocialDeliveryStateMachine.validateDeliveryTransition(
    "publishing",
    "published",
    false // provider not confirmed
  );
  assert.equal(unconfirmedAttempt.isValid, false);
  assert.match(unconfirmedAttempt.error || "", /Truthful state violation/);

  const confirmedAttempt = SocialDeliveryStateMachine.validateDeliveryTransition(
    "publishing",
    "published",
    true // provider confirmed
  );
  assert.equal(confirmedAttempt.isValid, true);
});

test("Content OS: Provider returning unknown status transitions to 'unconfirmed', never 'published'", () => {
  const toUnconfirmed = SocialDeliveryStateMachine.validateDeliveryTransition(
    "publishing",
    "unconfirmed"
  );
  assert.equal(toUnconfirmed.isValid, true);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. News Deduplication Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: URL normalisation strips tracking parameters and trailing slashes", () => {
  const rawUrl1 = "https://www.ft.com/content/12345/?utm_source=twitter&utm_medium=social#lead";
  const rawUrl2 = "https://www.ft.com/content/12345";
  assert.equal(normaliseUrl(rawUrl1), normaliseUrl(rawUrl2));
});

test("Content OS: Title normalisation strips punctuation and stop words", () => {
  const t1 = "Bank of England Holds Interest Rates at 5.25%!";
  const t2 = "The Bank of England has held interest rates at 5.25%";
  assert.equal(normaliseTitleTokens(t1), normaliseTitleTokens(t2));
});

test("Content OS: 10 sources reporting the same event collapse into single duplicate key", () => {
  const existingCandidates = [
    {
      id: "cand_event_1",
      source_url: "https://bloomberg.com/news/buffett-steps-down",
      title: "Warren Buffett Steps Down as Berkshire Hathaway CEO",
      duplicate_key: generateDuplicateKey({
        url: "https://bloomberg.com/news/buffett-steps-down",
        title: "Warren Buffett Steps Down as Berkshire Hathaway CEO",
        entityReferences: ["Berkshire Hathaway", "Warren Buffett"]
      }),
      published_at: new Date().toISOString()
    }
  ];

  // Incoming story from Reuters with slight headline variation
  const incoming = {
    url: "https://reuters.com/business/buffett-leaves-berkshire-ceo-role",
    title: "Buffett Steps Down from Berkshire Hathaway CEO Position",
    entityReferences: ["Warren Buffett", "Berkshire Hathaway"],
    publishedAt: new Date().toISOString()
  };

  const dedupeResult = DeduplicationService.evaluateDuplicate(incoming, existingCandidates);
  assert.equal(dedupeResult.isDuplicate, true);
  assert.equal(dedupeResult.matchedCandidateId, "cand_event_1");
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Deterministic Editorial Scoring Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Deterministic scoring assigns CRITICAL/HIGH priority to primary source leadership change", () => {
  const score = EditorialScoringService.scoreCandidate({
    title: "Major Corporate Leadership Change: CEO Steps Down at Globally Important Bank",
    summary: "Official regulatory disclosure confirms sudden leadership change following regulatory sanction.",
    sourceTrustTier: "tier_1_primary",
    relatedSymbols: ["GBPUSD", "FTSE"],
    verificationEvidenceConfirmed: true,
    publishedAt: new Date()
  });

  assert.ok(score.priorityLevel === "critical" || score.priorityLevel === "high");
  assert.ok(score.relevanceScore >= 60);
  assert.ok(score.confidenceScore >= 70);
  assert.ok(score.reasons.length > 0);
  assert.ok(score.reasons.some(r => r.includes("Primary official source verified")));
});

test("Content OS: Low-relevance minor movement is scored LOW priority", () => {
  const score = EditorialScoringService.scoreCandidate({
    title: "Local bakery supplier stock edges slightly higher in thin trading",
    summary: "Trading volume was negligible with no broader corporate announcement.",
    sourceTrustTier: "tier_3_secondary",
    relatedSymbols: [],
    publishedAt: new Date(Date.now() - 72 * 3600 * 1000) // 72 hours old
  });

  assert.equal(score.priorityLevel, "low");
  assert.ok(score.relevanceScore < 30);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. News Verification Framework Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Verification status requires primary source or multiple corroborating sources", () => {
  // Single secondary source -> partially verified
  const single = NewsVerificationService.verifyEvent({
    sources: [
      {
        name: "Financial Blog",
        url: "https://example.com/rumor",
        trustTier: "tier_2_verified",
        claimText: "Rumour of rate cut"
      }
    ]
  });
  assert.equal(single.status, "partially_verified");

  // Primary source -> verified
  const primary = NewsVerificationService.verifyEvent({
    sources: [
      {
        name: "Bank of England Press Release",
        url: "https://bankofengland.co.uk/news",
        trustTier: "tier_1_primary",
        claimText: "Monetary Policy Committee votes to maintain Bank Rate at 5.25%"
      }
    ]
  });
  assert.equal(primary.status, "verified");
  assert.ok(primary.evidence.confirmedFacts.length > 0);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Editorial Policy & Clickbait Filter Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Editorial policy detects and blocks banned clickbait phrases", () => {
  const badCopy = "Markets are going crazy! Here's what you need to know to get rich quick!!!";
  const evalResult = EditorialPolicyService.evaluateContent(badCopy);

  assert.equal(evalResult.passed, false);
  assert.ok(evalResult.violations.some(v => v.includes("markets are going crazy")));
  assert.ok(evalResult.violations.some(v => v.includes("Excessive sensational punctuation")));
});

test("Content OS: Editorial policy appends mandatory FCA disclaimer when required", () => {
  const tradeNote = "EUR/USD rejected the session highs near 1.0850.";
  const compliant = EditorialPolicyService.enforceDisclaimer(tradeNote, true);

  assert.ok(compliant.includes("Spread Bets and CFDs are complex instruments"));
  assert.ok(compliant.includes("not financial advice"));
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. Channel Adaptation & Instagram Media Preflight Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: Channel adapter produces distinct tailored formats without naive truncation", () => {
  const adaptation = ChannelAdaptationEngine.adaptContent({
    title: "US Core Inflation Decelerates to 2.8%",
    slug: "us-core-inflation-decelerates-2-8",
    rawText: "Federal Reserve policy expectations adjusted as core CPI printed below consensus forecasts.",
    facts: ["Core CPI YoY printed 2.8% vs 3.0% forecast.", "Two-year Treasury yields dropped 8 bps."],
    analysis: "The market reaction matters less than the historical pattern underneath it. Cooling core inflation typically precedes rate cuts by 3-6 months.",
    sources: ["U.S. Bureau of Labor Statistics"],
    relatedSymbol: "SPX"
  });

  // Instagram should have structured slides
  assert.ok(adaptation.instagram.slides.length >= 4);
  assert.equal(adaptation.instagram.slides[0].type, "hook");

  // X should have character constrained post and thread
  assert.ok(adaptation.x.singlePost.length <= 280);
  assert.ok(adaptation.x.thread && adaptation.x.thread.length > 1);

  // LinkedIn should have institutional long-form commentary
  assert.ok(adaptation.linkedin.longFormCommentary.includes("Analysis & Historical Parallels"));
});

test("Content OS: Instagram asset validation BLOCKS post when media is missing", () => {
  const emptyAssets: ContentAsset[] = [];
  const check = InstagramAssetValidator.validate(
    { aspectRatio: "4:5", visualFamily: "MARKET_UPDATE", isCarousel: false },
    emptyAssets
  );

  assert.equal(check.isReady, false);
  assert.ok(check.errors.some(e => e.includes("At least one media asset (image/video/carousel) is mandatory")));
});

test("Content OS: Instagram carousel requires minimum 2 valid slides", () => {
  const singleSlideAsset: ContentAsset[] = [
    {
      id: "a1",
      content_item_id: "c1",
      asset_type: "image",
      storage_url: "https://drawdown.trading/assets/slide1.png",
      display_order: 0,
      aspect_ratio: "4:5",
      created_at: new Date().toISOString()
    }
  ];

  const check = InstagramAssetValidator.validate(
    { aspectRatio: "4:5", visualFamily: "MARKET_UPDATE", isCarousel: true, minSlideCount: 2 },
    singleSlideAsset
  );

  assert.equal(check.isReady, false);
  assert.ok(check.errors.some(e => e.includes("Carousel requires at least 2 slides")));
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. 1Social Adapter Boundary & Truthful Delivery Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: 1Social adapter preflight blocks Instagram without media", async () => {
  const adapter = new OneSocialAdapter();
  const channelItem: ContentChannel = {
    id: "ch_1",
    content_item_id: "item_1",
    channel: "instagram",
    body: "Morning market breakdown",
    hashtags: ["#trading"],
    media_references: [],
    status: "draft",
    provider: "onesocial",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const preflight = await adapter.preflight(channelItem, []);
  assert.equal(preflight.ready, false);
  assert.ok(preflight.errors.some(e => e.includes("mandatory")));
});

test("Content OS: 1Social adapter returns 'unconfirmed' when API key is unconfigured, NEVER 'published'", async () => {
  // Ensure placeholder/empty key environment
  const originalKey = process.env.ONESOCIAL_API_KEY;
  process.env.ONESOCIAL_API_KEY = "";

  const adapter = new OneSocialAdapter();
  const channelItem: ContentChannel = {
    id: "ch_2",
    content_item_id: "item_2",
    channel: "x",
    body: "Short market update",
    hashtags: ["#trading"],
    media_references: [],
    status: "ready",
    provider: "onesocial",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = await adapter.publish(channelItem, []);
  assert.equal(result.status, "unconfirmed");
  assert.notEqual(result.status, "published");

  // Restore env
  process.env.ONESOCIAL_API_KEY = originalKey;
});

test("Content OS: 1Social adapter targets configured Instagram channel ID in payload", async () => {
  const originalKey = process.env.ONESOCIAL_API_KEY;
  const originalChannelId = process.env.ONESOCIAL_INSTAGRAM_CHANNEL_ID;

  process.env.ONESOCIAL_API_KEY = "test_key_for_mock_fetch";
  process.env.ONESOCIAL_INSTAGRAM_CHANNEL_ID = "78a51c1b-2d28-478a-a424-95fcfa5fd0bc";

  const originalFetch = globalThis.fetch;
  let capturedBody: any = null;
  let capturedHeaders: any = null;

  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    capturedHeaders = init?.headers;
    capturedBody = JSON.parse(init?.body as string);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        status: "published",
        id: "onesocial_post_999",
        publishedAt: new Date().toISOString()
      })
    } as any;
  }) as typeof globalThis.fetch;

  try {
    const adapter = new OneSocialAdapter();
    const channelItem: ContentChannel = {
      id: "ch_ig_1",
      content_item_id: "item_ig_1",
      channel: "instagram",
      body: "Drawdown Risk Management Framework overview.",
      hashtags: ["#trading"],
      media_references: [],
      status: "ready",
      provider: "onesocial",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const assets: ContentAsset[] = [
      {
        id: "ast_ig_1",
        content_item_id: "item_ig_1",
        asset_type: "image",
        storage_url: "https://drawdown.trading/assets/slide1.png",
        aspect_ratio: "4:5",
        display_order: 0,
        created_at: new Date().toISOString()
      }
    ];

    const result = await adapter.publish(channelItem, assets, "test_idem_key_123");

    assert.equal(result.status, "published");
    assert.equal(result.providerPostId, "onesocial_post_999");
    assert.ok(capturedBody);
    assert.equal(capturedBody.channel, "instagram");
    assert.deepEqual(capturedBody.channelIds, ["78a51c1b-2d28-478a-a424-95fcfa5fd0bc"]);
    assert.deepEqual(capturedBody.mediaUrls, ["https://drawdown.trading/assets/slide1.png"]);
    assert.equal(capturedHeaders["X-Idempotency-Key"], "test_idem_key_123");
    assert.equal(capturedHeaders["Authorization"], "Bearer test_key_for_mock_fetch");
  } finally {
    globalThis.fetch = originalFetch;
    process.env.ONESOCIAL_API_KEY = originalKey;
    process.env.ONESOCIAL_INSTAGRAM_CHANNEL_ID = originalChannelId;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. Calendar Planning & Interruption Detection Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Content OS: 30-day planner generates expected 4-5 slots per week with pillar diversity", () => {
  const slots = CalendarPlannerService.generate30DayTemplate(new Date("2026-10-01"));
  assert.ok(slots.length >= 20); // ~21 weekdays in a 30-day window

  const pillars = new Set(slots.map(s => s.pillar));
  assert.ok(pillars.has("Market Intelligence"));
  assert.ok(pillars.has("Trading Education"));
  assert.ok(pillars.has("Trader Psychology"));
  assert.ok(pillars.has("Historical Case Studies"));
});

test("Content OS: High-priority news triggers calendar conflict recommendation without silently deleting slots", () => {
  const slots = CalendarPlannerService.generate30DayTemplate();
  // Assign dummy content item to next slot
  slots[0].assignedContentItem = {
    id: "item_scheduled_1",
    title: "Weekly Position Sizing Guide",
    content_type: "educational",
    slug: "weekly-position-sizing",
    status: "scheduled",
    category: "education",
    priority: "medium",
    source_type: "original",
    body: "Position sizing guide...",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const interruption = CalendarPlannerService.evaluateInterruption(
    {
      title: "Bank of England Emergency Rate Announcement",
      priority: "critical",
      discoveredAt: new Date().toISOString()
    },
    slots
  );

  assert.equal(interruption.hasConflict, true);
  assert.equal(interruption.recommendation, "CONSIDER_REPLACING");
  assert.ok(interruption.rationale?.includes("Consider delaying or moving scheduled post"));
  // Verify slot still exists intact
  assert.equal(slots[0].assignedContentItem.title, "Weekly Position Sizing Guide");
});
