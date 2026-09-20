/**
 * Drawdown Intelligence Data Platform — Cross-Source Event Clustering
 *
 * Clusters multi-source intelligence reports regarding the same underlying real-world event:
 *  - Groups events matching entity IDs and key topics within a temporal clustering window.
 *  - Selects the highest-reliability source (PRIMARY > AUTHORITATIVE_SECONDARY > SECONDARY > COMMUNITY)
 *    as the canonical primary representation.
 *  - Appends other reports into `corroboratingReferences` with full provenance tracking.
 *  - Upgrades event confidence when corroborated across multiple independent sources.
 */

import type { DataEvent, SourceReliability, ConfidenceLevel } from "./types";

export interface EventCluster {
  id: string;
  canonicalEvent: DataEvent;
  clusteredEvents: DataEvent[];
  entityIds: string[];
  firstDetectedAt: string;
  lastDetectedAt: string;
  sourcesCount: number;
  distinctSources: string[];
  corroborationScore: number; // 0.0 to 1.0
}

export interface ClusteringOptions {
  windowHours?: number;
  minTokenOverlap?: number;
}

const RELIABILITY_RANKS: Record<SourceReliability, number> = {
  PRIMARY: 5,
  AUTHORITATIVE_SECONDARY: 4,
  SECONDARY: 3,
  COMMUNITY: 2,
  UNVERIFIED: 1,
};

export class EventClusteringEngine {
  /**
   * Tokenizes text into normalized keywords for lexical matching.
   */
  private static tokenize(text: string): Set<string> {
    const stopWords = new Set([
      "a", "an", "the", "in", "on", "at", "by", "for", "with", "about",
      "against", "between", "into", "through", "during", "before", "after",
      "above", "below", "to", "from", "up", "down", "is", "are", "was", "were",
      "be", "been", "being", "have", "has", "had", "do", "does", "did", "and",
      "but", "if", "or", "because", "as", "until", "while", "of", "it", "this"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    return new Set(words);
  }

  /**
   * Calculates Jaccard similarity between two token sets.
   */
  private static jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Determines whether two events refer to the same real-world incident.
   */
  static areCorrelated(
    eventA: DataEvent,
    eventB: DataEvent,
    windowHours: number = 24,
    minSimilarity: number = 0.35
  ): boolean {
    // 1. Temporal window check
    const timeA = new Date(eventA.occurredAt).getTime();
    const timeB = new Date(eventB.occurredAt).getTime();
    const diffHours = Math.abs(timeA - timeB) / (1000 * 60 * 60);

    if (diffHours > windowHours) {
      return false;
    }

    // 2. Exact entity overlap
    const sharedEntities = eventA.entityIds.filter(id => eventB.entityIds.includes(id));
    const hasSharedEntity = sharedEntities.length > 0;

    // 3. Lexical similarity on titles and descriptions
    const tokensA = this.tokenize(`${eventA.title} ${eventA.description}`);
    const tokensB = this.tokenize(`${eventB.title} ${eventB.description}`);
    const similarity = this.jaccardSimilarity(tokensA, tokensB);

    // If they share an entity, require lower lexical threshold; otherwise require higher
    if (hasSharedEntity) {
      return similarity >= 0.2 || eventA.eventType === eventB.eventType;
    }

    return similarity >= minSimilarity;
  }

  /**
   * Clusters a batch of DataEvents.
   */
  static clusterEvents(
    events: DataEvent[],
    options: ClusteringOptions = {}
  ): EventCluster[] {
    const windowHours = options.windowHours ?? 36;
    const minTokenOverlap = options.minTokenOverlap ?? 0.35;
    const clusters: EventCluster[] = [];

    // Sort events chronologically
    const sorted = [...events].sort(
      (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );

    for (const event of sorted) {
      let matchedCluster: EventCluster | null = null;

      for (const cluster of clusters) {
        if (this.areCorrelated(cluster.canonicalEvent, event, windowHours, minTokenOverlap)) {
          matchedCluster = cluster;
          break;
        }
      }

      if (matchedCluster) {
        // Add to existing cluster
        matchedCluster.clusteredEvents.push(event);

        // Update entity IDs
        for (const eId of event.entityIds) {
          if (!matchedCluster.entityIds.includes(eId)) {
            matchedCluster.entityIds.push(eId);
          }
        }

        // Update timestamps
        if (event.detectedAt > matchedCluster.lastDetectedAt) {
          matchedCluster.lastDetectedAt = event.detectedAt;
        }
        if (event.detectedAt < matchedCluster.firstDetectedAt) {
          matchedCluster.firstDetectedAt = event.detectedAt;
        }

        // Distinct sources
        for (const sId of event.sourceIds) {
          if (!matchedCluster.distinctSources.includes(sId)) {
            matchedCluster.distinctSources.push(sId);
          }
        }
        matchedCluster.sourcesCount = matchedCluster.distinctSources.length;

        // Compare reliability: if this incoming event has higher reliability, promote it to canonical
        const incomingRank = RELIABILITY_RANKS[event.sourceReliability] || 0;
        const currentRank = RELIABILITY_RANKS[matchedCluster.canonicalEvent.sourceReliability] || 0;

        if (incomingRank > currentRank) {
          // Demote current canonical to corroborating reference
          const prevCanonical = matchedCluster.canonicalEvent;
          matchedCluster.canonicalEvent = {
            ...event,
            corroboratingReferences: [
              ...(event.corroboratingReferences || []),
              {
                sourceId: prevCanonical.sourceIds[0] || "unknown",
                sourceName: prevCanonical.title,
                url: prevCanonical.primarySourceUrl,
                reliability: prevCanonical.sourceReliability,
                retrievedAt: prevCanonical.detectedAt,
              },
            ],
          };
        } else {
          // Append incoming event as corroborating reference to canonical
          matchedCluster.canonicalEvent.corroboratingReferences = [
            ...(matchedCluster.canonicalEvent.corroboratingReferences || []),
            {
              sourceId: event.sourceIds[0] || "unknown",
              sourceName: event.title,
              url: event.primarySourceUrl,
              reliability: event.sourceReliability,
              retrievedAt: event.detectedAt,
            },
          ];
        }

        // Corroboration scoring & confidence upgrade
        const refCount = matchedCluster.distinctSources.length;
        matchedCluster.corroborationScore = Math.min(1.0, 0.5 + refCount * 0.15);

        // If corroborated across 2+ distinct sources, upgrade confidence
        if (refCount >= 2) {
          if (matchedCluster.canonicalEvent.confidence === "INFERRED") {
            matchedCluster.canonicalEvent.confidence = "KNOWN";
          } else if (
            matchedCluster.canonicalEvent.confidence === "KNOWN" &&
            matchedCluster.canonicalEvent.sourceReliability === "PRIMARY"
          ) {
            matchedCluster.canonicalEvent.confidence = "VERIFIED";
          }
        }
      } else {
        // Create new cluster
        const clusterId = `cluster-${crypto.randomUUID().slice(0, 8)}`;
        clusters.push({
          id: clusterId,
          canonicalEvent: { ...event },
          clusteredEvents: [event],
          entityIds: [...event.entityIds],
          firstDetectedAt: event.detectedAt,
          lastDetectedAt: event.detectedAt,
          sourcesCount: event.sourceIds.length,
          distinctSources: [...event.sourceIds],
          corroborationScore: 0.5,
        });
      }
    }

    return clusters;
  }
}
