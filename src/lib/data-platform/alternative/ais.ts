/**
 * Drawdown Intelligence Data Platform — AIS Maritime Tracking Adapter
 *
 * Domain: Maritime Cargo, Crude Tanker & Strategic Chokepoint Monitoring
 * Platforms: Terrestrial AIS, Satellite AIS, Open Coastal Networks
 * Reliability: PRIMARY (Direct transponder broadcast from commercial vessels)
 * Confidence: VERIFIED (for kinematic vessel telemetry) / INFERRED (for aggregated transit shifts)
 *
 * Core Capabilities:
 *  - Draught vs Design Draught: Infers laden vs ballast status (laden crude tanker = carrying oil)
 *  - Chokepoint Transit Analytics: Aggregates passage volume, congestion, and average transit velocity
 *  - Spatial binding to GeographicWatchlistNode
 */

import type {
  AISObservation,
  VesselType,
  GeoCoordinates,
} from "./types.ts";
import { GeographicWatchlist } from "./watchlist.ts";

export interface AISIngestRecord {
  mmsi: string;
  vesselName: string;
  vesselType: VesselType;
  coordinates: GeoCoordinates;
  speedKnots: number;
  draughtMeters?: number;
  maxDraughtMeters?: number;
  destination?: string;
  eta?: string;
  observedAt: string;
  sourceName?: string;
}

export class AISMaritimeAdapter {
  /**
   * Evaluates and normalizes raw AIS vessel broadcast.
   */
  static processVesselObservation(record: AISIngestRecord): AISObservation {
    const matchedNode = GeographicWatchlist.findNodeByCoordinates(record.coordinates);
    const nowIso = new Date().toISOString();

    // Infer whether vessel is loaded based on draught
    let isLaden: boolean | undefined = undefined;
    if (record.draughtMeters && record.maxDraughtMeters && record.maxDraughtMeters > 0) {
      const draughtRatio = record.draughtMeters / record.maxDraughtMeters;
      isLaden = draughtRatio >= 0.75; // Vessel sitting deep in the water
    }

    return {
      id: `ais-${record.mmsi}-${Date.now()}`,
      nodeId: matchedNode?.id,
      vesselMmsi: record.mmsi,
      vesselName: record.vesselName,
      vesselType: record.vesselType,
      coordinates: record.coordinates,
      speedKnots: record.speedKnots,
      draughtMeters: record.draughtMeters,
      destination: record.destination,
      eta: record.eta,
      observedAt: record.observedAt,
      receivedAt: nowIso,
      sourceName: record.sourceName || "Open Maritime AIS Broadcast",
      metadata: {
        matchedNodeName: matchedNode?.name,
        targetCommodities: matchedNode?.relatedCommodities,
        isLaden,
      },
    };
  }

  /**
   * Computes aggregated chokepoint transit metrics across a fleet of vessels.
   */
  static computeChokepointMetrics(
    nodeId: string,
    observations: AISObservation[],
    historicalBaselineTransit24h: number = 25
  ): {
    nodeId: string;
    totalVesselsObserved: number;
    tankersCount: number;
    lngCarriersCount: number;
    averageSpeedKnots: number;
    anchorageWaitingCount: number;
    transitDeviationPct: number;
  } {
    const nodeObs = observations.filter(o => o.nodeId === nodeId);
    const total = nodeObs.length;

    let tankers = 0;
    let lngCarriers = 0;
    let totalSpeed = 0;
    let waitingAnchorage = 0;

    for (const obs of nodeObs) {
      if (obs.vesselType === "crude_tanker") tankers++;
      if (obs.vesselType === "lng_carrier") lngCarriers++;
      totalSpeed += obs.speedKnots;

      // Vessels moving under 1.5 knots in a chokepoint or port approach are deemed anchored/waiting
      if (obs.speedKnots <= 1.5) {
        waitingAnchorage++;
      }
    }

    const avgSpeed = total > 0 ? parseFloat((totalSpeed / total).toFixed(1)) : 0;
    const deviation = historicalBaselineTransit24h > 0
      ? parseFloat((((total - historicalBaselineTransit24h) / historicalBaselineTransit24h) * 100).toFixed(1))
      : 0;

    return {
      nodeId,
      totalVesselsObserved: total,
      tankersCount: tankers,
      lngCarriersCount: lngCarriers,
      averageSpeedKnots: avgSpeed,
      anchorageWaitingCount: waitingAnchorage,
      transitDeviationPct: deviation,
    };
  }
}
