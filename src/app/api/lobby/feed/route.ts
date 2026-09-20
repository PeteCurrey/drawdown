import { NextResponse } from "next/server";
import { ProviderRegistry } from "@/lib/data-platform/registry";
import { EventClusteringEngine } from "@/lib/data-platform/clustering";
import { LobbyFeedService, type LobbyFeedItem } from "@/lib/lobby-feed";
import type { DataEvent } from "@/lib/data-platform/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/lobby/feed
 *
 * Read-only syndicated feed endpoint for THE LOBBY.
 * Returns clustered, verified/known events partitioned into canonical Lobby sections:
 *  - just_in
 *  - whats_happening
 *  - coming_up
 *  - broker_watch
 *  - prop_firm_watch
 *  - market_watch
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    // Collect recent events from registered providers
    const allEvents: DataEvent[] = [];

    // 1. SEC EDGAR Corporate/Insider Filings
    try {
      const secProvider: any = ProviderRegistry.get("sec-edgar");
      if (secProvider && typeof secProvider.fetchLatestFilings === "function") {
        const rawSec = await secProvider.fetchLatestFilings();
        const normalized = await secProvider.normalize(rawSec);
        allEvents.push(...normalized.events);
      }
    } catch {
      // Individual provider errors do not abort the global feed
    }

    // 2. Central Banks
    try {
      const cbProvider: any = ProviderRegistry.get("central-banks");
      if (cbProvider && typeof cbProvider.fetchBankFeed === "function") {
        const rawFed = await cbProvider.fetchBankFeed("FED");
        const normalized = await cbProvider.normalize(rawFed);
        allEvents.push(...normalized.events);
      }
    } catch {
      // Degraded/offline provider handled gracefully
    }

    // 3. Regulators
    try {
      const regProvider: any = ProviderRegistry.get("regulators");
      if (regProvider && typeof regProvider.fetchRegulatorFeed === "function") {
        const rawFca = await regProvider.fetchRegulatorFeed("FCA");
        const normalized = await regProvider.normalize(rawFca);
        allEvents.push(...normalized.events);
      }
    } catch {
      // Degraded/offline provider handled gracefully
    }

    // 4. Cross-source clustering
    const clusters = EventClusteringEngine.clusterEvents(allEvents);
    const canonicalEvents = clusters.map(c => c.canonicalEvent);

    // 5. Partition into Lobby feed sections
    const categorized = LobbyFeedService.categorizeFeed(canonicalEvents);

    if (section && section in categorized) {
      return NextResponse.json({
        success: true,
        section,
        count: categorized[section].slice(0, limit).length,
        items: categorized[section].slice(0, limit),
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      sections: {
        just_in: categorized.just_in.slice(0, limit),
        whats_happening: categorized.whats_happening.slice(0, limit),
        coming_up: categorized.coming_up.slice(0, limit),
        broker_watch: categorized.broker_watch.slice(0, limit),
        prop_firm_watch: categorized.prop_firm_watch.slice(0, limit),
        market_watch: categorized.market_watch.slice(0, limit),
      },
      totalEvents: canonicalEvents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load Lobby intelligence feed",
      },
      { status: 500 }
    );
  }
}
