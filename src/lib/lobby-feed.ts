/**
 * Drawdown The Lobby — Read-Only Intelligence Feed Layer
 *
 * Exposes canonical Intelligence Data Platform events & observations
 * to THE LOBBY without tight coupling or schema mutation.
 *
 * Enforces:
 *  - Strict confidence filter: confidence != 'UNKNOWN'
 *  - Provenance traceability: source URLs and primary authorities preserved
 *  - Section routing:
 *      • just_in: Latest verified news & announcements across all categories
 *      • whats_happening: High & critical severity market/regulatory/macro events
 *      • coming_up: Scheduled macro indicators & central bank calendars
 *      • broker_watch: Broker regulatory notices, warnings, and license changes
 *      • prop_firm_watch: Prop firm developments and platform transitions
 *      • market_watch: Market observations, COT positioning, energy stats
 */

import type { DataEvent, DataObservation, ConfidenceLevel } from "./data-platform/types.ts";
import { ConfidenceGatekeeper } from "./data-platform/confidence.ts";

export interface LobbyFeedItem {
  id: string;
  section: "just_in" | "whats_happening" | "coming_up" | "broker_watch" | "prop_firm_watch" | "market_watch";
  title: string;
  summary: string;
  occurredAt: string;
  detectedAt: string;
  severity: "low" | "normal" | "high" | "critical";
  confidence: ConfidenceLevel;
  sourceName: string;
  sourceReliability: string;
  primaryUrl?: string;
  tags: string[];
  entityIds: string[];
  corroboratingSourcesCount: number;
}

export class LobbyFeedService {
  /**
   * Transforms a canonical DataEvent into a read-only LobbyFeedItem.
   * Drops any item that fails confidence gatekeeping.
   */
  static transformEvent(event: DataEvent): LobbyFeedItem | null {
    // 1. Mandatory Confidence Gate
    if (event.confidence === "UNKNOWN") {
      return null;
    }

    // 2. Determine primary Lobby section based on domain
    let section: LobbyFeedItem["section"] = "just_in";

    const eventTime = new Date(event.occurredAt).getTime();
    const isFuture = eventTime > Date.now();

    if (isFuture) {
      section = "coming_up";
    } else if (
      event.eventType === "BROKER_REGULATORY_EVENT" ||
      event.eventType.includes("BROKER") ||
      event.entityIds.some(id => id.startsWith("broker:"))
    ) {
      section = "broker_watch";
    } else if (
      event.eventType === "PROP_FIRM_EVENT" ||
      event.eventType.includes("PROP") ||
      event.entityIds.some(id => id.startsWith("prop:"))
    ) {
      section = "prop_firm_watch";
    } else if (
      event.eventType.includes("MARKET") ||
      event.eventType === "POSITIONING_EVENT" ||
      event.entityIds.some(id => id.startsWith("market:") || id.startsWith("inst:"))
    ) {
      section = "market_watch";
    } else if (event.severity === "high" || event.severity === "critical") {
      section = "whats_happening";
    } else {
      section = "just_in";
    }

    const tags: string[] = [event.eventType.toLowerCase().replace(/_/g, " ")];
    if (event.metadata?.centralBank) tags.push(String(event.metadata.centralBank));
    if (event.metadata?.currency) tags.push(String(event.metadata.currency));
    if (event.metadata?.formType) tags.push(String(event.metadata.formType));

    return {
      id: event.id || `feed-${crypto.randomUUID().slice(0, 8)}`,
      section,
      title: event.title,
      summary: event.description,
      occurredAt: event.occurredAt,
      detectedAt: event.detectedAt,
      severity: event.severity,
      confidence: event.confidence,
      sourceName: event.sourceIds[0] || "Authoritative Source",
      sourceReliability: event.sourceReliability,
      primaryUrl: event.primarySourceUrl,
      tags,
      entityIds: event.entityIds,
      corroboratingSourcesCount: (event.corroboratingReferences?.length || 0) + 1,
    };
  }

  /**
   * Filters and categorizes a batch of DataEvents into Lobby Feed sections.
   */
  static categorizeFeed(events: DataEvent[]): Record<string, LobbyFeedItem[]> {
    const feed: Record<string, LobbyFeedItem[]> = {
      just_in: [],
      whats_happening: [],
      coming_up: [],
      broker_watch: [],
      prop_firm_watch: [],
      market_watch: [],
    };

    for (const ev of events) {
      const item = this.transformEvent(ev);
      if (!item) continue;

      feed[item.section].push(item);

      // High/critical severity items also surface in whats_happening if not already there
      if ((ev.severity === "high" || ev.severity === "critical") && item.section !== "whats_happening") {
        feed.whats_happening.push({ ...item, section: "whats_happening" });
      }

      // All verified items appear in just_in chronological stream
      if (item.section !== "just_in") {
        feed.just_in.push({ ...item, section: "just_in" });
      }
    }

    // Sort just_in descending by detected time
    feed.just_in.sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );

    return feed;
  }
}
