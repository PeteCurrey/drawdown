/**
 * Drawdown Intelligence Data Platform — Public Intelligence Feed Layer Test Suite
 *
 * Tests:
 *  1. SEC EDGAR filing adapter & parser
 *  2. CFTC Commitment of Traders (COT) normalization & net positioning
 *  3. Central Banks provider (8 institutions, policy classification)
 *  4. Financial Regulators provider (8 regulators, enforcement detection)
 *  5. Universal RSS 2.0 & Atom 1.0 parser
 *  6. Cross-Source Event Clustering & corroboration upgrades
 *  7. The Lobby Read-Only Feed service & confidence gatekeeper
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { UniversalFeedParser } from "../src/lib/data-platform/rss/parser.ts";
import { SecEdgarProvider } from "../src/lib/data-platform/providers/sec-edgar.ts";
import { CftcCotProvider } from "../src/lib/data-platform/providers/cftc-cot.ts";
import { CentralBanksProvider, CENTRAL_BANKS } from "../src/lib/data-platform/providers/central-banks.ts";
import { RegulatorsProvider, REGULATORS } from "../src/lib/data-platform/providers/regulators.ts";
import { EventClusteringEngine } from "../src/lib/data-platform/clustering.ts";
import { LobbyFeedService } from "../src/lib/lobby-feed.ts";
import type { DataEvent, RawFetchResult } from "../src/lib/data-platform/types.ts";

describe("Public Intelligence Feed Layer", () => {
  describe("1. Universal RSS 2.0 & Atom 1.0 Parser", () => {
    it("should parse standard RSS 2.0 XML with CDATA and categories", () => {
      const sampleRss = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>Bank of England News</title>
            <link>https://www.bankofengland.co.uk</link>
            <item>
              <title><![CDATA[Monetary Policy Summary and minutes of the MPC meeting]]></title>
              <link>https://www.bankofengland.co.uk/monetary-policy-summary/2026/sep</link>
              <guid>boe-mpc-2026-09</guid>
              <pubDate>Thu, 18 Sep 2026 11:00:00 GMT</pubDate>
              <description><![CDATA[The Bank of England’s Monetary Policy Committee voted by a majority of 7–2 to maintain Bank Rate at 4.5%.]]></description>
              <category>Monetary Policy</category>
              <category>Interest Rates</category>
            </item>
          </channel>
        </rss>
      `;

      const parsed = UniversalFeedParser.parse(sampleRss);
      assert.equal(parsed.title, "Bank of England News");
      assert.equal(parsed.items.length, 1);

      const item = parsed.items[0];
      assert.equal(item.title, "Monetary Policy Summary and minutes of the MPC meeting");
      assert.equal(item.id, "boe-mpc-2026-09");
      assert.equal(item.categories.length, 2);
      assert.ok(item.categories.includes("Monetary Policy"));
      assert.ok(item.description.includes("maintain Bank Rate at 4.5%"));
      assert.ok(!isNaN(new Date(item.pubDate).getTime()));
    });

    it("should parse Atom 1.0 XML entries", () => {
      const sampleAtom = `
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>SEC EDGAR Filings</title>
          <link href="https://www.sec.gov" rel="self"/>
          <entry>
            <id>urn:tag:sec.gov,2026:accession-0001</id>
            <title>8-K - Apple Inc. (0000320193)</title>
            <link href="https://www.sec.gov/Archives/edgar/data/320193/0001.htm" rel="alternate"/>
            <updated>2026-09-19T16:30:00-04:00</updated>
            <summary type="text">Item 1.01 Entry into a Material Definitive Agreement</summary>
          </entry>
        </feed>
      `;

      const parsed = UniversalFeedParser.parse(sampleAtom);
      assert.equal(parsed.title, "SEC EDGAR Filings");
      assert.equal(parsed.items.length, 1);
      assert.equal(parsed.items[0].title, "8-K - Apple Inc. (0000320193)");
      assert.equal(parsed.items[0].link, "https://www.sec.gov/Archives/edgar/data/320193/0001.htm");
      assert.equal(parsed.items[0].description, "Item 1.01 Entry into a Material Definitive Agreement");
    });
  });

  describe("2. SEC EDGAR Provider", () => {
    it("should normalize SEC Atom filings and identify 8-K material events", async () => {
      const provider = new SecEdgarProvider();
      const mockAtomXml = `
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">
          <title>EDGAR Latest Filings</title>
          <entry>
            <id>urn:tag:sec.gov:0001193125-26-100001</id>
            <title>8-K - MICROSOFT CORP (0000789019)</title>
            <link href="https://www.sec.gov/Archives/edgar/data/789019/000119312526100001/msft-8k.htm"/>
            <updated>2026-09-18T18:05:00Z</updated>
            <summary>Item 2.02 Results of Operations and Financial Condition</summary>
          </entry>
          <entry>
            <id>urn:tag:sec.gov:0000320193-26-100002</id>
            <title>4 - APPLE INC (0000320193)</title>
            <link href="https://www.sec.gov/Archives/edgar/data/320193/000032019326100002/form4.xml"/>
            <updated>2026-09-18T19:00:00Z</updated>
            <summary>Statement of Changes in Beneficial Ownership</summary>
          </entry>
          <entry>
            <id>urn:tag:sec.gov:ignore-me</id>
            <title>SC 13G - SOME FUND (0009999999)</title>
            <link href="https://www.sec.gov/Archives/edgar/data/9999999/form13g.htm"/>
            <updated>2026-09-18T19:10:00Z</updated>
            <summary>Passive institutional ownership schedule</summary>
          </entry>
        </feed>
      `;

      const rawFetch: RawFetchResult = {
        providerId: provider.id,
        endpoint: "https://www.sec.gov/feed",
        httpStatus: 200,
        latencyMs: 120,
        payload: mockAtomXml,
        rawHash: "hash-sec-1",
        fetchedAt: new Date().toISOString(),
      };

      const result = await provider.normalize(rawFetch);
      // SC 13G is filtered out; 8-K and Form 4 are captured
      assert.equal(result.events.length, 2);

      const eightK = result.events.find(e => e.metadata?.formType === "8-K");
      assert.ok(eightK);
      assert.equal(eightK.severity, "high");
      assert.equal(eightK.confidence, "VERIFIED");
      assert.equal(eightK.sourceReliability, "PRIMARY");
      assert.ok(eightK.entityIds.includes("company:cik-0000789019"));
      assert.ok(eightK.title.includes("MICROSOFT CORP"));

      const form4 = result.events.find(e => e.metadata?.formType === "4");
      assert.ok(form4);
      assert.equal(form4.severity, "normal");
      assert.ok(form4.entityIds.includes("company:cik-0000320193"));
    });
  });

  describe("3. CFTC Commitment of Traders (COT)", () => {
    it("should normalize CFTC Socrata records into positioning observations with net position", async () => {
      const provider = new CftcCotProvider();
      const mockSocrataRows = [
        {
          market_and_exchange_names: "EURO FX - CHICAGO MERCANTILE EXCHANGE",
          report_date_as_yyyy_mm_dd: "2026-09-15T00:00:00.000",
          cftc_contract_market_code: "099741",
          noncomm_positions_long_all: "220500",
          noncomm_positions_short_all: "145000",
          change_in_noncomm_long_all: "+12500",
          change_in_noncomm_short_all: "-8200",
          open_interest_all: "680000",
        },
        {
          market_and_exchange_names: "CRUDE OIL, LIGHT SWEET - NEW YORK MERCANTILE EXCHANGE",
          report_date_as_yyyy_mm_dd: "2026-09-15T00:00:00.000",
          cftc_contract_market_code: "067651",
          noncomm_positions_long_all: "340000",
          noncomm_positions_short_all: "290000",
          change_in_noncomm_long_all: "-5000",
          change_in_noncomm_short_all: "+15000",
          open_interest_all: "1750000",
        },
      ];

      const rawFetch: RawFetchResult = {
        providerId: provider.id,
        endpoint: "https://publicreporting.cftc.gov/resource/6dca-aqww.json",
        httpStatus: 200,
        latencyMs: 145,
        payload: mockSocrataRows,
        rawHash: "hash-cftc-1",
        fetchedAt: new Date().toISOString(),
      };

      const result = await provider.normalize(rawFetch);
      // Each row produces 3 observations: net, long, short
      assert.equal(result.observations.length, 6);

      const eurNet = result.observations.find(
        o => o.metadata?.marketName === "EURO FX - CHICAGO MERCANTILE EXCHANGE" && o.metric === "speculative_net_positions"
      );
      assert.ok(eurNet);
      // 220,500 - 145,000 = 75,500 net long
      assert.equal(eurNet.value, 75500);
      assert.equal(eurNet.confidence, "VERIFIED");
      assert.equal(eurNet.sourceReliability, "PRIMARY");
      assert.equal(eurNet.metadata?.netChange, 20700); // +12,500 - (-8,200) = +20,700
    });
  });

  describe("4. Global Central Banks Provider", () => {
    it("should have all 8 central banks configured with proper metadata", () => {
      const expectedCodes = ["FED", "ECB", "BOE", "BOJ", "SNB", "RBA", "RBNZ", "BOC"];
      for (const code of expectedCodes) {
        const bank = CENTRAL_BANKS[code as keyof typeof CENTRAL_BANKS];
        assert.ok(bank, `Missing central bank config for ${code}`);
        assert.ok(bank.feedUrl.startsWith("http"));
        assert.ok(bank.currency.length === 3);
        assert.ok(bank.entityId.startsWith("cb:"));
      }
    });

    it("should normalize central bank announcements and flag monetary policy interest rate decisions as critical", async () => {
      const provider = new CentralBanksProvider();
      const mockFedRss = `
        <rss version="2.0">
          <channel>
            <title>Federal Reserve Press Releases</title>
            <item>
              <title>FOMC statement: Federal Reserve issues FOMC statement on interest rate decision</title>
              <link>https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm</link>
              <guid>fed-monetary-2026-09</guid>
              <pubDate>Wed, 16 Sep 2026 14:00:00 EDT</pubDate>
              <description>The Federal Open Market Committee decided today to lower the target range for the federal funds rate.</description>
            </item>
            <item>
              <title>Federal Reserve Board announces appointment of new director</title>
              <link>https://www.federalreserve.gov/newsevents/pressreleases/other20260917a.htm</link>
              <guid>fed-board-2026-09</guid>
              <pubDate>Thu, 17 Sep 2026 10:00:00 EDT</pubDate>
              <description>The Federal Reserve Board announced the appointment of John Doe to the board of directors.</description>
            </item>
          </channel>
        </rss>
      `;

      const rawFetch: RawFetchResult = {
        providerId: provider.id,
        endpoint: CENTRAL_BANKS.FED.feedUrl,
        httpStatus: 200,
        latencyMs: 95,
        payload: { code: "FED", xml: mockFedRss },
        rawHash: "hash-fed-1",
        fetchedAt: new Date().toISOString(),
      };

      const result = await provider.normalize(rawFetch);
      assert.equal(result.events.length, 2);
      assert.equal(result.entities.length, 1);
      assert.equal(result.entities[0].id, "cb:fed");

      const fomcEvent = result.events[0];
      assert.equal(fomcEvent.eventType, "CENTRAL_BANK_EVENT");
      assert.equal(fomcEvent.severity, "critical"); // Triggered by "interest rate" & "FOMC"
      assert.equal(fomcEvent.confidence, "VERIFIED");
      assert.ok(fomcEvent.entityIds.includes("cb:fed"));

      const routineEvent = result.events[1];
      assert.equal(routineEvent.severity, "normal");
    });
  });

  describe("5. Financial Regulators Provider", () => {
    it("should have all 8 regulatory bodies configured", () => {
      const expectedCodes = ["FCA", "SEC", "CFTC", "ESMA", "FINRA", "ASIC", "CYSEC", "PRA"];
      for (const code of expectedCodes) {
        const reg = REGULATORS[code as keyof typeof REGULATORS];
        assert.ok(reg, `Missing regulator config for ${code}`);
        assert.ok(reg.feedUrl.startsWith("http"));
        assert.ok(reg.entityId.startsWith("reg:"));
      }
    });

    it("should normalize regulatory notices and route broker enforcement to high severity BROKER_REGULATORY_EVENT", async () => {
      const provider = new RegulatorsProvider();
      const mockFcaRss = `
        <rss version="2.0">
          <channel>
            <title>FCA News</title>
            <item>
              <title>FCA imposes £15m fine and penalty on retail CFD broker Apex Markets</title>
              <link>https://www.fca.org.uk/news/press-releases/fca-fines-apex-markets</link>
              <guid>fca-2026-09-01</guid>
              <pubDate>Mon, 14 Sep 2026 09:00:00 GMT</pubDate>
              <description>The FCA has fined retail broker Apex Markets for failing to conduct proper appropriateness assessments.</description>
            </item>
            <item>
              <title>FCA publishes quarterly review of consumer credit market</title>
              <link>https://www.fca.org.uk/news/quarterly-review</link>
              <guid>fca-2026-09-02</guid>
              <pubDate>Tue, 15 Sep 2026 10:00:00 GMT</pubDate>
              <description>Quarterly statistical overview of consumer lending standards.</description>
            </item>
          </channel>
        </rss>
      `;

      const rawFetch: RawFetchResult = {
        providerId: provider.id,
        endpoint: REGULATORS.FCA.feedUrl,
        httpStatus: 200,
        latencyMs: 110,
        payload: { code: "FCA", xml: mockFcaRss },
        rawHash: "hash-fca-1",
        fetchedAt: new Date().toISOString(),
      };

      const result = await provider.normalize(rawFetch);
      assert.equal(result.events.length, 2);

      const enforcementEvent = result.events[0];
      assert.equal(enforcementEvent.eventType, "BROKER_REGULATORY_EVENT");
      assert.equal(enforcementEvent.severity, "high"); // Detected fine/penalty
      assert.equal(enforcementEvent.confidence, "VERIFIED");
      assert.equal(enforcementEvent.metadata?.isEnforcement, true);
      assert.equal(enforcementEvent.metadata?.referencesBroker, true);

      const routineNotice = result.events[1];
      assert.equal(routineNotice.eventType, "REGULATORY_EVENT");
      assert.equal(routineNotice.severity, "normal");
    });
  });

  describe("6. Cross-Source Event Clustering", () => {
    it("should cluster corroborating reports from different sources and elect the PRIMARY authority as canonical", () => {
      const nowIso = new Date().toISOString();

      // Primary source: BoE official announcement
      const boeEvent: DataEvent = {
        id: "ev-boe-official",
        eventType: "CENTRAL_BANK_EVENT",
        title: "Bank of England cuts Bank Rate to 4.25%",
        description: "The Monetary Policy Committee voted to reduce Bank Rate by 25 basis points.",
        entityIds: ["cb:boe"],
        sourceIds: ["central-banks"],
        occurredAt: nowIso,
        detectedAt: nowIso,
        severity: "critical",
        confidence: "VERIFIED",
        sourceReliability: "PRIMARY",
        status: "READY",
        primarySourceUrl: "https://www.bankofengland.co.uk/news/rate-cut",
      };

      // Secondary news report covering the same story
      const newsEvent: DataEvent = {
        id: "ev-reuters-report",
        eventType: "NEWS_EVENT",
        title: "Bank of England cuts interest rate to 4.25% in split vote",
        description: "London — The Bank of England lowered its benchmark rate to 4.25 percent on Thursday.",
        entityIds: ["cb:boe"],
        sourceIds: ["rss-news-wire"],
        occurredAt: nowIso,
        detectedAt: nowIso,
        severity: "critical",
        confidence: "KNOWN",
        sourceReliability: "AUTHORITATIVE_SECONDARY",
        status: "READY",
        primarySourceUrl: "https://reuters.com/markets/boe-rate-cut",
      };

      const clusters = EventClusteringEngine.clusterEvents([newsEvent, boeEvent]);
      assert.equal(clusters.length, 1);

      const cluster = clusters[0];
      // PRIMARY boeEvent should be canonical, not the newsEvent
      assert.equal(cluster.canonicalEvent.sourceReliability, "PRIMARY");
      assert.equal(cluster.canonicalEvent.title, "Bank of England cuts Bank Rate to 4.25%");
      assert.equal(cluster.sourcesCount, 2);
      assert.equal(cluster.canonicalEvent.corroboratingReferences?.length, 1);
      assert.equal(cluster.canonicalEvent.corroboratingReferences?.[0].sourceId, "rss-news-wire");
      assert.ok(cluster.corroborationScore > 0.5);
    });
  });

  describe("7. The Lobby Read-Only Feed Service", () => {
    it("should reject UNKNOWN confidence events and categorize valid events into Lobby sections", () => {
      const nowIso = new Date().toISOString();

      const events: DataEvent[] = [
        {
          id: "ev-1",
          eventType: "BROKER_REGULATORY_EVENT",
          title: "FCA sanctions FX broker for client fund non-compliance",
          description: "Formal fine issued to Global FX Ltd.",
          entityIds: ["broker:global-fx", "reg:fca"],
          sourceIds: ["regulators"],
          occurredAt: nowIso,
          detectedAt: nowIso,
          severity: "high",
          confidence: "VERIFIED",
          sourceReliability: "PRIMARY",
          status: "READY",
          primarySourceUrl: "https://fca.org.uk/notice",
        },
        {
          id: "ev-2",
          eventType: "MARKET_RUMOR",
          title: "Anonymous forum rumors claiming broker insolvency",
          description: "Unverified chatter on trading discord.",
          entityIds: ["broker:unverified-corp"],
          sourceIds: ["social-sentiment"],
          occurredAt: nowIso,
          detectedAt: nowIso,
          severity: "critical",
          confidence: "UNKNOWN", // MUST BE REJECTED!
          sourceReliability: "UNVERIFIED",
          status: "READY",
        },
        {
          id: "ev-3",
          eventType: "CORPORATE_EVENT",
          title: "SEC 8-K: NVIDIA Corp Announces Material Strategic Agreement",
          description: "NVIDIA Corp files Form 8-K with SEC.",
          entityIds: ["company:cik-0001045810"],
          sourceIds: ["sec-edgar"],
          occurredAt: nowIso,
          detectedAt: nowIso,
          severity: "high",
          confidence: "VERIFIED",
          sourceReliability: "PRIMARY",
          status: "READY",
          primarySourceUrl: "https://sec.gov/nvda-8k",
        },
      ];

      const feed = LobbyFeedService.categorizeFeed(events);

      // ev-2 (UNKNOWN confidence) must be completely absent from all sections
      for (const sectionKey of Object.keys(feed)) {
        const hasRumor = feed[sectionKey].some(item => item.id === "ev-2");
        assert.equal(hasRumor, false, `Item ev-2 with UNKNOWN confidence was found in section ${sectionKey}`);
      }

      // ev-1 (broker regulatory) must appear in broker_watch
      const brokerWatchItem = feed.broker_watch.find(item => item.id === "ev-1");
      assert.ok(brokerWatchItem, "ev-1 not found in broker_watch");
      assert.equal(brokerWatchItem.confidence, "VERIFIED");

      // ev-3 (high severity 8-K) must appear in whats_happening
      const whatsHappeningItem = feed.whats_happening.find(item => item.id === "ev-3");
      assert.ok(whatsHappeningItem, "ev-3 not found in whats_happening");

      // All verified items appear in just_in
      assert.equal(feed.just_in.length, 2);
    });
  });
});
