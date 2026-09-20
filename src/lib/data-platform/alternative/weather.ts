/**
 * Drawdown Intelligence Data Platform — Weather & Climate Adapter
 *
 * Domain: Atmospheric Physics, Degree Days & Agricultural Climate Indicators
 * Platforms: NOAA National Weather Service, ECMWF, Open-Meteo Open Data API
 * Reliability: PRIMARY (Official meteorological telemetry)
 * Confidence: VERIFIED (for historical/current observations) / INFERRED (for anomaly calculations)
 *
 * Grounded in fundamental market mechanics:
 *  - Heating Degree Days (HDD): Measures heating demand for Natural Gas (Henry Hub) and Heating Oil
 *  - Cooling Degree Days (CDD): Measures power grid air conditioning load
 *  - Soil Moisture & Precipitation: Measures drought stress on Midwest Corn & Soybean yields
 *  - Freezing alerts on Gulf Coast LNG liquefaction infrastructure
 */

import type {
  WeatherObservation,
  GeoCoordinates,
} from "./types.ts";
import { GeographicWatchlist } from "./watchlist.ts";

export interface WeatherIngestParams {
  coordinates: GeoCoordinates;
  observedAt: string;
  temperatureCelsius: number;
  precipitationMm24h: number;
  soilMoistureIndex?: number;
  alertHeadline?: string;
  alertSeverity?: "advisory" | "watch" | "warning";
  alertEvent?: string;
  sourceProvider?: string;
}

export class WeatherClimateAdapter {
  private static readonly BASELINE_TEMP_CELSIUS = 18.33; // 65°F standard degree day baseline

  /**
   * Evaluates and normalizes raw meteorological observations into canonical observations.
   */
  static processWeatherObservation(params: WeatherIngestParams): WeatherObservation {
    const matchedNode = GeographicWatchlist.findNodeByCoordinates(params.coordinates);
    const nowIso = new Date().toISOString();

    // Calculate Heating / Cooling degree days
    const delta = params.temperatureCelsius - this.BASELINE_TEMP_CELSIUS;
    const hdd = delta < 0 ? parseFloat(Math.abs(delta).toFixed(1)) : 0;
    const cdd = delta > 0 ? parseFloat(delta.toFixed(1)) : 0;

    let severeAlert: WeatherObservation["severeWeatherAlert"] | undefined = undefined;
    if (params.alertEvent && params.alertSeverity && params.alertHeadline) {
      severeAlert = {
        severity: params.alertSeverity,
        event: params.alertEvent,
        headline: params.alertHeadline,
      };
    }

    return {
      id: `wx-${params.coordinates.latitude.toFixed(2)}_${params.coordinates.longitude.toFixed(2)}-${Date.now()}`,
      nodeId: matchedNode?.id,
      coordinates: params.coordinates,
      observedAt: params.observedAt,
      temperatureCelsius: params.temperatureCelsius,
      precipitationMm24h: params.precipitationMm24h,
      heatingDegreeDays: hdd,
      coolingDegreeDays: cdd,
      soilMoistureIndex: params.soilMoistureIndex,
      severeWeatherAlert: severeAlert,
      sourceProvider: params.sourceProvider || "Open-Meteo / NOAA Public Meteorological Mesh",
      metadata: {
        matchedNodeName: matchedNode?.name,
        targetCommodities: matchedNode?.relatedCommodities,
      },
    };
  }

  /**
   * Helper: Calculates temperature anomaly relative to 30-year climatological normal.
   */
  static calculateTemperatureAnomaly(observedTemp: number, climatologicalNormal: number): number {
    return parseFloat((observedTemp - climatologicalNormal).toFixed(2));
  }
}
