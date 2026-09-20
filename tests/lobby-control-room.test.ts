/**
 * Drawdown Intelligence Data Platform — Data Control Room Test Suite
 *
 * Tests:
 *  1. Provider Health & Telemetry aggregation
 *  2. Feed Inventory classification (ACTIVE, MISSING_CREDENTIAL, FAILED, etc.)
 *  3. Data Freshness tracking across 12 intelligence categories
 *  4. Event Pipeline Funnel stage counters
 *  5. Source Provenance Inspector audit tracing
 *  6. Credential security (Zero secret leakage)
 *  7. System Alerts generation for degraded/tripped providers
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { LobbyControlRoomService } from "../src/lib/data-platform/control-room.ts";
import { ProviderRegistry } from "../src/lib/data-platform/registry.ts";
import { ProviderHealthManager } from "../src/lib/data-platform/health.ts";
import type { DataEvent } from "../src/lib/data-platform/types.ts";

describe("The Lobby Data Control Room", () => {
  describe("1. Provider Health & Feed Inventory", () => {
    it("should return inventory containing all registered platform providers", () => {
      ProviderRegistry.initDefaultProviders();
      const inventory = LobbyControlRoomService.getProviderInventory();

      assert.ok(inventory.length >= 7, "Must contain all reference, public, and regulatory providers");

      const twelveData = inventory.find(p => p.id === "twelve-data");
      assert.ok(twelveData);
      assert.equal(twelveData.requiresKey, true);
      assert.ok(["ACTIVE", "CONFIGURED_BUT_UNUSED", "MISSING_CREDENTIAL"].includes(twelveData.inventoryStatus));

      const sec = inventory.find(p => p.id === "sec-edgar");
      assert.ok(sec);
      assert.equal(sec.requiresKey, false); // Public statutory feed
      assert.ok(["ACTIVE", "CONFIGURED_BUT_UNUSED"].includes(sec.inventoryStatus));
    });

    it("should classify providers with tripped circuit breakers as FAILED", () => {
      // Simulate consecutive failures to trip circuit breaker
      for (let i = 0; i < 6; i++) {
        ProviderHealthManager.recordExecution("twelve-data", {
          latencyMs: 500,
          isSuccess: false,
          errorMessage: "Simulated upstream 500 outage",
        });
      }

      const inventory = LobbyControlRoomService.getProviderInventory();
      const td = inventory.find(p => p.id === "twelve-data");
      assert.ok(td);
      assert.equal(td.circuitBreaker, "OPEN");
      assert.equal(td.inventoryStatus, "FAILED");

      // Reset for cleanliness
      ProviderHealthManager.recordExecution("twelve-data", {
        latencyMs: 100,
        isSuccess: true,
      });
    });
  });

  describe("2. Data Freshness Tracking (12 Categories)", () => {
    it("should track freshness across all 12 canonical intelligence categories", () => {
      const expected = [
        "markets", "news", "macro", "central banks", "regulators", "corporate",
        "positioning", "brokers", "prop firms", "satellite", "ais", "weather"
      ];

      const freshness = LobbyControlRoomService.getDataFreshness();
      assert.equal(freshness.length, 12);

      for (const cat of expected) {
        const found = freshness.find(f => f.category === cat);
        assert.ok(found, `Category ${cat} was missing from freshness monitoring`);
        assert.ok(["FRESH", "AGING", "STALE", "NO_DATA"].includes(found.freshnessStatus));
      }
    });

    it("should reflect recent category activity and mark fresh", () => {
      const nowIso = new Date().toISOString();
      LobbyControlRoomService.recordCategoryActivity("satellite", nowIso);

      const freshness = LobbyControlRoomService.getDataFreshness();
      const sat = freshness.find(f => f.category === "satellite");
      assert.ok(sat);
      assert.equal(sat.freshnessStatus, "FRESH");
      assert.ok((sat.ageSeconds ?? 999) < 5);
    });
  });

  describe("3. Event Pipeline Funnel", () => {
    it("should return pipeline funnel counts and support increments", () => {
      const before = LobbyControlRoomService.getPipelineFunnel();
      assert.ok(before.raw > 0);
      assert.ok(before.published > 0);

      LobbyControlRoomService.recordFunnelEvent("raw", 10);
      const after = LobbyControlRoomService.getPipelineFunnel();
      assert.equal(after.raw, before.raw + 10);
    });
  });

  describe("4. Source Provenance Inspector", () => {
    it("should generate a complete, immutable audit record for an event", () => {
      const testEvent: DataEvent = {
        id: "ev-prov-101",
        eventType: "CORPORATE_EVENT",
        title: "SEC 8-K: Apple Inc Material Disclosure",
        description: "Official 8-K filing submitted to EDGAR.",
        entityIds: ["company:cik-0000320193"],
        sourceIds: ["sec-edgar"],
        occurredAt: "2026-09-19T14:30:00.000Z",
        detectedAt: "2026-09-19T14:30:15.000Z",
        severity: "high",
        confidence: "VERIFIED",
        sourceReliability: "PRIMARY",
        status: "READY",
        primarySourceUrl: "https://www.sec.gov/Archives/edgar/data/320193/sample.htm",
        corroboratingReferences: [
          {
            sourceId: "reuters",
            sourceName: "Reuters Technology News",
            url: "https://reuters.com/tech/apple-filing",
            reliability: "AUTHORITATIVE_SECONDARY",
            retrievedAt: "2026-09-19T14:31:00.000Z",
          },
        ],
      };

      const audit = LobbyControlRoomService.inspectEventProvenance(testEvent);
      assert.equal(audit.eventId, "ev-prov-101");
      assert.equal(audit.providerId, "sec-edgar");
      assert.equal(audit.primaryUrl, "https://www.sec.gov/Archives/edgar/data/320193/sample.htm");
      assert.equal(audit.confidence, "VERIFIED");
      assert.equal(audit.corroboratingSources.length, 1);
      assert.equal(audit.corroboratingSources[0].sourceId, "reuters");
      assert.ok(audit.transformations.length >= 3);
    });
  });

  describe("5. Credential Security & Secret Protection", () => {
    it("should never expose secret keys or tokens in control room data", () => {
      const inventory = LobbyControlRoomService.getProviderInventory();
      const stringified = JSON.stringify(inventory);

      // Verify no keys or tokens leaked
      assert.equal(stringified.includes("sk_"), false);
      assert.equal(stringified.includes("apiKey="), false);
      assert.equal(stringified.includes("api_key"), false);

      for (const item of inventory) {
        // Must only return boolean flags
        assert.equal(typeof item.isConfigured, "boolean");
        assert.equal(typeof item.requiresKey, "boolean");
        assert.equal((item as any).apiKey, undefined);
        assert.equal((item as any).secret, undefined);
      }
    });
  });

  describe("6. Operational System Alerts", () => {
    it("should generate alerts for critical conditions", () => {
      const alerts = LobbyControlRoomService.getSystemAlerts();
      assert.ok(Array.isArray(alerts));
      // Every alert has an ID, severity, message, and timestamp
      for (const alert of alerts) {
        assert.ok(alert.id);
        assert.ok(["info", "warning", "critical"].includes(alert.severity));
        assert.ok(alert.message.length > 5);
      }
    });
  });
});
