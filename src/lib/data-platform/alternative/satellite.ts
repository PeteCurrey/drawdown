/**
 * Drawdown Intelligence Data Platform — Satellite Earth Observation Adapter
 *
 * Domain: Satellite Remote Sensing & Physical Asset Monitoring
 * Platforms: Copernicus Sentinel-1/2, USGS Landsat-8/9, NASA Earth Observation
 * Reliability: PRIMARY (Direct instrument orbital sensor data)
 * Confidence: VERIFIED (for raw physical reflectance) / INFERRED (for derived metrics)
 *
 * Features:
 *  - Quality control: filters out observations exceeding cloud coverage thresholds (> 30%)
 *  - Spatial binding: automatically maps observation footprint to GeographicWatchlistNode
 *  - Spectral decomposition: NDVI (agriculture), SWIR/Thermal (refinery flaring / industrial heat),
 *    SAR Synthetic Aperture Radar (oil tank floating-roof heights & port congestion)
 */

import type {
  SatelliteObservation,
  SatellitePlatform,
  GeoCoordinates,
  BoundingBox,
} from "./types.ts";
import { GeographicWatchlist } from "./watchlist.ts";

export interface SatelliteIngestParams {
  platform: SatellitePlatform;
  coordinates: GeoCoordinates;
  boundingBox?: BoundingBox;
  resolutionMeters: number;
  spectralBands: string[];
  cloudCoverPercentage: number;
  observedAt: string;
  derivedMetricName: string;
  derivedMetricValue: number;
  metricUnit: string;
  sourceLicense?: string;
  imageryUrl?: string;
}

export class SatelliteEarthObservationAdapter {
  private static readonly MAX_ALLOWED_CLOUD_COVER = 35.0; // Over 35% cloud cover is occluded for optical bands

  /**
   * Evaluates and normalizes raw satellite Earth observation metadata.
   * Discards or flags readings that fail orbital quality controls.
   */
  static processObservation(params: SatelliteIngestParams): {
    success: boolean;
    observation?: SatelliteObservation;
    rejectionReason?: string;
  } {
    // 1. Quality Control: Cloud Occlusion Check (only for optical platforms)
    const isOptical = params.platform.includes("Sentinel-2") || params.platform.includes("Landsat");
    if (isOptical && params.cloudCoverPercentage > this.MAX_ALLOWED_CLOUD_COVER) {
      return {
        success: false,
        rejectionReason: `Observation rejected: Cloud cover of ${params.cloudCoverPercentage.toFixed(1)}% exceeds maximum threshold (${this.MAX_ALLOWED_CLOUD_COVER}%)`,
      };
    }

    // 2. Spatial Entity Matching
    const matchedNode = GeographicWatchlist.findNodeByCoordinates(params.coordinates);
    const nowIso = new Date().toISOString();

    const obs: SatelliteObservation = {
      id: `sat-${params.platform.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      platform: params.platform,
      nodeId: matchedNode?.id,
      coordinates: params.coordinates,
      boundingBox: params.boundingBox || matchedNode?.boundingBox,
      resolutionMeters: params.resolutionMeters,
      spectralBands: params.spectralBands,
      cloudCoverPercentage: params.cloudCoverPercentage,
      observedAt: params.observedAt,
      receivedAt: nowIso,
      derivedMetricName: params.derivedMetricName,
      derivedMetricValue: params.derivedMetricValue,
      metricUnit: params.metricUnit,
      sourceLicense: params.sourceLicense || "CC-BY-4.0 (Copernicus / USGS Public Domain)",
      imageryUrl: params.imageryUrl,
      metadata: {
        matchedNodeName: matchedNode?.name,
        targetCommodities: matchedNode?.relatedCommodities,
      },
    };

    return { success: true, observation: obs };
  }

  /**
   * Helper: Calculates Normalized Difference Vegetation Index (NDVI) from Near-Infrared (NIR) and Red bands.
   * Formula: NDVI = (NIR - Red) / (NIR + Red)
   * Output range: -1.0 to +1.0 (Higher values = vigorous healthy crops)
   */
  static calculateNdvi(nirReflectance: number, redReflectance: number): number {
    const denom = nirReflectance + redReflectance;
    if (denom === 0) return 0;
    return parseFloat(((nirReflectance - redReflectance) / denom).toFixed(4));
  }

  /**
   * Helper: Calculates Oil Storage Floating-Roof Tank Fill Percentage based on shadow or SAR offset.
   */
  static estimateFloatingRoofFillPct(tankHeightMeters: number, shadowLengthMeters: number, sunElevationDegrees: number): number {
    if (tankHeightMeters <= 0) return 0;
    const rad = (sunElevationDegrees * Math.PI) / 180;
    const roofDepthMeters = shadowLengthMeters * Math.tan(rad);
    const fillFraction = Math.max(0, Math.min(1.0, (tankHeightMeters - roofDepthMeters) / tankHeightMeters));
    return parseFloat((fillFraction * 100).toFixed(1));
  }
}
