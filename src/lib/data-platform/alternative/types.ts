/**
 * Drawdown Intelligence Data Platform — Alternative Data Research Layer Types
 *
 * Grounded in observable reality:
 *  - Satellite / Earth Observation (Sentinel, Landsat, NASA)
 *  - AIS Maritime Shipping & Chokepoints
 *  - Weather, Climate & Degree Days
 *  - Strategic Geographic Nodes Watchlist
 *  - Multivariate Correlation & 7-Stage Signal Lifecycle
 */

import type { SourceReliability, ConfidenceLevel } from "../types.ts";

// ─── GEOGRAPHIC & SPATIAL PRIMITIVES ──────────────────────────────────────────

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export type GeographicNodeType =
  | "oil_refinery"
  | "maritime_chokepoint"
  | "major_port"
  | "lng_export_terminal"
  | "metal_mine"
  | "agricultural_crop_belt"
  | "storage_hub";

export interface GeographicWatchlistNode {
  id: string; // e.g. 'node:strait-of-hormuz'
  name: string;
  type: GeographicNodeType;
  countryCode: string;
  coordinates: GeoCoordinates;
  boundingBox?: BoundingBox;
  relatedCommodities: string[]; // e.g. ['comm:crude-brent', 'comm:crude-wti']
  relatedInstruments: string[]; // e.g. ['inst:cl', 'inst:bno']
  importance: "CRITICAL" | "HIGH" | "STRATEGIC";
  description: string;
}

// ─── SATELLITE / EARTH OBSERVATION ───────────────────────────────────────────

export type SatellitePlatform = "Sentinel-2" | "Sentinel-1" | "Landsat-8" | "Landsat-9" | "NASA-MODIS" | "OPEN_EARTH";

export interface SatelliteObservation {
  id: string;
  platform: SatellitePlatform;
  nodeId?: string; // Links to GeographicWatchlistNode
  coordinates: GeoCoordinates;
  boundingBox?: BoundingBox;
  resolutionMeters: number;
  spectralBands: string[]; // e.g. ['B02-Blue', 'B03-Green', 'B04-Red', 'B08-NIR', 'B11-SWIR']
  cloudCoverPercentage: number; // 0 to 100
  observedAt: string; // ISO 8601
  receivedAt: string;
  derivedMetricName: string; // e.g. 'oil_storage_floating_roof_fill_pct', 'crop_vigor_ndvi'
  derivedMetricValue: number;
  metricUnit: string;
  sourceLicense: string;
  imageryUrl?: string;
  metadata?: Record<string, unknown>;
}

// ─── AIS MARITIME & CHOKEPOINT TRACKING ──────────────────────────────────────

export type VesselType = "crude_tanker" | "lng_carrier" | "container" | "bulk_carrier" | "general_cargo";

export interface AISObservation {
  id: string;
  nodeId?: string; // Links to chokepoint or port
  vesselMmsi?: string;
  vesselName?: string;
  vesselType: VesselType;
  coordinates: GeoCoordinates;
  speedKnots: number;
  draughtMeters?: number;
  destination?: string;
  eta?: string;
  observedAt: string;
  receivedAt: string;
  chokepointMetric?: {
    transitCount24h?: number;
    anchorageWaitingCount?: number;
    averageSpeedKnots?: number;
    divertedCount?: number;
  };
  sourceName: string;
  metadata?: Record<string, unknown>;
}

// ─── WEATHER, CLIMATE & DEGREE DAYS ──────────────────────────────────────────

export interface WeatherObservation {
  id: string;
  nodeId?: string;
  coordinates: GeoCoordinates;
  observedAt: string;
  temperatureCelsius: number;
  precipitationMm24h: number;
  heatingDegreeDays?: number; // HDD: 65°F / 18°C baseline
  coolingDegreeDays?: number; // CDD: 65°F / 18°C baseline
  soilMoistureIndex?: number; // 0.0 to 1.0 (Agricultural anomaly)
  severeWeatherAlert?: {
    severity: "advisory" | "watch" | "warning";
    event: string; // e.g. 'Frost Warning', 'Hurricane Track', 'Drought Alert'
    headline: string;
  };
  sourceProvider: string;
  metadata?: Record<string, unknown>;
}

// ─── MULTIVARIATE CORRELATION & SIGNAL LIFECYCLE ──────────────────────────────

export type SignalLifecycleState =
  | "OBSERVED"     // Physical data point collected and sanity-checked
  | "CORRELATED"   // Statistically linked to market/instrument movement
  | "CANDIDATE"    // Meets minimal significance & risk thresholds
  | "RESEARCHING"  // Analyst / algorithmic review of underlying drivers
  | "VERIFIED"     // Robust correlation confirmed by multiple data points
  | "PUBLISHED"    // Released to Drawdown Intelligence as observable correlation
  | "REJECTED";    // Dismissed due to spuriousness, cloud occlusion, or no edge

export interface PotentialSignal {
  id: string;
  state: SignalLifecycleState;
  nodeId: string;
  nodeName: string;
  category: "satellite" | "ais" | "weather" | "composite";
  hypothesis: string; // Factual statement of observation
  primaryMetric: string;
  observedValue: number;
  unit: string;
  baselineValue?: number;
  anomalyMagnitudePct: number; // e.g. +35% tanker congestion
  correlatedInstruments: string[]; // e.g. ['inst:cl', 'inst:ng']
  correlationCoefficient?: number; // -1.0 to 1.0
  historicalLeadLagHours?: number; // e.g. 48h lead time
  confidence: ConfidenceLevel;
  sourceReliability: SourceReliability;
  stateHistory: Array<{
    state: SignalLifecycleState;
    timestamp: string;
    note?: string;
  }>;
  rejectionReason?: string;
  publishedNotice?: string;
  createdAt: string;
  updatedAt: string;
}
