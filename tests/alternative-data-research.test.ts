/**
 * Drawdown Intelligence Data Platform — Alternative Data Research Layer Tests
 *
 * Tests:
 *  1. Geographic Watchlist & Spatial Node Registry
 *  2. Satellite Earth Observation Adapter (Cloud filter, NDVI, Floating Roofs)
 *  3. AIS Maritime Tracking Adapter (Laden/Ballast, Chokepoint congestion)
 *  4. Weather & Climate Adapter (HDD, CDD, Soil moisture, Alerts)
 *  5. Multivariate Correlation Engine (Pearson r, Statistical significance)
 *  6. 7-Stage Signal Lifecycle State Machine (Guards, Leaps, Immutability)
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { GeographicWatchlist, STRATEGIC_NODES } from "../src/lib/data-platform/alternative/watchlist.ts";
import { SatelliteEarthObservationAdapter } from "../src/lib/data-platform/alternative/satellite.ts";
import { AISMaritimeAdapter } from "../src/lib/data-platform/alternative/ais.ts";
import { WeatherClimateAdapter } from "../src/lib/data-platform/alternative/weather.ts";
import { MultivariateCorrelator } from "../src/lib/data-platform/alternative/correlator.ts";
import { SignalStateMachine } from "../src/lib/data-platform/alternative/signal-machine.ts";
import type { PotentialSignal, SatelliteIngestParams, AISIngestRecord, WeatherIngestParams } from "../src/lib/data-platform/alternative/types.ts";

describe("Alternative Data Research Layer", () => {
  describe("1. Strategic Geographic Watchlist", () => {
    it("should register critical maritime chokepoints and commodity hubs", () => {
      const nodes = GeographicWatchlist.getAllNodes();
      assert.ok(nodes.length >= 10, "Must have at least 10 strategic nodes");

      const hormuz = GeographicWatchlist.getNode("node:strait-of-hormuz");
      assert.ok(hormuz);
      assert.equal(hormuz.type, "maritime_chokepoint");
      assert.ok(hormuz.relatedCommodities.includes("comm:crude-brent"));
      assert.ok(hormuz.relatedInstruments.includes("inst:cl"));

      const cushing = GeographicWatchlist.getNode("node:cushing-hub");
      assert.ok(cushing);
      assert.equal(cushing.type, "storage_hub");
      assert.ok(cushing.relatedCommodities.includes("comm:crude-wti"));
    });

    it("should match spatial coordinates to bounding box of strategic node", () => {
      // Coordinates inside Strait of Hormuz bounding box (lat 26.5, lon 56.3)
      const matched = GeographicWatchlist.findNodeByCoordinates({ latitude: 26.5, longitude: 56.3 });
      assert.ok(matched);
      assert.equal(matched.id, "node:strait-of-hormuz");

      // Coordinates outside any node (e.g. middle of South Pacific)
      const unmatched = GeographicWatchlist.findNodeByCoordinates({ latitude: -45.0, longitude: -120.0 });
      assert.equal(unmatched, undefined);
    });
  });

  describe("2. Satellite Earth Observation Adapter", () => {
    it("should reject optical satellite scenes with excessive cloud cover", () => {
      const params: SatelliteIngestParams = {
        platform: "Sentinel-2",
        coordinates: { latitude: 35.98, longitude: -96.76 }, // Cushing
        resolutionMeters: 10,
        spectralBands: ["B02", "B03", "B04", "B08"],
        cloudCoverPercentage: 45.0, // Exceeds 35% threshold!
        observedAt: new Date().toISOString(),
        derivedMetricName: "oil_storage_fill_pct",
        derivedMetricValue: 68.5,
        metricUnit: "%",
      };

      const result = SatelliteEarthObservationAdapter.processObservation(params);
      assert.equal(result.success, false);
      assert.ok(result.rejectionReason?.includes("Cloud cover"));
    });

    it("should normalize valid satellite observation and bind to geographic node", () => {
      const params: SatelliteIngestParams = {
        platform: "Sentinel-2",
        coordinates: { latitude: 35.98, longitude: -96.76 }, // Cushing Hub
        resolutionMeters: 10,
        spectralBands: ["B02", "B03", "B04", "B08"],
        cloudCoverPercentage: 12.0, // Clean scene
        observedAt: new Date().toISOString(),
        derivedMetricName: "oil_storage_fill_pct",
        derivedMetricValue: 71.2,
        metricUnit: "%",
      };

      const result = SatelliteEarthObservationAdapter.processObservation(params);
      assert.equal(result.success, true);
      assert.ok(result.observation);
      assert.equal(result.observation.nodeId, "node:cushing-hub");
      assert.equal(result.observation.derivedMetricValue, 71.2);
    });

    it("should accurately compute NDVI and floating roof fill percentage formulas", () => {
      // NDVI: (NIR - Red) / (NIR + Red)
      // NIR = 0.50, Red = 0.10 -> (0.40) / (0.60) = 0.6667
      const ndvi = SatelliteEarthObservationAdapter.calculateNdvi(0.50, 0.10);
      assert.equal(ndvi, 0.6667);

      // Floating roof: tank height 20m, shadow 10m at 45 deg sun elevation -> roof depth = 10 * tan(45) = 10m
      // Fill = (20 - 10) / 20 = 50%
      const fillPct = SatelliteEarthObservationAdapter.estimateFloatingRoofFillPct(20, 10, 45);
      assert.equal(fillPct, 50.0);
    });
  });

  describe("3. AIS Maritime Tracking Adapter", () => {
    it("should process transponder broadcast and detect laden status from draught", () => {
      const record: AISIngestRecord = {
        mmsi: "311000123",
        vesselName: "PACIFIC VOYAGER",
        vesselType: "crude_tanker",
        coordinates: { latitude: 26.55, longitude: 56.28 }, // Hormuz
        speedKnots: 12.4,
        draughtMeters: 18.5,
        maxDraughtMeters: 22.0, // 18.5 / 22 = 84% draught -> Laden
        destination: "NINGBO",
        observedAt: new Date().toISOString(),
      };

      const obs = AISMaritimeAdapter.processVesselObservation(record);
      assert.equal(obs.nodeId, "node:strait-of-hormuz");
      assert.equal(obs.vesselType, "crude_tanker");
      assert.equal(obs.metadata?.isLaden, true);
    });

    it("should aggregate chokepoint transit metrics and identify anchorage congestion", () => {
      const baseTime = new Date().toISOString();
      const fleet = [
        AISMaritimeAdapter.processVesselObservation({
          mmsi: "1",
          vesselName: "T1",
          vesselType: "crude_tanker",
          coordinates: { latitude: 26.55, longitude: 56.28 },
          speedKnots: 11.0,
          observedAt: baseTime,
        }),
        AISMaritimeAdapter.processVesselObservation({
          mmsi: "2",
          vesselName: "T2",
          vesselType: "crude_tanker",
          coordinates: { latitude: 26.56, longitude: 56.29 },
          speedKnots: 0.8, // Waiting at anchorage!
          observedAt: baseTime,
        }),
        AISMaritimeAdapter.processVesselObservation({
          mmsi: "3",
          vesselName: "L1",
          vesselType: "lng_carrier",
          coordinates: { latitude: 26.57, longitude: 56.30 },
          speedKnots: 14.2,
          observedAt: baseTime,
        }),
      ];

      const metrics = AISMaritimeAdapter.computeChokepointMetrics("node:strait-of-hormuz", fleet, 2);
      assert.equal(metrics.totalVesselsObserved, 3);
      assert.equal(metrics.tankersCount, 2);
      assert.equal(metrics.lngCarriersCount, 1);
      assert.equal(metrics.anchorageWaitingCount, 1); // vessel T2 speed <= 1.5 knots
      assert.equal(metrics.transitDeviationPct, 50.0); // (3 - 2) / 2 = +50%
    });
  });

  describe("4. Weather & Climate Adapter", () => {
    it("should calculate degree days (HDD / CDD) relative to 65F / 18.33C baseline", () => {
      // Winter day in Midwest: 5°C -> HDD = 18.33 - 5 = 13.3, CDD = 0
      const winterParams: WeatherIngestParams = {
        coordinates: { latitude: 41.5, longitude: -93.5 }, // US Corn Belt
        observedAt: new Date().toISOString(),
        temperatureCelsius: 5.0,
        precipitationMm24h: 0.0,
      };

      const winterObs = WeatherClimateAdapter.processWeatherObservation(winterParams);
      assert.equal(winterObs.nodeId, "node:us-corn-belt");
      assert.equal(winterObs.heatingDegreeDays, 13.3);
      assert.equal(winterObs.coolingDegreeDays, 0);

      // Summer heatwave in Texas: 34°C -> HDD = 0, CDD = 34 - 18.33 = 15.7
      const summerParams: WeatherIngestParams = {
        coordinates: { latitude: 28.94, longitude: -95.31 }, // Freeport LNG
        observedAt: new Date().toISOString(),
        temperatureCelsius: 34.0,
        precipitationMm24h: 12.5,
        alertEvent: "Extreme Heat Warning",
        alertSeverity: "warning",
        alertHeadline: "Excessive heat warning for Texas Gulf Coast",
      };

      const summerObs = WeatherClimateAdapter.processWeatherObservation(summerParams);
      assert.equal(summerObs.nodeId, "node:freeport-lng");
      assert.equal(summerObs.heatingDegreeDays, 0);
      assert.equal(summerObs.coolingDegreeDays, 15.7);
      assert.ok(summerObs.severeWeatherAlert);
      assert.equal(summerObs.severeWeatherAlert?.severity, "warning");
    });
  });

  describe("5. Multivariate Correlation Engine", () => {
    it("should calculate empirical Pearson correlation between alternative data and price returns", () => {
      // Strong positive relationship: higher tanker congestion -> higher crude price return
      const pairs = [
        { alternativeValue: 10, marketPriceReturnPct: 0.5 },
        { alternativeValue: 15, marketPriceReturnPct: 1.1 },
        { alternativeValue: 20, marketPriceReturnPct: 1.8 },
        { alternativeValue: 25, marketPriceReturnPct: 2.4 },
        { alternativeValue: 30, marketPriceReturnPct: 3.1 },
      ];

      const r = MultivariateCorrelator.calculatePearsonCorrelation(pairs);
      assert.ok(r > 0.95, `Expected strong positive correlation, got ${r}`);

      const result = MultivariateCorrelator.evaluateCorrelation({
        nodeId: "node:strait-of-hormuz",
        category: "ais",
        metricName: "tanker_anchorage_queue",
        currentValue: 32,
        baselineValue: 20,
        unit: "vessels",
        observedAt: new Date().toISOString(),
        historicalPairs: pairs,
        instrumentId: "inst:cl",
      });

      assert.equal(result.isCorrelated, true);
      assert.ok(result.signal);
      assert.equal(result.signal.state, "CORRELATED");
      assert.equal(result.anomalyPct, 60.0); // (32 - 20) / 20 = +60%
      assert.equal(result.signal.correlatedInstruments[0], "inst:cl");
    });

    it("should reject spurious or weak correlations (|r| < 0.50)", () => {
      // No correlation (flat random noise)
      const noisyPairs = [
        { alternativeValue: 10, marketPriceReturnPct: 2.0 },
        { alternativeValue: 20, marketPriceReturnPct: -1.5 },
        { alternativeValue: 30, marketPriceReturnPct: 1.2 },
        { alternativeValue: 40, marketPriceReturnPct: -0.8 },
        { alternativeValue: 50, marketPriceReturnPct: 0.1 },
      ];

      const result = MultivariateCorrelator.evaluateCorrelation({
        nodeId: "node:us-corn-belt",
        category: "weather",
        metricName: "random_humidity_metric",
        currentValue: 55,
        baselineValue: 50,
        unit: "%",
        observedAt: new Date().toISOString(),
        historicalPairs: noisyPairs,
        instrumentId: "inst:zc",
      });

      assert.equal(result.isCorrelated, false);
      assert.equal(result.signal, undefined);
      assert.ok(result.notes.includes("Insufficient correlation"));
    });
  });

  describe("6. 7-Stage Signal Lifecycle State Machine", () => {
    it("should enforce strict transitions and prohibit skipping states", () => {
      const nowIso = new Date().toISOString();
      const initialSignal: PotentialSignal = {
        id: "sig-test-1",
        state: "OBSERVED",
        nodeId: "node:strait-of-hormuz",
        nodeName: "Strait of Hormuz",
        category: "ais",
        hypothesis: "Tanker transit bottleneck",
        primaryMetric: "chokepoint_queue",
        observedValue: 45,
        unit: "vessels",
        anomalyMagnitudePct: 35.0,
        correlatedInstruments: ["inst:cl"],
        correlationCoefficient: 0.72,
        confidence: "INFERRED",
        sourceReliability: "PRIMARY",
        stateHistory: [{ state: "OBSERVED", timestamp: nowIso }],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Illegal leap: OBSERVED -> PUBLISHED must fail!
      const illegalLeap = SignalStateMachine.transition(initialSignal, "PUBLISHED", {
        publishedNotice: "Premature publication",
      });
      assert.equal(illegalLeap.success, false);
      assert.ok(illegalLeap.error?.includes("Illegal transition"));

      // Valid: OBSERVED -> CORRELATED
      const step1 = SignalStateMachine.transition(initialSignal, "CORRELATED", {
        note: "Empirical correlation verified",
      });
      assert.equal(step1.success, true);
      assert.equal(step1.signal.state, "CORRELATED");

      // Valid: CORRELATED -> CANDIDATE (meets |anomaly| >= 10% and |r| >= 0.50)
      const step2 = SignalStateMachine.transition(step1.signal, "CANDIDATE", {
        note: "Promoted to research candidate",
      });
      assert.equal(step2.success, true);
      assert.equal(step2.signal.state, "CANDIDATE");

      // Valid: CANDIDATE -> RESEARCHING
      const step3 = SignalStateMachine.transition(step2.signal, "RESEARCHING", {
        note: "Analyst assigned to review seasonal shipping patterns",
      });
      assert.equal(step3.success, true);
      assert.equal(step3.signal.state, "RESEARCHING");

      // Valid: RESEARCHING -> VERIFIED
      const step4 = SignalStateMachine.transition(step3.signal, "VERIFIED", {
        note: "Corroborated by independent satellite AIS and radar feed",
      });
      assert.equal(step4.success, true);
      assert.equal(step4.signal.state, "VERIFIED");

      // Publication without notice must fail
      const failedPub = SignalStateMachine.transition(step4.signal, "PUBLISHED");
      assert.equal(failedPub.success, false);
      assert.ok(failedPub.error?.includes("publishedNotice"));

      // Valid: VERIFIED -> PUBLISHED
      const step5 = SignalStateMachine.transition(step4.signal, "PUBLISHED", {
        publishedNotice: "Strait of Hormuz tanker queue is 35% above seasonal baseline, correlating with Brent front-month spread.",
      });
      assert.equal(step5.success, true);
      assert.equal(step5.signal.state, "PUBLISHED");
      assert.equal(step5.signal.confidence, "KNOWN");
      assert.equal(step5.signal.stateHistory.length, 6);
    });

    it("should allow rejection with a mandatory rejectionReason and prohibit further transitions", () => {
      const nowIso = new Date().toISOString();
      const signal: PotentialSignal = {
        id: "sig-test-reject",
        state: "CANDIDATE",
        nodeId: "node:cushing-hub",
        nodeName: "Cushing Hub",
        category: "satellite",
        hypothesis: "Roof fill anomaly",
        primaryMetric: "fill_pct",
        observedValue: 88,
        unit: "%",
        anomalyMagnitudePct: 20.0,
        correlatedInstruments: ["inst:cl"],
        correlationCoefficient: 0.65,
        confidence: "INFERRED",
        sourceReliability: "PRIMARY",
        stateHistory: [{ state: "CANDIDATE", timestamp: nowIso }],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Rejection without reason must fail
      const failReject = SignalStateMachine.transition(signal, "REJECTED");
      assert.equal(failReject.success, false);

      // Rejection with reason succeeds
      const rejected = SignalStateMachine.transition(signal, "REJECTED", {
        rejectionReason: "False positive caused by shadow distortion at low sun elevation angle.",
      });
      assert.equal(rejected.success, true);
      assert.equal(rejected.signal.state, "REJECTED");
      assert.equal(rejected.signal.rejectionReason, "False positive caused by shadow distortion at low sun elevation angle.");

      // Terminal state: REJECTED cannot transition further
      const postReject = SignalStateMachine.transition(rejected.signal, "PUBLISHED", {
        publishedNotice: "Should never publish",
      });
      assert.equal(postReject.success, false);
    });
  });
});
